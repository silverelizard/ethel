# ethel
Alcohol location tracker for home, made using Rocket and Rust.

Written for [codefor.beer]([url](https://codefor.beer/)https://codefor.beer/), a tech blog covering all kinds of topics.

## Getting Started

Make sure you have the rust toolchain installed. See the blog for more details, particularly "Rust and Rocket Parts I & II" which go through the setup of rust and the application.

### Setting up Dev Environment

This project was written in a Unix environment, specifically on a MacOS (most recently tested on Ventura 13.6.9).

1. Make sure you have a c compiler: you need to have the XCode tools installed. Use `xcode-select --install` in your terminal of choice if not already present.
2. You will also need to install several packages: I prefer to use [homebrew](https://brew.sh/) on Mac, so all steps will use `brew` commands going forward for this. If you want to install homebrew, you can use the following command: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
3. Install the `liqpq` package from homebrew (the application will not compile without this: MacOS does some weird things to the "stock" system libs): `brew install libpq`
4. Optional: Install NVM (Node Version Manager) `brew install nvm` (make sure you add nvm to your path!)
5. Install Node (I use NVM for this for easy switching) `nvm install --lts`
6. Install [Docker](https://www.docker.com/)

### Setting up the Backend of the Project
1. In the root of the project, run `cargo build`
2. Install the Diesel CLI tools to manage our DB setup and migrations (we are using Postgres) `cargo install diesel_cli --no-default-features --features postgres`
3. Create your `.env` from the template and set a password (use the same password in `POSTGRES_PASSWORD` and `DATABASE_URL`): `cp .env.example .env`
4. Start your DB with Postgres published on localhost only: `docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d db`
5. Setup your DB using the Diesel CLI: `diesel setup` (optional: the app also runs pending migrations on startup)

### Configuration
- `DATABASE_URL` is read by both the Diesel CLI and the app (from `.env` in development). Never put credentials in `Rocket.toml`.
- `docker compose` reads `POSTGRES_USER`, `POSTGRES_PASSWORD` and `POSTGRES_DB` from `.env` and refuses to start without `POSTGRES_PASSWORD`.
- The plain `docker compose up` does not publish Postgres to the host at all; only `docker-compose.dev.yml` does, and only on `127.0.0.1`.
- Changing the password: `POSTGRES_PASSWORD` only takes effect when the `db-data` volume is first created. For an existing volume, run `docker compose exec db psql -U ethel -d etheldb -c "ALTER USER ethel PASSWORD 'new-password';"` and then update `.env`.

### Login
- The web app and API require signing in with the shared password in `ETHEL_PASSWORD` (at least 12 characters). The app refuses to start without it.
- Sessions are an encrypted, `HttpOnly`, `SameSite=Strict` cookie that lasts 30 days. Release builds (including Docker) also require `ROCKET_SECRET_KEY` (`openssl rand -base64 32`); if it's unset, debug builds generate a temporary one and `cargo run` logs you out on every restart. Changing the key logs everyone out.
- Set `ETHEL_SECURE_COOKIE=true` when serving over HTTPS. Over plain HTTP the password and cookie travel unencrypted, so put a TLS reverse proxy in front for anything beyond your home network.
- `cargo test` needs the dev database running (step 4 above). The tests only read from it.

### Running with Docker
1. `cp .env.example .env` and set `POSTGRES_PASSWORD`, `ETHEL_PASSWORD` and `ROCKET_SECRET_KEY`
2. `docker compose up --build -d`
3. The app is on `http://localhost:8000` and applies database migrations at startup

### Setting up the Frontend of the Project
1. In the frontend directory, run `npm install`
2. Make sure the `.env` in your frontend directory contains a root level build path: `BUILD_PATH=../build`
3. Next use `npm run build` to output the frontend assets in the build directory of root

### Running the Project
1. In the root directory, use `cargo run`
2. The project should now be running on `localhost` serving the static frontend build with data from the API and asks for the `ETHEL_PASSWORD` login

### Troubleshooting

If you run into an error like this when trying to build the project:

```
= note: ld: library 'pq' not found
    clang: error: linker command failed with exit code 1 (use -v to see invocation)
```

This is the flavor of error solved by step 3 in "Setting up Dev Environment". Apple may have decided to unpackage/unlink additional libraries. Try installing those libraries from homebrew (like we did with `libpq`) and then try building again.

After installing additional libraries, make sure to run `cargo clean` before building again.
