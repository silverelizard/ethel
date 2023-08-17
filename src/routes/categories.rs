use rocket::{serde::json::Json, response::status};
use crate::models::Category;

#[post("/", data = "<category>")]
pub fn create_category(category: Json<Category>) -> Json<Category> {
    category
}

#[get("/")]
pub fn get_categories() -> Json<Vec<Category>>  {
    Json(vec![
        Category {
            id: 1,
            name: "Liquer".to_string()
        },
        Category {
            id: 2,
            name: "Whiskey".to_string()
        },
    ])
}

#[delete("/<id>")]
pub fn delete_category(id: u16) -> status::NoContent { 
    status::NoContent
}

#[put("/<id>", data = "<category>")]
pub fn update_category(id: u16, category: Json<Category>) -> Json<Category> {
    category
}
