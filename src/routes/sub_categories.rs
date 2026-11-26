use diesel::{self, prelude::*};
use rocket::{serde::json::Json, response::status};
use crate::models::{NewSubCategory, SubCategory};
use crate::schema::sub_categories;
use crate::Db;
use ethel::{auth::Authenticated, error::HttpError, normalize_name, SameOrigin};

#[post("/", format = "json", data = "<sub_category>")]
pub async fn create(
    _csrf: SameOrigin,
    _auth: Authenticated,
    connection: Db,
    sub_category: Json<NewSubCategory>,
) -> Result<status::Created<Json<SubCategory>>, HttpError> {
    let mut sub_category = sub_category.into_inner();
    sub_category.name = normalize_name(&sub_category.name)?;
    connection
        .run(move |c| {
            diesel::insert_into(sub_categories::table)
                .values(&sub_category)
                .get_result(c)
        })
        .await
        .map(|row| status::Created::new("/").body(Json(row)))
        .map_err(HttpError::db)
}

#[get("/")]
pub async fn get(_auth: Authenticated, connection: Db) -> Result<Json<Vec<SubCategory>>, HttpError> {
    connection
        .run(|c| sub_categories::table.load(c))
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
        .run(move |c| diesel::delete(sub_categories::table.find(id)).execute(c))
        .await
        .map_err(HttpError::db_delete)?;
    match affected {
        0 => Err(HttpError::not_found()),
        _ => Ok(status::NoContent),
    }
}

#[put("/<id>", format = "json", data = "<sub_category>")]
pub async fn update(
    _csrf: SameOrigin,
    _auth: Authenticated,
    connection: Db,
    id: i16,
    sub_category: Json<NewSubCategory>,
) -> Result<Json<SubCategory>, HttpError> {
    let mut sub_category = sub_category.into_inner();
    sub_category.name = normalize_name(&sub_category.name)?;
    connection
        .run(move |c| {
            diesel::update(sub_categories::table.find(id))
                .set(&sub_category)
                .get_result(c)
        })
        .await
        .map(Json)
        .map_err(HttpError::db)
}
