CREATE DATABASE IF NOT EXISTS delilah;

CREATE TABLE `roles` (
    id int NOT NULL AUTO_INCREMENT,
    rol_name  VARCHAR(50) NOT NULL UNIQUE,
    PRIMARY KEY (`id`)
);

CREATE TABLE `payment_methods` (
    id int NOT NULL AUTO_INCREMENT,
    payment_method_name  VARCHAR(50) NOT NULL UNIQUE,
    PRIMARY KEY (`id`)
);

CREATE TABLE `users` (
    id int NOT NULL AUTO_INCREMENT,
    rol int,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(20) NOT NULL UNIQUE,
    full_name VARCHAR(100),
    phone VARCHAR(20),
    address VARCHAR(100),
    FOREIGN KEY (`rol`) REFERENCES `roles`(`id`),
    PRIMARY KEY (`id`)
);

CREATE TABLE `products` (
    id int NOT NULL AUTO_INCREMENT,
    user_id int NOT NULL,
    product_name VARCHAR(50) NOT NULL,
    product_description TEXT NOT NULL,
    product_price FLOAT NOT NULL,
    product_discount FLOAT,
    product_poster VARCHAR(100),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
    PRIMARY KEY (`id`)
);

CREATE TABLE `orders` (
    id int NOT NULL AUTO_INCREMENT,
    customer_id int NOT NULL,
    payment_method int NOT NULL,
    order_status ENUM('Nuevo' , 'Confirmado' , 'Preparando' , 'Enviando' , 'Entregado') DEFAULT 'Nuevo',
    description VARCHAR(50) NOT NULL,
    total_paid FLOAT NOT NULL,
    FOREIGN KEY (`customer_id`) REFERENCES `users`(`id`),
    FOREIGN KEY (`payment_method`) REFERENCES `payment_methods`(`id`),
    PRIMARY KEY (`id`)
);