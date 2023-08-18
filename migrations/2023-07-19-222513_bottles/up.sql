CREATE TABLE categories (
  id SMALLSERIAL PRIMARY KEY,
  name VARCHAR NOT NULL
);

CREATE TABLE sub_categories (
  id SMALLSERIAL PRIMARY KEY,
  category_id SMALLSERIAL REFERENCES categories(id),
  name VARCHAR NOT NULL
);

CREATE TABLE storage (
  id SMALLSERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  room VARCHAR NOT NULL,
  shelf VARCHAR NOT NULL
);

CREATE TABLE bottles (
  id SMALLSERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  category_id SMALLSERIAL REFERENCES categories(id),
  sub_category_ids SMALLINT[],
  storage_id SMALLSERIAL REFERENCES storage(id)
);
