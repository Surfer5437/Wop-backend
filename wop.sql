\echo 'Delete and recreate wop database?'
\prompt 'Return for yes or control-C to cancel > ' foo
DROP DATABASE wop;

CREATE DATABASE wop;

\connect wop
\i wop-schema.sql
\i wop-seed.sql
\echo 'Delete and recreate wop_test database?'
\prompt 'Return for yes or control-C to cancel > ' foo
DROP DATABASE wop_test;

CREATE DATABASE wop_test;

\connect wop_test
\i wop-schema.sql
