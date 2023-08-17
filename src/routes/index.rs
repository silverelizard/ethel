use rocket::{serde::json::Json, response::status};

#[get("/")]
pub fn index() -> &'static str {
    "Hello, world!"
}
