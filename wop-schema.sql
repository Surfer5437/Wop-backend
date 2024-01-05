CREATE TABLE users(
  id serial PRIMARY KEY,
  username varchar(25),
  password TEXT NOT NULL,
  email text NOT NULL CHECK (position('@' IN email) > 1),
  is_admin boolean DEFAULT FALSE
);

CREATE TABLE companies(
  id serial PRIMARY KEY,
  name text NOT NULL,
  address text NOT NULL,
  contact_name text,
  phone_number text,
  tax_id text,
  user_id integer
);

CREATE TABLE service(
  id serial PRIMARY KEY,
  date date NOT NULL,
  -- date is stored yyyy-mm-dd
  service_type text NOT NULL,
  pdf_file_id integer NOT NULL,
  company_id integer NOT NULL,
  po_number text,
  invoice_number text
);

CREATE TABLE pdf_file(
  id serial PRIMARY KEY,
  uri text NOT NULL
);

