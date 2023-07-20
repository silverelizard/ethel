-- Your SQL goes here
CREATE TABLE bottles (
  id SMALLSERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  category VARCHAR NOT NULL,
  sub_category TEXT[],
  room VARCHAR, 
  storage VARCHAR,
  shelf VARCHAR
)
