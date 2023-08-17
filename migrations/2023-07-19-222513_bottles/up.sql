CREATE TABLE categories (
  id SMALLSERIAL PRIMARY KEY,
  name VARCHAR NOT NULL
);

CREATE TABLE sub_categories (
  id SMALLSERIAL PRIMARY KEY,
  category_id SMALLINT REFERENCES categories,
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
  category_id SMALLINT REFERENCES categories,
  sub_category_ids SMALLINT[],
  storage_id SMALLINT REFERENCES storage
);
