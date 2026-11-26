#![feature(decl_macro)]

#[macro_use] extern crate rocket;
#[macro_use] extern crate diesel;

use std::path::{PathBuf, Path};

use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};
use rocket::{Build, Config, Rocket};
use rocket::fs::{FileServer, relative, NamedFile};
use rocket::fairing::AdHoc;
use ethel::auth::{self, AuthConfig};
use ethel::error;
use ethel::Db;

pub mod schema;
pub mod models;
pub mod routes;

/// SPA fallback: any GET that isn't a static asset or an API route serves the
/// frontend's index.html, so client-side routes (e.g. /bottles) survive a
/// page refresh. Unknown /api/* paths still 404.
#[get("/<path..>", rank = 3)]
pub(crate) async fn fallback_url(path: PathBuf) -> Option<NamedFile> {
    if path.starts_with("api") {
        return None;
    }
    NamedFile::open(Path::new(relative!("build")).join("index.html")).await.ok()
}


#[get("/<file..>", rank=2)]
async fn files(file: PathBuf) -> Option<NamedFile> {
    NamedFile::open(Path::new("static/").join(file)).await.ok()
}


const MIGRATIONS: EmbeddedMigrations = embed_migrations!("migrations");

async fn run_migrations(rocket: Rocket<Build>) -> Rocket<Build> {
    let conn = Db::get_one(&rocket)
        .await
        .expect("database connection for migrations");
    conn.run(|c| {
        c.run_pending_migrations(MIGRATIONS)
            .expect("failed to run database migrations");
    })
    .await;
    rocket
}

#[launch]
fn rocket() -> _ {
    // Load .env in development; a no-op when absent, and never overrides
    // variables already set in the environment (e.g. by docker compose).
    dotenvy::dotenv().ok();

    let mut figment = Config::figment();
    if let Ok(url) = std::env::var("DATABASE_URL") {
        figment = figment.merge(("databases.my_db.url", url));
    }

    let auth = AuthConfig::from_env().unwrap_or_else(|e| panic!("{e}"));

    let rocket = rocket::custom(figment)
        .attach(AdHoc::config::<Config>())
        .attach(Db::fairing())
        .attach(AdHoc::on_ignite("Run migrations", run_migrations));
    mount_app(rocket, auth)
}

/// Routes, catchers and managed state, without the database fairings, so
/// tests can exercise the auth layer without a running Postgres.
fn mount_app(rocket: Rocket<Build>, auth: AuthConfig) -> Rocket<Build> {
    rocket
        .manage(auth)
        .register("/api", catchers![auth::unauthorized, auth::forbidden, error::api_default])
        .mount("/api/auth", routes![auth::login, auth::logout, auth::me])
        .mount("/", FileServer::from(relative!("/build")).rank(1))
        .mount("/static", routes![files,])
        .mount("/", routes![fallback_url,])
        .mount("/api/bottles", routes![
            routes::bottles::random,
            routes::bottles::create,
            routes::bottles::get,
            routes::bottles::delete,
            routes::bottles::update
            ])
        .mount("/api/storage", routes![
            routes::storage::create,
            routes::storage::get,
            routes::storage::delete,
            routes::storage::update
        ])
        .mount("/api/categories", routes![
            routes::categories::create,
            routes::categories::get,
            routes::categories::delete,
            routes::categories::update
        ])
        .mount("/api/sub_categories", routes![
            routes::sub_categories::create,
            routes::sub_categories::get,
            routes::sub_categories::delete,
            routes::sub_categories::update
        ])
}

#[cfg(test)]
mod tests {
    use super::*;
    use rocket::http::{ContentType, Cookie, Method, Status};
    use rocket::local::blocking::Client;

    const PASSWORD: &str = "correct horse battery";

    /// Needs the dev database running (Rocket refuses to start routes that use
    /// `Db` without its pool). Tests never write to it: unauthenticated
    /// requests stop at the guard, and authenticated checks only use GET.
    fn client() -> Client {
        dotenvy::dotenv().ok();
        let url = std::env::var("DATABASE_URL")
            .expect("DATABASE_URL must point at the dev database to run these tests");
        // Small pool: tests run in parallel and each opens its own.
        let figment = Config::figment()
            .merge(("databases.my_db.url", url))
            .merge(("databases.my_db.pool_size", 2));
        let auth = AuthConfig::new(PASSWORD, false).unwrap();
        let rocket = rocket::custom(figment).attach(Db::fairing());
        Client::tracked(mount_app(rocket, auth))
            .expect("failed to start; is the dev database up? (see README)")
    }

    fn login(client: &Client, password: &str) -> Status {
        client
            .post("/api/auth/login")
            .header(ContentType::JSON)
            .body(format!(r#"{{"password":"{password}"}}"#))
            .dispatch()
            .status()
    }

    /// Every mounted /api route except login/logout, with `<id>` filled in.
    fn api_routes(client: &Client) -> Vec<(Method, String)> {
        let routes: Vec<_> = client
            .rocket()
            .routes()
            .map(|r| (r.method, r.uri.to_string()))
            .filter(|(_, uri)| uri.starts_with("/api/"))
            .filter(|(_, uri)| uri != "/api/auth/login" && uri != "/api/auth/logout")
            .map(|(m, uri)| {
                let path = uri.split('?').next().unwrap_or(&uri).replace("<id>", "1");
                (m, path)
            })
            .collect();
        assert!(routes.len() >= 18, "expected 16 CRUD routes + /me + /random, got {routes:?}");
        routes
    }

    /// Reads are public (the public bottle list); everything else needs a session.
    fn is_public(method: Method, uri: &str) -> bool {
        method == Method::Get && uri != "/api/auth/me"
    }

    fn protected_routes(client: &Client) -> Vec<(Method, String)> {
        api_routes(client).into_iter().filter(|(m, u)| !is_public(*m, u)).collect()
    }

    fn status_of(client: &Client, method: Method, uri: &str) -> Status {
        client
            .req(method, uri.to_string())
            .header(ContentType::JSON)
            .body("{}")
            .dispatch()
            .status()
    }

    #[test]
    fn every_write_route_requires_auth() {
        let client = client();
        let routes = protected_routes(&client);
        assert!(routes.len() >= 13, "expected 12 writes + /me, got {routes:?}");
        for (method, uri) in routes {
            assert_eq!(status_of(&client, method, &uri), Status::Unauthorized, "{method} {uri}");
        }
    }

    #[test]
    fn read_routes_are_public() {
        let client = client();
        let reads: Vec<_> =
            api_routes(&client).into_iter().filter(|(m, u)| is_public(*m, u)).collect();
        assert_eq!(reads.len(), 5, "4 lists + /random, got {reads:?}");
        for (method, uri) in reads {
            let status = status_of(&client, method, &uri);
            // /random may 404 on an empty database; anything but 401/403 counts as public.
            assert!(
                status != Status::Unauthorized && status != Status::Forbidden,
                "{method} {uri} should be public, got {status}"
            );
        }
    }

    #[test]
    fn unauthorized_response_is_json() {
        let client = client();
        let res = client.delete("/api/bottles/1").dispatch();
        assert_eq!(res.status(), Status::Unauthorized);
        assert_eq!(res.content_type(), Some(ContentType::JSON));
    }

    #[test]
    fn wrong_password_is_rejected() {
        let client = client();
        assert_eq!(login(&client, "not the password"), Status::Unauthorized);
        assert!(client.cookies().get_private(auth::SESSION_COOKIE).is_none());
    }

    #[test]
    fn login_sets_a_hardened_cookie_and_unlocks_the_api() {
        let client = client();
        let res = client
            .post("/api/auth/login")
            .header(ContentType::JSON)
            .body(format!(r#"{{"password":"{PASSWORD}"}}"#))
            .dispatch();
        assert_eq!(res.status(), Status::NoContent);
        let set_cookie = res.headers().get_one("Set-Cookie").unwrap().to_string();
        assert!(set_cookie.contains("HttpOnly"), "{set_cookie}");
        assert!(set_cookie.contains("SameSite=Strict"), "{set_cookie}");

        assert_eq!(client.get("/api/auth/me").dispatch().status(), Status::NoContent);
        for (method, uri) in protected_routes(&client) {
            if method == Method::Get {
                let status = status_of(&client, method, &uri);
                assert_eq!(status.class(), rocket::http::StatusClass::Success, "{method} {uri}: {status}");
            }
        }
    }

    #[test]
    fn logout_ends_the_session() {
        let client = client();
        assert_eq!(login(&client, PASSWORD), Status::NoContent);
        assert_eq!(client.post("/api/auth/logout").dispatch().status(), Status::NoContent);
        assert_eq!(client.get("/api/auth/me").dispatch().status(), Status::Unauthorized);
    }

    #[test]
    fn forged_and_expired_cookies_are_rejected() {
        let client = client();
        // Plaintext (not encrypted with secret_key) cookie value.
        let forged = client
            .get("/api/auth/me")
            .cookie(Cookie::new(auth::SESSION_COOKIE, "9999999999"))
            .dispatch();
        assert_eq!(forged.status(), Status::Unauthorized);

        let thirty_one_days_ago = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_secs()
            - 31 * 24 * 60 * 60;
        let expired = client
            .get("/api/auth/me")
            .private_cookie(Cookie::new(auth::SESSION_COOKIE, thirty_one_days_ago.to_string()))
            .dispatch();
        assert_eq!(expired.status(), Status::Unauthorized);
    }

    #[test]
    fn frontend_stays_public() {
        let client = client();
        assert_eq!(client.get("/").dispatch().status(), Status::Ok);
        assert_eq!(client.get("/bottles").dispatch().status(), Status::Ok);
    }

    /// Logged-in client. These tests only send writes the database rejects,
    /// or target an id that doesn't exist, so nothing is modified.
    fn logged_in() -> Client {
        let client = client();
        assert_eq!(login(&client, PASSWORD), Status::NoContent);
        client
    }

    const MISSING_ID: i16 = i16::MAX;

    fn json_error(res: rocket::local::blocking::LocalResponse<'_>) -> (Status, String) {
        let status = res.status();
        assert_eq!(res.content_type(), Some(ContentType::JSON), "{status} should have a JSON body");
        let body: ethel::ApiError = res.into_json().expect("ApiError body");
        (status, body.details)
    }

    #[test]
    fn create_with_missing_reference_is_422_not_200() {
        let client = logged_in();
        let body = format!(
            r#"{{"name":"x","category_id":{MISSING_ID},"sub_category_ids":[],"storage_id":{MISSING_ID}}}"#
        );
        let res = client.post("/api/bottles/").header(ContentType::JSON).body(body).dispatch();
        let (status, details) = json_error(res);
        assert_eq!(status, Status::UnprocessableEntity);
        assert!(details.ends_with("does not refer to an existing record"), "{details}");
        assert!(!details.contains("constraint"), "raw database error leaked: {details}");
    }

    #[test]
    fn update_and_delete_of_missing_row_are_404() {
        let client = logged_in();
        let res = client
            .put(format!("/api/categories/{MISSING_ID}"))
            .header(ContentType::JSON)
            .body(r#"{"name":"x"}"#)
            .dispatch();
        assert_eq!(json_error(res).0, Status::NotFound);

        let res = client.delete(format!("/api/categories/{MISSING_ID}")).dispatch();
        assert_eq!(json_error(res).0, Status::NotFound);
    }

    /// Fetches a JSON list from the API; used to find an existing row to collide with.
    fn list(client: &Client, uri: &str) -> Vec<rocket::serde::json::Value> {
        client.get(uri).dispatch().into_json().expect("JSON list")
    }

    fn post_json(client: &Client, uri: &str, body: String) -> (Status, String) {
        json_error(client.post(uri.to_string()).header(ContentType::JSON).body(body).dispatch())
    }

    /// Changes case and adds whitespace, so the test also covers normalization.
    fn variant(name: &str) -> String {
        format!("  {}  ", name.to_uppercase())
    }

    #[test]
    fn duplicate_category_name_is_409() {
        let client = logged_in();
        let Some(existing) = list(&client, "/api/categories/").into_iter().next() else {
            eprintln!("skipped: no categories in the dev database");
            return;
        };
        let name = variant(existing["name"].as_str().unwrap());
        let (status, details) = post_json(&client, "/api/categories/", format!(r#"{{"name":{name:?}}}"#));
        assert_eq!(status, Status::Conflict);
        assert_eq!(details, "A category with that name already exists");
    }

    #[test]
    fn duplicate_sub_category_name_in_same_category_is_409() {
        let client = logged_in();
        let Some(existing) = list(&client, "/api/sub_categories/").into_iter().next() else {
            eprintln!("skipped: no sub-categories in the dev database");
            return;
        };
        let name = variant(existing["name"].as_str().unwrap());
        let body = format!(r#"{{"name":{name:?},"category_id":{}}}"#, existing["category_id"]);
        let (status, details) = post_json(&client, "/api/sub_categories/", body);
        assert_eq!(status, Status::Conflict);
        assert_eq!(details, "That category already has a sub-category with that name");
    }

    #[test]
    fn blank_names_are_rejected() {
        let client = logged_in();
        let (status, details) = post_json(&client, "/api/categories/", r#"{"name":"   "}"#.into());
        assert_eq!((status, details.as_str()), (Status::UnprocessableEntity, "name is required"));

        let (status, _) =
            post_json(&client, "/api/sub_categories/", r#"{"name":"","category_id":1}"#.into());
        assert_eq!(status, Status::UnprocessableEntity);
    }

    #[test]
    fn malformed_body_and_unknown_routes_get_json_errors() {
        let client = logged_in();
        let res = client.post("/api/categories/").header(ContentType::JSON).body(r#"{"nope":1}"#).dispatch();
        assert_eq!(json_error(res).0, Status::UnprocessableEntity);

        let res = client.get("/api/does-not-exist").dispatch();
        assert_eq!(json_error(res).0, Status::NotFound);
    }

    #[test]
    fn random_bottle_with_no_matches_is_404() {
        let client = logged_in();
        for uri in [
            format!("/api/bottles/random?category_id={MISSING_ID}"),
            format!("/api/bottles/random?sub_category_id={MISSING_ID}"),
            format!("/api/bottles/random?category_id={MISSING_ID}&sub_category_id={MISSING_ID}"),
        ] {
            let (status, details) = json_error(client.get(&uri).dispatch());
            assert_eq!(status, Status::NotFound, "{uri}");
            assert_eq!(details, "No bottles match those filters", "{uri}");
        }
    }

    #[test]
    fn random_bottle_rejects_malformed_filters() {
        let client = logged_in();
        for (uri, field) in [
            ("/api/bottles/random?category_id=abc", "category_id"),
            ("/api/bottles/random?sub_category_id=1.5", "sub_category_id"),
            ("/api/bottles/random?category_id=99999", "category_id"),
        ] {
            let (status, details) = json_error(client.get(uri).dispatch());
            assert_eq!(status, Status::UnprocessableEntity, "{uri}");
            assert_eq!(details, format!("{field} must be a whole number"), "{uri}");
        }
    }

    #[test]
    fn weak_or_missing_password_refuses_to_start() {
        assert!(AuthConfig::new("", false).is_err());
        assert!(AuthConfig::new("short", false).is_err());
    }
}
