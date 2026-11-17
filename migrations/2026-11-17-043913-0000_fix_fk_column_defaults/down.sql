-- Restores the original SMALLSERIAL behaviour (sequence-backed defaults).
-- Sequence positions are not restored; they restart at 1.

CREATE SEQUENCE bottles_category_id_seq AS smallint OWNED BY bottles.category_id;
CREATE SEQUENCE bottles_storage_id_seq AS smallint OWNED BY bottles.storage_id;
CREATE SEQUENCE sub_categories_category_id_seq AS smallint OWNED BY sub_categories.category_id;

ALTER TABLE bottles        ALTER COLUMN category_id SET DEFAULT nextval('bottles_category_id_seq');
ALTER TABLE bottles        ALTER COLUMN storage_id  SET DEFAULT nextval('bottles_storage_id_seq');
ALTER TABLE sub_categories ALTER COLUMN category_id SET DEFAULT nextval('sub_categories_category_id_seq');
