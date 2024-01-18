-- wop-seed.sql
-- Inserting sample users table
INSERT INTO users(username, PASSWORD, email, is_admin)
    VALUES ('john_doe', 'password123', 'john@example.com', FALSE),
('jane_smith', 'hashed_password_2', 'jane@example.com', FALSE),
('bob_jones', 'hashed_password_3', 'bob@example.com', FALSE),
('admin_user', 'admin_password', 'admin@example.com', TRUE),
('alice_wonder', 'alice_pass', 'alice@example.com', FALSE),
('charlie_brown', 'charlie_pass', 'charlie@example.com', FALSE),
('diana_rogers', 'diana_pass', 'diana@example.com', FALSE),
('edward_norton', 'edward_pass', 'edward@example.com', FALSE),
('frank_miller', 'frank_pass', 'frank@example.com', FALSE),
('grace_hopper', 'grace_pass', 'grace@example.com', FALSE);

-- Inserting sample company table
INSERT INTO companies(name, address, contact_name, phone_number, tax_id, user_id, email)
    VALUES ('company 1', '123 Add Rd', 'Joe', '4071234567', 'L12345678', 1, 'email1@gmail.com'),
('company 2', '7895 Cherry Blossom Blvd', 'Jane', '9876543210', 'L98765436', 2, 'email2@outlook.com'),
('company 3', '1953 Main Street', 'Bob', '4567891234', 'L98794565', 3, 'email3@outlook.com'),
('company 4', '567 Oak Lane', 'Alice', '7890123456', 'L87654321', 4, 'email4@yahoo.com'),
('company 5', '890 Pine Street', 'Charlie', '1234567890', 'L54321678', 5, 'email5@gmail.com'),
('company 6', '456 Elm Avenue', 'Diana', '2345678901', 'L87654321', 6, 'email6@yahoo.com'),
('company 7', '789 Birch Lane', 'Edward', '3456789012', 'L34567890', 7, 'email7@gmail.com'),
('company 8', '123 Oak Street', 'Frank', '4567890123', 'L56789012', 8, 'email8@outlook.com'),
('company 9', '456 Maple Avenue', 'Grace', '5678901234', 'L67890123', 9, 'email9@gmail.com'),
('company 10', '789 Walnut Lane', 'Harry', '6789012345', 'L78901234', 10, 'email10@yahoo.com');

-- Inserting sample service table
INSERT INTO service(date, service_type, company_id, po_number, invoice_number, pdf_file_id)
    VALUES ('2023-05-10', 'inspection', 1, 'po1564', 'inv456', 2),
('2023-02-24', 'maintenance', 2, 'po7862', 'inv456', 1),
('2023-12-05', 'preventative', 3, 'po4912', 'inv456', 3),
('2023-08-15', 'repair', 4, 'po9823', 'inv456', 4),
('2023-06-30', 'consultation', 5, 'po2345', 'inv456', 5),
('2023-04-15', 'upgrade', 6, 'po6789', 'inv456', 6),
('2023-09-20', 'installation', 7, 'po3456', 'inv456', 7),
('2023-11-12', 'training', 8, 'po7890', 'inv456', 8),
('2023-07-05', 'emergency', 9, 'po1234', 'inv456', 9),
('2023-10-18', 'testing', 10, 'po5678', 'inv456', 10);

-- Inserting default roles
INSERT INTO pdf_file(uri)
    VALUES ('maintenance_1.pdf'),
('inspect_1.pdf'),
('prevent_1.pdf'),
('repair_1.pdf'),
('consult_1.pdf'),
('upgrade_1.pdf'),
('install_1.pdf'),
('train_1.pdf'),
('emergency_1.pdf'),
('test_1.pdf');

