use rocket::{serde::json::Json, response::status};
use crate::models::Bottle;

#[get("/random")]
pub fn get_random_bottle() -> Json<Bottle>  {
    Json(
        Bottle {
            id: 1,
            name: "Faretti Biscotti Famosi".to_string(),
            category_id: 1,
            sub_category_ids: vec![1],
            storage_id: 1,
        }
    )
}

#[post("/", data = "<bottle>")]
pub fn create_bottle(bottle: Json<Bottle>) -> Json<Bottle> {
    bottle
}

#[get("/")]
pub fn get_bottles() -> Json<Vec<Bottle>>  {
    Json(vec![
        Bottle {
            id: 1,
            name: "Faretti Biscotti Famosi".to_string(),
            category_id: 1,
            sub_category_ids: vec![1],
            storage_id: 1,
        },
        Bottle {
            id: 2,
            name: "Hibiki 12".to_string(),
            category_id: 2,
            sub_category_ids: vec![2],
            storage_id: 2,
        },
    ])
}

#[delete("/<id>")]
pub fn delete_bottle(id: u16) -> status::NoContent { 
    status::NoContent
}

#[put("/<id>", data = "<bottle>")]
pub fn update_bottle(id: u16, bottle: Json<Bottle>) -> Json<Bottle> {
    bottle
}
