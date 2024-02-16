// main.rs

#[macro_use] extern crate rocket;

use rocket::{Request, Response};
use rocket::http::Status;
use rocket::serde::json::Json;
use rocket::serde::Deserialize;

// Message struct
#[derive(Debug, Deserialize)]
struct Message {
    id: String,
    data: String,
    color: String,
}

// In-memory storage for messages
static mut MESSAGES: Vec<Message> = Vec::new();

// Routes
#[get("/message")]
fn get_messages() -> Json<Vec<Message>> {
    unsafe {
        Json(MESSAGES.clone())
    }
}

#[post("/message", data = "<message>")]
fn create_message(message: Json<Message>) -> Result<Status, Status> {
    unsafe {
        MESSAGES.push(message.into_inner());
        Ok(Status::Ok)
    }
}

// Rocket fairings to enable CORS
#[rocket::main]
async fn main() {
    rocket::build()
        .mount("/", routes![get_messages, create_message])
        .attach(rocket_cors::CorsOptions::default().to_cors().unwrap())
        .launch()
        .await
        .expect("Failed to launch Rocket server");
}
