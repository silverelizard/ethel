#![feature(decl_macro)]

#[macro_use] extern crate rocket;
#[macro_use] extern crate diesel;

use std::path::{PathBuf, Path};

use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};
use rocket::{Build, Config, Rocket};
use rocket::fs::{FileServer, relative, NamedFile};
use rocket::fairing::AdHoc;
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

    rocket::custom(figment)
        .attach(AdHoc::config::<Config>())
        .attach(Db::fairing())
        .attach(AdHoc::on_ignite("Run migrations", run_migrations))
        // .mount("/", routes![routes::index])
        .mount("/", FileServer::from(relative!("/build")).rank(1))
        .mount("/static", routes![files,])
        .mount("/", routes![fallback_url,])
        .mount("/api/bottles", routes![
            // routes::bottles::get_random_bottle,
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
