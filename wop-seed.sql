-- wop-seed.sql
-- Inserting sample users table
INSERT INTO users(username, PASSWORD, email, is_admin)
    VALUES ('john_doe', 'password123', 'john@example.com', FALSE),
('jane_smith', 'hashed_password_2', 'jane@example.com', FALSE),
('bob_jones', 'hashed_password_3', 'bob@example.com', FALSE);

-- Inserting sample company table
INSERT INTO companies(name, address, contact_name, phone_number, tax_id, user_id)
    VALUES ('company 1', '123add rd', 'Joe', '4071234567', 'L12345678', 1),
('company 2', '7895 cherry blossom blvd', 'Jane', '9876543210', 'L98765436', 2),
('company 3', '1953 main street', 'Bob', '4567891234', 'L98794565', 3);

-- Inserting sample service table
INSERT INTO service(date, service_type, company_id, po_number, invoice_number, pdf_file_id)
    VALUES ('2023-05-10', 'inspection', 1, 'po1564', 'inv456', 2),
('2023-02-24', 'maintenance', 2, 'po7862', 'inv456', 1),
('2023-12-05', 'preventative', 3, 'po4912', 'inv456', 3);

-- Inserting default roles
INSERT INTO pdf_file(uri)
    VALUES ('maintenance_1.pdf'),
('inspect_1.pdf'),
('prevent_1.pdf');

