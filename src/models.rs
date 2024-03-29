use rocket::serde::{Deserialize, Serialize};
use crate::schema::{storage, categories, sub_categories, bottles};

#[derive(Serialize, Queryable, Debug)]
pub struct Storage {
    pub id: i16,
    pub name: String,
    pub room: String,
    pub shelf: String,
}

#[derive(Deserialize, Insertable, AsChangeset, Debug)]
#[diesel(table_name = storage)]
pub struct NewStorage {
    pub name: String,
    pub room: String,
    pub shelf: String,
}

#[derive(Serialize, Queryable, Debug)]
pub struct Category {
    pub id: i16,
    pub name: String,
}

#[derive(Deserialize, Insertable, AsChangeset, Debug)]
#[diesel(table_name = categories)]
pub struct NewCategory {
    pub name: String,
}

#[derive(Serialize, Queryable, Debug)]
pub struct SubCategory {
    pub id: i16,
    pub category_id: i16,
    pub name: String,
}

#[derive(Deserialize, Insertable, AsChangeset, Debug, Associations)]
#[diesel(belongs_to(Category))]
#[diesel(table_name = sub_categories)]
pub struct NewSubCategory {
    pub category_id: i16,
    pub name: String,
}

#[derive(Serialize, Queryable, Debug)]
pub struct Bottle {
    pub id: i16,
    pub name: String,
    pub category_id: i16,
    pub sub_category_ids: Option<Vec<Option<i16>>>,
    pub storage_id: i16,
}

#[derive(Deserialize, Insertable, AsChangeset, Debug, Associations)]
#[diesel(belongs_to(Category))]
#[diesel(belongs_to(Storage))]
#[diesel(table_name = bottles)]
pub struct NewBottle {
    pub name: String,
    pub category_id: i16,
    pub sub_category_ids: Option<Vec<Option<i16>>>,
    pub storage_id: i16,
}
