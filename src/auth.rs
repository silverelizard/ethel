//! Shared-password login with an encrypted session cookie.
//!
//! `POST /api/auth/login` checks the password from `ETHEL_PASSWORD` and sets a
//! Rocket private cookie (encrypted + authenticated with `secret_key`). Every
//! API handler takes an [`Authenticated`] guard, which rejects requests
//! without a valid, unexpired session cookie with a 401.

use std::time::{Duration, SystemTime, UNIX_EPOCH};

use rocket::http::{Cookie, CookieJar, SameSite, Status};
use rocket::request::{FromRequest, Outcome, Request};
use rocket::serde::json::Json;
use rocket::serde::Deserialize;
use rocket::State;
use sha2::{Digest, Sha256};
use subtle::ConstantTimeEq;

use crate::{ApiError, SameOrigin};

pub const SESSION_COOKIE: &str = "ethel_session";
const SESSION_MAX_AGE: Duration = Duration::from_secs(30 * 24 * 60 * 60);
const MIN_PASSWORD_LEN: usize = 12;
const FAILED_LOGIN_DELAY: Duration = Duration::from_millis(500);

/// Login configuration, read once at launch.
pub struct AuthConfig {
    password_hash: [u8; 32],
    secure_cookie: bool,
}

impl AuthConfig {
    /// Builds the config from a password, refusing weak or missing ones.
    pub fn new(password: &str, secure_cookie: bool) -> Result<Self, String> {
        if password.chars().count() < MIN_PASSWORD_LEN {
            return Err(format!(
                "ETHEL_PASSWORD must be set and at least {MIN_PASSWORD_LEN} characters"
            ));
        }
        Ok(Self { password_hash: sha256(password), secure_cookie })
    }

    /// Reads `ETHEL_PASSWORD` and `ETHEL_SECURE_COOKIE` from the environment.
    /// Fails closed: the app must not start without a password.
    pub fn from_env() -> Result<Self, String> {
        let password = std::env::var("ETHEL_PASSWORD").unwrap_or_default();
        let secure = std::env::var("ETHEL_SECURE_COOKIE")
            .map(|v| matches!(v.as_str(), "1" | "true" | "yes"))
            .unwrap_or(false);
        Self::new(&password, secure)
    }

    fn password_matches(&self, candidate: &str) -> bool {
        // Hash both sides so the comparison is constant-time and length-independent.
        sha256(candidate).ct_eq(&self.password_hash).into()
    }
}

fn sha256(s: &str) -> [u8; 32] {
    Sha256::digest(s.as_bytes()).into()
}

fn now_secs() -> u64 {
    SystemTime::now().duration_since(UNIX_EPOCH).map(|d| d.as_secs()).unwrap_or(0)
}

/// Request guard: succeeds only with a valid, unexpired session cookie.
/// Put it before `Db` in handler arguments so unauthenticated requests are
/// rejected without taking a database connection.
pub struct Authenticated;

#[rocket::async_trait]
impl<'r> FromRequest<'r> for Authenticated {
    type Error = ();

    async fn from_request(req: &'r Request<'_>) -> Outcome<Self, ()> {
        let issued = req
            .cookies()
            .get_private(SESSION_COOKIE)
            .and_then(|c| c.value().parse::<u64>().ok());
        match issued {
            Some(t) if now_secs().saturating_sub(t) < SESSION_MAX_AGE.as_secs() => {
                Outcome::Success(Authenticated)
            }
            _ => Outcome::Error((Status::Unauthorized, ())),
        }
    }
}

#[derive(Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct Credentials {
    password: String,
}

type ApiResult = Result<Status, (Status, Json<ApiError>)>;

#[post("/login", format = "json", data = "<creds>")]
pub async fn login(
    _csrf: SameOrigin,
    config: &State<AuthConfig>,
    cookies: &CookieJar<'_>,
    creds: Json<Credentials>,
) -> ApiResult {
    if !config.password_matches(&creds.password) {
        // Crude brute-force throttling.
        rocket::tokio::time::sleep(FAILED_LOGIN_DELAY).await;
        return Err((
            Status::Unauthorized,
            Json(ApiError { details: "Incorrect password".into() }),
        ));
    }

    // Set both: Rocket otherwise adds a default 1-week `Expires` to private cookies.
    let max_age = rocket::time::Duration::seconds(SESSION_MAX_AGE.as_secs() as i64);
    let cookie = Cookie::build((SESSION_COOKIE, now_secs().to_string()))
        .http_only(true)
        .same_site(SameSite::Strict)
        .secure(config.secure_cookie)
        .path("/")
        .max_age(max_age)
        .expires(rocket::time::OffsetDateTime::now_utc() + max_age);
    cookies.add_private(cookie);
    Ok(Status::NoContent)
}

#[post("/logout")]
pub fn logout(_csrf: SameOrigin, cookies: &CookieJar<'_>) -> Status {
    cookies.remove_private(Cookie::build(SESSION_COOKIE).path("/"));
    Status::NoContent
}

/// Lets the frontend check whether it has a valid session.
#[get("/me")]
pub fn me(_auth: Authenticated) -> Status {
    Status::NoContent
}

#[catch(401)]
pub fn unauthorized() -> Json<ApiError> {
    Json(ApiError { details: "Unauthorized".into() })
}

#[catch(403)]
pub fn forbidden() -> Json<ApiError> {
    Json(ApiError { details: "Forbidden".into() })
}
