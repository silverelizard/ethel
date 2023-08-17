use diesel::{self, prelude::*};
use rocket::{serde::json::Json, response::status};
use crate::models::Storage;
use crate::schema::storage;
use crate::Db;

// #[post("/", data = "<storage>")]
// pub fn create_storage(
//     connection: DbConn,
//     storage: Json<Storage>) -> Result<String, String> {
//      let inserted_rows = diesel::insert_into(schema::storage::table)
//         .values(&storage.0)
//         .execute(&connection.0)
//         .map_err(|err| -> String {
//             println!("Error inserting row: {:?}", err);
//             "Error inserting row into database".into()
//         })?;

//     Ok(format!("Inserted {} row(s).", inserted_rows))
// }

#[get("/")]
pub async fn get_storage(connection: Db) -> Json<Vec<Storage>>  {
    connection
        .run(|c| storage::table.load(c))
        .await
        .map(Json)
        .expect("Failed to fetch storage")
}

#[delete("/<id>")]
pub fn delete_storage(id: u16) -> status::NoContent { 
    status::NoContent
}

#[put("/<id>", data = "<storage>")]
pub fn update_storage(id: u16, storage: Json<Storage>) -> Json<Storage> {
    storage
}