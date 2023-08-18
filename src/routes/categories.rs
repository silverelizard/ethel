use diesel::{self, prelude::*};
use rocket::{serde::json::Json, response::status};
use crate::models::{NewCategory, Category};
use crate::schema::categories;
use crate::Db;
use ethel::ApiError;

#[post("/", data = "<category>")]
pub async fn create(
    connection: Db,
    category: Json<NewCategory>
) -> Result<status::Created<Json<Category>> , Json<ApiError>> {
    connection
        .run(move |c| {
            diesel::insert_into(categories::table)
                .values(&category.into_inner())
                .get_result(c)
        })
        .await
        .map(|a| status::Created::new("/").body(Json(a)))
        .map_err(|e| {
            Json(ApiError {
                details: e.to_string(),
            })
        })
}

#[get("/")]
pub async fn get(connection: Db) -> Json<Vec<Category>>  {
    connection
        .run(|c| categories::table.load(c))
        .await
        .map(Json)
        .expect("Failed to fetch categories")
}

#[delete("/<id>")]
pub async fn delete(
    connection: Db,
    id: i16
) -> Result<status::NoContent, status::NotFound<Json<ApiError>>> { 
    connection
        .run(move |c| {
            let affected = diesel::delete(categories::table.filter(categories::id.eq(id)))
                .execute(c)
                .expect("Connection is broken");
            match affected {
                1 => Ok(()),
                0 => Err("NotFound"),
                _ => Err("???"),
            }
        })
        .await
        .map(|_| status::NoContent)
        .map_err(|e| {
            status::NotFound(Json(ApiError {
                details: e.to_string(),
            }))
        })
}

#[put("/<id>", data = "<category>")]
pub async fn update(
    connection: Db,
    id: i16,
    category: Json<NewCategory>
) -> Result<Json<Category>, status::NotFound<Json<ApiError>>> {
    connection
    .run(move |c| {
        let to_update = categories::table.find(id);
        diesel::update(to_update)
            .set(&category.into_inner())
            .get_result(c)
    })
    .await
    .map(Json)
    .map_err(|e| {
        status::NotFound(Json(ApiError {
            details: e.to_string(),
        }))
    })
}
