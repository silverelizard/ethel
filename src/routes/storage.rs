use diesel::{self, prelude::*};
use rocket::{serde::json::Json, response::status};
use crate::models::{NewStorage, Storage};
use crate::schema::storage;
use crate::Db;
use ethel::ApiError;

#[post("/", data = "<storage>")]
pub async fn create(
    connection: Db,
    storage: Json<NewStorage>
) -> Result<status::Created<Json<Storage> > , Json<ApiError>> {
    connection
        .run(move |c| {
            diesel::insert_into(storage::table)
                .values(&storage.into_inner())
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
pub async fn get(connection: Db) -> Json<Vec<Storage>>  {
    connection
        .run(|c| storage::table.load(c))
        .await
        .map(Json)
        .expect("Failed to fetch storage")
}

#[delete("/<id>")]
pub async fn delete(
    connection: Db,
    id: i16
) -> Result<status::NoContent, status::NotFound<Json<ApiError>>> { 
    
    connection
        .run(move |c| {
            let affected = diesel::delete(storage::table.filter(storage::id.eq(id)))
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

#[put("/<id>", data = "<storage>")]
pub async fn update(
    connection: Db,
    id: i16,
    storage: Json<NewStorage>,
) -> Result<Json<Storage>, status::NotFound<Json<ApiError>>> {
    connection
        .run(move |c| {
            let to_update = storage::table.find(id);
            diesel::update(to_update)
                .set(&storage.into_inner())
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
