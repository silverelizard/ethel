//! API error responses: a real HTTP status plus a JSON `{"details": ...}`
//! body with a message that is safe to show users. Raw database errors are
//! logged on the server and never sent to clients.

use diesel::result::{DatabaseErrorInformation, DatabaseErrorKind, Error as DieselError};
use rocket::http::Status;
use rocket::request::Request;
use rocket::response::{self, Responder};
use rocket::serde::json::Json;

use crate::ApiError;

#[derive(Debug)]
pub struct HttpError {
    pub status: Status,
    pub details: String,
}

impl HttpError {
    pub fn new(status: Status, details: impl Into<String>) -> Self {
        Self { status, details: details.into() }
    }

    pub fn not_found() -> Self {
        Self::new(Status::NotFound, "Not found")
    }

    /// Maps an error from a read, insert or update.
    pub fn db(e: DieselError) -> Self {
        match &e {
            DieselError::NotFound => Self::not_found(),
            DieselError::DatabaseError(DatabaseErrorKind::ForeignKeyViolation, info) => {
                // On insert/update the violated FK names the field that points
                // at a missing row, e.g. bottles_category_id_fkey -> category_id.
                let field = fk_column(info.as_ref()).unwrap_or("a referenced id");
                Self::new(
                    Status::UnprocessableEntity,
                    format!("{field} does not refer to an existing record"),
                )
            }
            DieselError::DatabaseError(DatabaseErrorKind::NotNullViolation, info) => {
                let field = info.column_name().unwrap_or("a required field");
                Self::new(Status::UnprocessableEntity, format!("{field} is required"))
            }
            DieselError::DatabaseError(DatabaseErrorKind::UniqueViolation, info) => {
                let details = match info.constraint_name() {
                    Some("categories_name_unique") => "A category with that name already exists",
                    Some("sub_categories_category_name_unique") => {
                        "That category already has a sub-category with that name"
                    }
                    _ => "A record with these values already exists",
                };
                Self::new(Status::Conflict, details)
            }
            _ => Self::internal(e),
        }
    }

    /// Maps an error from a delete, where a FK violation means the row is
    /// still referenced by other rows.
    pub fn db_delete(e: DieselError) -> Self {
        match &e {
            DieselError::DatabaseError(DatabaseErrorKind::ForeignKeyViolation, info) => {
                let used_by = info.table_name().map(|t| t.replace('_', " "));
                let details = match used_by {
                    Some(table) => format!("Can't delete: it is still used by one or more {table}"),
                    None => "Can't delete: it is still in use".to_string(),
                };
                Self::new(Status::Conflict, details)
            }
            _ => Self::db(e),
        }
    }

    fn internal(e: DieselError) -> Self {
        eprintln!("database error: {e}");
        Self::new(Status::InternalServerError, "Something went wrong. Please try again.")
    }
}

/// `bottles_category_id_fkey` on table `bottles` -> `category_id`.
fn fk_column(info: &dyn DatabaseErrorInformation) -> Option<&str> {
    let constraint = info.constraint_name()?;
    let table = info.table_name()?;
    constraint.strip_prefix(table)?.strip_prefix('_')?.strip_suffix("_fkey")
}

impl<'r> Responder<'r, 'static> for HttpError {
    fn respond_to(self, req: &'r Request<'_>) -> response::Result<'static> {
        (self.status, Json(ApiError { details: self.details })).respond_to(req)
    }
}

/// JSON body for every other error under /api (malformed JSON, unknown
/// route, pool unavailable, ...), instead of Rocket's HTML error page.
#[catch(default)]
pub fn api_default(status: Status, _req: &Request<'_>) -> (Status, Json<ApiError>) {
    let details = match status.code {
        422 => "The request body is missing fields or has invalid values".to_string(),
        _ => status.reason_lossy().to_string(),
    };
    (status, Json(ApiError { details }))
}
