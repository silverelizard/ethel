use diesel::{self, prelude::*};
use rocket::{serde::json::Json, response::status};
use crate::models::{NewCategory, Category};
use crate::schema::categories;
use crate::Db;
use ethel::{auth::Authenticated, error::HttpError, SameOrigin};

#[post("/", format = "json", data = "<category>")]
pub async fn create(
    _csrf: SameOrigin,
    _auth: Authenticated,
    connection: Db,
    category: Json<NewCategory>,
) -> Result<status::Created<Json<Category>>, HttpError> {
    connection
        .run(move |c| {
            diesel::insert_into(categories::table)
                .values(&category.into_inner())
                .get_result(c)
        })
        .await
        .map(|row| status::Created::new("/").body(Json(row)))
        .map_err(HttpError::db)
}

#[get("/")]
pub async fn get(_auth: Authenticated, connection: Db) -> Result<Json<Vec<Category>>, HttpError> {
    connection
        .run(|c| categories::table.load(c))
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
        .run(move |c| diesel::delete(categories::table.find(id)).execute(c))
        .await
        .map_err(HttpError::db_delete)?;
    match affected {
        0 => Err(HttpError::not_found()),
        _ => Ok(status::NoContent),
    }
}

#[put("/<id>", format = "json", data = "<category>")]
pub async fn update(
    _csrf: SameOrigin,
    _auth: Authenticated,
    connection: Db,
    id: i16,
    category: Json<NewCategory>,
) -> Result<Json<Category>, HttpError> {
    connection
        .run(move |c| {
            diesel::update(categories::table.find(id))
                .set(&category.into_inner())
                .get_result(c)
        })
        .await
        .map(Json)
        .map_err(HttpError::db)
}
