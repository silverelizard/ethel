#[macro_use]
extern crate rocket;

pub mod auth;
pub mod error;

use rocket::http::Status;
use rocket::request::{FromRequest, Outcome, Request};
use rocket::serde::{Deserialize, Serialize};
use rocket_sync_db_pools::database;

/// Request guard that rejects cross-site state-changing requests (CSRF).
///
/// Uses `Sec-Fetch-Site` when the browser sends it; otherwise falls back to
/// comparing `Origin` with `Host`. Requests with neither header (curl and
/// other non-browser clients) are allowed, since browsers always send
/// `Origin` on cross-origin POST/PUT/DELETE.
pub struct SameOrigin;

#[rocket::async_trait]
impl<'r> FromRequest<'r> for SameOrigin {
    type Error = ();

    async fn from_request(req: &'r Request<'_>) -> Outcome<Self, ()> {
        let headers = req.headers();
        let forbidden = Outcome::Error((Status::Forbidden, ()));

        match headers.get_one("Sec-Fetch-Site") {
            Some("same-origin") | Some("none") => return Outcome::Success(SameOrigin),
            Some(_) => return forbidden,
            None => {}
        }

        match (headers.get_one("Origin"), headers.get_one("Host")) {
            (None, _) => Outcome::Success(SameOrigin),
            (Some(origin), Some(host)) if origin_host(origin) == Some(host) => {
                Outcome::Success(SameOrigin)
            }
            _ => forbidden,
        }
    }
}

/// Extracts `host[:port]` from an Origin value like `http://localhost:8000`.
fn origin_host(origin: &str) -> Option<&str> {
    origin.split_once("://").map(|(_, rest)| rest.trim_end_matches('/'))
}

#[database("my_db")]
pub struct Db(diesel::PgConnection);

#[derive(Serialize, Deserialize, Debug)]
#[serde(crate = "rocket::serde")]
pub struct ApiError {
    pub details: String,
}

/// Trims a user-supplied name and rejects blank ones (422), so the stored
/// value matches what the unique indexes compare.
pub fn normalize_name(name: &str) -> Result<String, error::HttpError> {
    let trimmed = name.trim();
    if trimmed.is_empty() {
        return Err(error::HttpError::new(Status::UnprocessableEntity, "name is required"));
    }
    Ok(trimmed.to_string())
}
