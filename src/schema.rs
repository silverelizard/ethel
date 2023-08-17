// @generated automatically by Diesel CLI.

diesel::table! {
    bottles (id) {
        id -> Int2,
        name -> Varchar,
        category_id -> Nullable<Int2>,
        sub_category_ids -> Nullable<Array<Nullable<Int2>>>,
        storage_id -> Nullable<Int2>,
    }
}

diesel::table! {
    categories (id) {
        id -> Int2,
        name -> Varchar,
    }
}

diesel::table! {
    storage (id) {
        id -> Int2,
        name -> Varchar,
        room -> Varchar,
        shelf -> Varchar,
    }
}

diesel::table! {
    sub_categories (id) {
        id -> Int2,
        category_id -> Nullable<Int2>,
        name -> Varchar,
    }
}

diesel::joinable!(bottles -> categories (category_id));
diesel::joinable!(bottles -> storage (storage_id));
diesel::joinable!(sub_categories -> categories (category_id));

diesel::allow_tables_to_appear_in_same_query!(
    bottles,
    categories,
    storage,
    sub_categories,
);
