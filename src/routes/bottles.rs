use diesel::{self, prelude::*, connection};
use rocket::{serde::json::Json, response::status};
use crate::models::{NewBottle, Bottle};
use crate::schema::bottles;
use crate::Db;
use ethel::ApiError;

// #[get("/random")]
// pub fn get_random_bottle() -> Json<Bottle>  {
//     Json(
//         Bottle {
//             id: 1,
//             name: "Faretti Biscotti Famosi".to_string(),
//             category_id: 1,
//             sub_category_ids: vec![1],
//             storage_id: 1,
//         }
//     )
// }

#[post("/", data = "<bottle>")]
pub async fn create(
    connection: Db,
    bottle: Json<NewBottle>
) -> Result<status::Created<Json<Bottle>> , Json<ApiError>> {
    connection
        .run(move |c| {
            diesel::insert_into(bottles::table)
                .values(&bottle.into_inner())
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
pub async fn get(connection: Db) -> Json<Vec<Bottle>>  {
    connection
        .run(|c| bottles::table.load(c))
        .await
        .map(Json)
        .expect("Failed to fetch bottles")
}

#[delete("/<id>")]
pub async fn delete(
    connection: Db,
    id: i16
) -> Result<status::NoContent, status::NotFound<Json<ApiError>>> { 
    connection
        .run(move |c| {
            let affected = diesel::delete(bottles::table.filter(bottles::id.eq(id)))
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

#[put("/<id>", data = "<bottle>")]
pub async fn update(
    connection: Db,
    id: i16,
    bottle: Json<NewBottle>
) -> Result<Json<Bottle>, status::NotFound<Json<ApiError>>> {
    connection
        .run(move |c| {
            let to_update = bottles::table.find(id);
            diesel::update(to_update)
                .set(&bottle.into_inner())
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
