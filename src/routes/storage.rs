use diesel::{self, prelude::*};
use rocket::{serde::json::Json, response::status};
use crate::models::{NewStorage, Storage};
use crate::schema::storage;
use crate::Db;
use ethel::{auth::Authenticated, error::HttpError, SameOrigin};

#[post("/", format = "json", data = "<storage>")]
pub async fn create(
    _csrf: SameOrigin,
    _auth: Authenticated,
    connection: Db,
    storage: Json<NewStorage>,
) -> Result<status::Created<Json<Storage>>, HttpError> {
    connection
        .run(move |c| {
            diesel::insert_into(storage::table)
                .values(&storage.into_inner())
                .get_result(c)
        })
        .await
        .map(|row| status::Created::new("/").body(Json(row)))
        .map_err(HttpError::db)
}

#[get("/")]
pub async fn get(_auth: Authenticated, connection: Db) -> Result<Json<Vec<Storage>>, HttpError> {
    connection
        .run(|c| storage::table.load(c))
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
        .run(move |c| diesel::delete(storage::table.find(id)).execute(c))
        .await
        .map_err(HttpError::db_delete)?;
    match affected {
        0 => Err(HttpError::not_found()),
        _ => Ok(status::NoContent),
    }
}

#[put("/<id>", format = "json", data = "<storage>")]
pub async fn update(
    _csrf: SameOrigin,
    _auth: Authenticated,
    connection: Db,
    id: i16,
    storage: Json<NewStorage>,
) -> Result<Json<Storage>, HttpError> {
    connection
        .run(move |c| {
            diesel::update(storage::table.find(id))
                .set(&storage.into_inner())
                .get_result(c)
        })
        .await
        .map(Json)
        .map_err(HttpError::db)
}
