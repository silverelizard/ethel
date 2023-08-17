use serde::{Deserialize, Serialize};
use crate::schema::{storage, categories, sub_categories, bottles};

#[derive(Serialize, Deserialize, Queryable, Debug, Insertable)]
#[diesel(table_name = storage)]
pub struct Storage {
    pub id: i16,
    pub name: String,
    pub room: String,
    pub shelf: String,
}

#[derive(Serialize, Deserialize, Queryable, Debug, Insertable, Identifiable)]
#[diesel(table_name = categories)]
pub struct Category {
    pub id: i16,
    pub name: String,
}

#[derive(Serialize, Deserialize, Queryable, Debug, Insertable, Identifiable, Associations)]
#[diesel(belongs_to(Category))]
#[diesel(table_name = sub_categories)]
pub struct SubCategory {
    pub id: i16,
    pub category_id: i16,
    pub name: String,
}

#[derive(Serialize, Deserialize, Queryable, Debug, Insertable, Identifiable, Associations)]
#[diesel(belongs_to(Category))]
#[diesel(belongs_to(Storage))]
#[diesel(table_name = bottles)]
pub struct Bottle {
    pub id: i16,
    pub name: String,
    pub category_id: i16,
    pub sub_category_ids: Vec<i16>,
    pub storage_id: i16,
}
