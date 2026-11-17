# --- Stage 1: build the frontend static assets ---
FROM node:22-bookworm AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
# Output straight to repo-root/build to match Rocket's relative!("/build")
RUN npm run build -- --outDir ../build

# --- Stage 2: build the Rocket backend (needs nightly for decl_macro) ---
FROM rustlang/rust:nightly-bookworm AS backend-build
RUN apt-get update && apt-get install -y --no-install-recommends libpq-dev && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY Cargo.toml Cargo.lock ./
COPY src ./src
COPY migrations ./migrations
COPY diesel.toml ./diesel.toml
RUN cargo build --release

# --- Stage 3: slim runtime image ---
FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends libpq5 ca-certificates \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=backend-build /app/target/release/ethel ./ethel
COPY --from=frontend-build /app/build ./build
COPY Rocket.toml ./Rocket.toml

ENV ROCKET_ADDRESS=0.0.0.0
ENV ROCKET_PORT=8000
EXPOSE 8000

CMD ["./ethel"]
