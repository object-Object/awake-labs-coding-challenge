create database customers;

\c customers;

CREATE TABLE users (
  id SERIAL,
  location VARCHAR(255),
  alias VARCHAR(255),
  email VARCHAR(255)
);

INSERT INTO customers.public.users 
("location", alias, email)
VALUES('Toronto', 'SB', 'sb@awakelabs.com');

INSERT INTO customers.public.users 
("location", alias, email)
VALUES('Vancouver', 'JR', 'jr@awakelabs.com');

INSERT INTO customers.public.users 
("location", alias, email)
VALUES('Toronto', 'KH', 'kh@awakelabs.com');

INSERT INTO customers.public.users 
("location", alias, email)
VALUES('Calgary', 'WR', 'wr@awakelabs.com');

INSERT INTO customers.public.users 
("location", alias, email)
VALUES('Ottawa', 'PT', 'pt@awakelabs.com');