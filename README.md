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
3. Start your DB: `docker-compose up` (this will download the needed image and run the DB server locally)
4. Create a `.env` (of it doesn't already exist) with your DB credentials: `DATABASE_URL=postgres://ethel:ethel@localhost:5432/etheldb` (this is the projet default)
4. Setup your DB using the Diesel CLI: `diesel setup`

### Setting up the Frontend of the Project
1. In the frontend directory, run `npm install`
2. Make sure the `.env` in your frontend directory contains a root level build path: `BUILD_PATH=../build`
3. Next use `npm run build` to output the frontend assets in the build directory of root

### Running the Project
1. In the root directory, use `cargo run`
2. The project should now be running on `localhost` serving the static frontend build with data from the API (by deafult, the UI will show mock data if there are no records)

### Troubleshooting

If you run into an error like this when trying to build the project:

```
= note: ld: library 'pq' not found
    clang: error: linker command failed with exit code 1 (use -v to see invocation)
```

This is the flavor of error solved by step 3 in "Setting up Dev Environment". Apple may have decided to unpackage/unlink additional libraries. Try installing those libraries from homebrew (like we did with `libpq`) and then try building again.