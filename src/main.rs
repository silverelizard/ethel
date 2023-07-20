#![feature(decl_macro)]

#[macro_use] extern crate rocket;
use rocket::{serde::{Serialize, Deserialize, json::Json}, response::status};

#[derive(Serialize, Deserialize)]
enum Room {
    DiningRoom,
    Entry,
    LivingRoom,
    Kitchen,
    Garage,
}

#[derive(Serialize, Deserialize)]
enum Storage {
    BeerFridge,
    Buffet,
    BuiltIn,
    Cabinet,
    Counter,
    Fridge,
    IkeaShelf,
    LeftIkea,
    RightIkea,
    WineFridge,
}

#[derive(Serialize, Deserialize)]
enum Shelf {
    LeftTop,
    LeftBottom,
    CenterTop,
    CenterBottom,
    RightTop,
    RightBottom,
    Top,
    LeftMiddle,
    RightMiddle,
    RightCenter,
    Shelf1,
    Shelf2,
    Shelf3,
    Shelf4,
    Shelf5,
    CenterMiddle,
    BarArea,
    Fridge,
    Shelf,
    LeftKeg,
    RightKeg,
    Small,
    Large,
}

#[derive(Serialize, Deserialize)]
enum Category {
    Whiskey,
    Brandy,
    Vodka,
    Liqueurs,
    Gin,
    Rum,
    Agave,
    Other,
    Beer,
    Wine,
    Sochu,
}

#[derive(Serialize, Deserialize)]
enum SubCategory {
    American,
    SingleMalt,
    Scotch,
    Blend,
    Bitter,
    Sweet,
    Fruit,
    Dairy,
    Cognac,
    Armagnac,
    Calvados,
    CaskStrength,
    NavyStrength,
    Rye,
    Bourbon,
    Aged,
    Silver,
    Dark,
    Flavored,
    Gold,
    Spiced,
    Mezcal,
    Tequila,
    Other,
    Peated,
    Palinka,
    Añejo,
    Reposado,
    Blanco,
    Blackstrap,
    Irish,
    Poitín,
    Japanese,
    NewZealand,
    Australia,
    Wheat,
    Korean,
}

#[derive(Serialize, Deserialize)]
struct Bottle {
    id: u16,
    name: String,
    category: Category,
    sub_category: Vec<SubCategory>,
    room: Room,
    storage: Storage,
    shelf: Shelf,
}

#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

#[get("/random")]
fn get_random_bottle() -> Json<Bottle>  {
    Json(
        Bottle {
            id: 1,
            name: "Faretti Biscotti Famosi".to_string(),
            category: Category::Liqueurs,
            sub_category: vec![SubCategory::Sweet],
            room: Room::LivingRoom,
            storage: Storage::LeftIkea,
            shelf: Shelf::Shelf5
        }
    )
}

#[post("/", data = "<bottle>")]
fn create_bottle(bottle: Json<Bottle>) -> Json<Bottle> {
    bottle
}

#[get("/")]
fn get_bottles() -> Json<Vec<Bottle>>  {
    Json(vec![
        Bottle {
            id: 1,
            name: "Faretti Biscotti Famosi".to_string(),
            category: Category::Liqueurs,
            sub_category: vec![SubCategory::Sweet],
            room: Room::LivingRoom,
            storage: Storage::LeftIkea,
            shelf: Shelf::Shelf5
        },
        Bottle {
            id: 2,
            name: "Hibiki 12".to_string(),
            category: Category::Whiskey,
            sub_category: vec![
                SubCategory::Japanese,
                SubCategory::Blend,
                ],
            room: Room::DiningRoom,
            storage: Storage::Buffet,
            shelf: Shelf::CenterBottom
        },
    ])
}

#[delete("/<id>")]
fn delete_bottle(id: u16) -> status::NoContent { 
    status::NoContent
}

#[put("/<id>", data = "<bottle>")]
fn update_bottle(id: u16, bottle: Json<Bottle>) -> Json<Bottle> {
    bottle
}

#[launch]
fn rocket() -> _ {
    let rocket= rocket::build();
    
    rocket
      .mount("/", routes![index])
      .mount("/bottles", routes![
        get_random_bottle,
        create_bottle,
        get_bottles,
        delete_bottle,
        update_bottle
        ])
}
