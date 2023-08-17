pub mod bottles;
pub mod storage;
pub mod categories;
pub mod sub_categories;

#[get("/")]
pub fn index() -> &'static str {
    "Hello, world!"
}
