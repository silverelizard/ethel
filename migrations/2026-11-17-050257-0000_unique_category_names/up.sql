-- Category names are unique, ignoring case and surrounding whitespace.
-- Sub-category names are unique within their category.
--
-- If this fails with "could not create unique index ... is duplicated",
-- the database already has duplicates: merge or rename them first (move
-- bottles/sub-categories onto one row, delete the other), then re-run.

CREATE UNIQUE INDEX categories_name_unique
    ON categories (lower(btrim(name)));

CREATE UNIQUE INDEX sub_categories_category_name_unique
    ON sub_categories (category_id, lower(btrim(name)));
