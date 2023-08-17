#![feature(decl_macro)]

#[macro_use] extern crate rocket;
use rocket::Config;
use rocket::fairing::AdHoc;
use rocket_sync_db_pools::database;

#[macro_use] extern crate diesel;

#[database("my_db")]
pub struct Db(diesel::PgConnection);
pub mod schema;
pub mod models;
pub mod routes;

#[launch]
fn rocket() -> _ {
    let rocket= rocket::build();
    
    rocket
      .attach(AdHoc::config::<Config>())
      .attach(Db::fairing())
      .mount("/", routes![routes::index])
      .mount("/bottles", routes![
        routes::bottles::get_random_bottle,
        routes::bottles::create_bottle,
        routes::bottles::get_bottles,
        routes::bottles::delete_bottle,
        routes::bottles::update_bottle
        ])
}
