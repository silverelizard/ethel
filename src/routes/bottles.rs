use diesel::{self, prelude::*};
use diesel::dsl::sql;
use diesel::sql_types::Double;
use rocket::form::{error::ErrorKind, Errors};
use rocket::{http::Status, serde::json::Json, response::status};
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
pub async fn get(connection: Db) -> Result<Json<Vec<Bottle>>, HttpError> {
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

/// A present-but-invalid query param is a 422, not silently "any".
fn optional_id(name: &str, value: Result<i16, Errors<'_>>) -> Result<Option<i16>, HttpError> {
    match value {
        Ok(id) => Ok(Some(id)),
        // Rocket reports an absent param as a "missing" error.
        Err(e) if e.iter().all(|e| matches!(e.kind, ErrorKind::Missing)) => Ok(None),
        Err(_) => Err(HttpError::new(
            Status::UnprocessableEntity,
            format!("{name} must be a whole number"),
        )),
    }
}

/// A random bottle, optionally limited to a category and/or a sub-category.
/// Public, like the other read-only routes.
/// 404 when nothing matches.
#[get("/random?<category_id>&<sub_category_id>")]
pub async fn random(
    connection: Db,
    category_id: Result<i16, Errors<'_>>,
    sub_category_id: Result<i16, Errors<'_>>,
) -> Result<Json<Bottle>, HttpError> {
    let category_id = optional_id("category_id", category_id)?;
    let sub_category_id = optional_id("sub_category_id", sub_category_id)?;

    let bottle = connection
        .run(move |c| {
            let mut query = bottles::table.into_boxed();
            if let Some(category_id) = category_id {
                query = query.filter(bottles::category_id.eq(category_id));
            }
            if let Some(sub_category_id) = sub_category_id {
                query = query.filter(bottles::sub_category_ids.contains(vec![Some(sub_category_id)]));
            }
            query.order(sql::<Double>("RANDOM()")).first::<Bottle>(c).optional()
        })
        .await
        .map_err(HttpError::db)?;

    bottle
        .map(Json)
        .ok_or_else(|| HttpError::new(Status::NotFound, "No bottles match those filters"))
}
