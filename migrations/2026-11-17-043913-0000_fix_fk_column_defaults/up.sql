-- The original migration declared these foreign key columns as SMALLSERIAL,
-- which gave each one its own sequence and a nextval() default. An insert
-- that omitted the column would silently reference an arbitrary row.
-- The column type (smallint NOT NULL) is already correct; only the default
-- and the sequence need to go. Defaults must be dropped first, because the
-- columns depend on the sequences.

ALTER TABLE bottles        ALTER COLUMN category_id DROP DEFAULT;
ALTER TABLE bottles        ALTER COLUMN storage_id  DROP DEFAULT;
ALTER TABLE sub_categories ALTER COLUMN category_id DROP DEFAULT;

DROP SEQUENCE bottles_category_id_seq;
DROP SEQUENCE bottles_storage_id_seq;
DROP SEQUENCE sub_categories_category_id_seq;
