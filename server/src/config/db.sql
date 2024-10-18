//using mysql for DATABASE

CREATE DATABASE order_packaging;

USE order_packaging;

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    weight INT NOT NULL
);

CREATE TABLE courier_charges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    weight_range VARCHAR(255) NOT NULL,
    charge DECIMAL(10, 2) NOT NULL
);


