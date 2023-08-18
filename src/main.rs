#![feature(decl_macro)]

#[macro_use] extern crate rocket;
#[macro_use] extern crate diesel;

use rocket::Config;
use rocket::fairing::AdHoc;
use ethel::Db;

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
