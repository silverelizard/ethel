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

#[get("/<_..>", rank = 3)]
pub(crate) fn fallback_url() -> &'static str {
    "Hey, this is the fallback url"
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
        .mount("/bottles", routes![
            // routes::bottles::get_random_bottle,
            routes::bottles::create,
            routes::bottles::get,
            routes::bottles::delete,
            routes::bottles::update
            ])
        .mount("/storage", routes![
            routes::storage::create,
            routes::storage::get,
            routes::storage::delete,
            routes::storage::update
        ])
        .mount("/categories", routes![
            routes::categories::create,
            routes::categories::get,
            routes::categories::delete,
            routes::categories::update
        ])
        .mount("/sub_categories", routes![
            routes::sub_categories::create,
            routes::sub_categories::get,
            routes::sub_categories::delete,
            routes::sub_categories::update
        ])
}
