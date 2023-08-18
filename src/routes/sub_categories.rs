use rocket::{serde::json::Json, response::status};
use crate::models::SubCategory;

#[post("/", data = "<sub_category>")]
pub fn create(sub_category: Json<SubCategory>) -> Json<SubCategory> {
    sub_category
}

#[get("/")]
pub fn get() -> Json<Vec<SubCategory>>  {
    Json(vec![
        SubCategory {
            id: 1,
            category_id: 1,
            name: "Sweet".to_string()
        },
        SubCategory {
            id: 2,
            category_id: 2,
            name: "Scotch".to_string()
        },
    ])
}

#[delete("/<id>")]
pub fn delete(id: u16) -> status::NoContent { 
    status::NoContent
}

#[put("/<id>", data = "<sub_category>")]
pub fn update(id: u16, sub_category: Json<SubCategory>) -> Json<SubCategory> {
    sub_category
}
