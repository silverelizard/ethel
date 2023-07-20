// @generated automatically by Diesel CLI.

diesel::table! {
    bottles (id) {
        id -> Int2,
        name -> Varchar,
        category -> Varchar,
        sub_category -> Nullable<Array<Nullable<Text>>>,
        room -> Nullable<Varchar>,
        storage -> Nullable<Varchar>,
        shelf -> Nullable<Varchar>,
    }
}
