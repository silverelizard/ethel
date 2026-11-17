use diesel::{self, prelude::*};
use rocket::{serde::json::Json, response::status};
use crate::models::{NewBottle, Bottle};
use crate::schema::bottles;
use crate::Db;
use ethel::{auth::Authenticated, error::HttpError, SameOrigin};

#[post("/", format = "json", data = "<bottle>")]
pub async fn create(
    _csrf: SameOrigin,
    _auth: Authenticated,
    connection: Db,
    bottle: Json<NewBottle>,
) -> Result<status::Created<Json<Bottle>>, HttpError> {
    connection
        .run(move |c| {
            diesel::insert_into(bottles::table)
                .values(&bottle.into_inner())
                .get_result(c)
        })
        .await
        .map(|row| status::Created::new("/").body(Json(row)))
        .map_err(HttpError::db)
}

#[get("/")]
pub async fn get(_auth: Authenticated, connection: Db) -> Result<Json<Vec<Bottle>>, HttpError> {
    connection
        .run(|c| bottles::table.load(c))
        .await
        .map(Json)
        .map_err(HttpError::db)
}

#[delete("/<id>")]
pub async fn delete(
    _csrf: SameOrigin,
    _auth: Authenticated,
    connection: Db,
    id: i16,
) -> Result<status::NoContent, HttpError> {
    let affected = connection
        .run(move |c| diesel::delete(bottles::table.find(id)).execute(c))
        .await
        .map_err(HttpError::db_delete)?;
    match affected {
        0 => Err(HttpError::not_found()),
        _ => Ok(status::NoContent),
    }
}

#[put("/<id>", format = "json", data = "<bottle>")]
pub async fn update(
    _csrf: SameOrigin,
    _auth: Authenticated,
    connection: Db,
    id: i16,
    bottle: Json<NewBottle>,
) -> Result<Json<Bottle>, HttpError> {
    connection
        .run(move |c| {
            diesel::update(bottles::table.find(id))
                .set(&bottle.into_inner())
                .get_result(c)
        })
        .await
        .map(Json)
        .map_err(HttpError::db)
}
