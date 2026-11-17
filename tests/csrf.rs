#[macro_use]
extern crate rocket;

use ethel::SameOrigin;
use rocket::http::{ContentType, Header, Status};
use rocket::local::blocking::Client;

#[post("/", format = "json", data = "<body>")]
fn create(_csrf: SameOrigin, body: String) -> String {
    body
}

#[delete("/")]
fn remove(_csrf: SameOrigin) {}

fn client() -> Client {
    Client::tracked(rocket::build().mount("/", routes![create, remove])).unwrap()
}

fn post(client: &Client, content_type: ContentType, headers: &[(&'static str, &'static str)]) -> Status {
    let mut req = client.post("/").header(content_type).body("{}");
    for (name, value) in headers {
        req = req.header(Header::new(*name, *value));
    }
    req.dispatch().status()
}

#[test]
fn json_without_browser_headers_is_allowed() {
    assert_eq!(post(&client(), ContentType::JSON, &[]), Status::Ok);
}

#[test]
fn non_json_content_types_never_reach_the_handler() {
    let c = client();
    assert_eq!(post(&c, ContentType::Text, &[]), Status::NotFound);
    assert_eq!(post(&c, ContentType::Form, &[]), Status::NotFound);
}

#[test]
fn sec_fetch_site_is_enforced() {
    let c = client();
    assert_eq!(post(&c, ContentType::JSON, &[("Sec-Fetch-Site", "same-origin")]), Status::Ok);
    assert_eq!(post(&c, ContentType::JSON, &[("Sec-Fetch-Site", "cross-site")]), Status::Forbidden);
    assert_eq!(post(&c, ContentType::JSON, &[("Sec-Fetch-Site", "same-site")]), Status::Forbidden);
}

#[test]
fn origin_must_match_host() {
    let c = client();
    let same = [("Origin", "http://localhost:8000"), ("Host", "localhost:8000")];
    let evil = [("Origin", "https://evil.example"), ("Host", "localhost:8000")];
    assert_eq!(post(&c, ContentType::JSON, &same), Status::Ok);
    assert_eq!(post(&c, ContentType::JSON, &evil), Status::Forbidden);
}

#[test]
fn cross_origin_delete_is_forbidden() {
    let c = client();
    let status = c
        .delete("/")
        .header(Header::new("Origin", "https://evil.example"))
        .header(Header::new("Host", "localhost:8000"))
        .dispatch()
        .status();
    assert_eq!(status, Status::Forbidden);
}
