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
            routes::bottles::get_random_bottle,
            routes::bottles::create_bottle,
            routes::bottles::get_bottles,
            routes::bottles::delete_bottle,
            routes::bottles::update_bottle
            ])
        .mount("/storage", routes![
            routes::storage::create,
            routes::storage::get,
            routes::storage::delete,
            routes::storage::update
        ])
        .mount("/categories", routes![
            routes::categories::create_category,
            routes::categories::get_categories,
            routes::categories::delete_category,
            routes::categories::update_category
        ])
        .mount("/sub_categories", routes![
            routes::sub_categories::create_sub_category,
            routes::sub_categories::get_sub_categories,
            routes::sub_categories::delete_sub_category,
            routes::sub_categories::update_sub_category
        ])
}
