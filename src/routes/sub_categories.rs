use diesel::{self, prelude::*};
use rocket::{serde::json::Json, response::status};
use crate::models::{NewSubCategory, SubCategory};
use crate::schema::sub_categories;
use crate::Db;
use ethel::ApiError;

#[post("/", data = "<sub_category>")]
pub async fn create(
    connection: Db,
    sub_category: Json<NewSubCategory>
) -> Result<status::Created<Json<SubCategory>> , Json<ApiError>> {
    connection
        .run(move |c| {
            diesel::insert_into(sub_categories::table)
                .values(&sub_category.into_inner())
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
pub async fn get(connection: Db) -> Json<Vec<SubCategory>>  {
    connection
    .run(|c| sub_categories::table.load(c))
    .await
    .map(Json)
    .expect("Failed to fetch sub categories")
}

#[delete("/<id>")]
pub async fn delete(
    connection: Db,
    id: i16
) -> Result<status::NoContent, status::NotFound<Json<ApiError>>> { 
    connection
        .run(move |c| {
            let affected = diesel::delete(sub_categories::table.filter(sub_categories::id.eq(id)))
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

#[put("/<id>", data = "<sub_category>")]
pub async fn update(
    connection: Db,
    id: i16,
    sub_category: Json<NewSubCategory>
) -> Result<Json<SubCategory>, status::NotFound<Json<ApiError>>> {
    connection
    .run(move |c| {
        let to_update = sub_categories::table.find(id);
        diesel::update(to_update)
            .set(&sub_category.into_inner())
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
