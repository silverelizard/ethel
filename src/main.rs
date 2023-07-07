#![feature(decl_macro)]

#[macro_use] extern crate serde;
#[macro_use] extern crate rocket;

#[derive(Serialize, Deserialize)]
enum Room {
    DiningRoom,
    Entry,
    LivingRoom,
    Kitchen,
    Garage
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

#[derive(Serialize, Deserialize, Clone)]
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
struct Location {
    room: Room,
    storage: Storage,
    shelf: Shelf
}

#[derive(Serialize, Deserialize)]
struct Bottle {
    id: i32,
    name: String,
    category: Category,
    sub_category: Vec<SubCategory>,
    location: Location
}

#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

#[get("/random")]
fn get_random_bottle() -> rocket::serde::json::Json<Bottle>  {
    rocket::serde::json::Json(
        Bottle {
            id: 1,
            name: "Faretti Biscotti Famosi".to_string(),
            category: Category::Liqueurs,
            sub_category: [SubCategory::Sweet].to_vec(),
            location: Location {
                room: Room::LivingRoom,
                storage: Storage::LeftIkea,
                shelf: Shelf::Shelf5
            }
        }
    )
}

#[launch]
fn rocket() -> _ {
    let rocket= rocket::build();
    
    rocket
      .mount("/", routes![index])
      .mount("/bottles", routes![get_random_bottle])
}
