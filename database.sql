DROP DATABASE IF EXISTS delilah;
CREATE DATABASE IF NOT EXISTS delilah;

CREATE TABLE `roles` (
    id int NOT NULL AUTO_INCREMENT,
    rol_name  VARCHAR(50) NOT NULL UNIQUE,
    PRIMARY KEY (`id`)
);

INSERT INTO `roles` (`id`, `rol_name`) VALUES
(1, 'admin'),
(2, 'user');

CREATE TABLE `payment_methods` (
    id int NOT NULL AUTO_INCREMENT,
    payment_method_status ENUM('active' , 'draft') DEFAULT 'active',
    payment_method_name  VARCHAR(50) NOT NULL UNIQUE,
    PRIMARY KEY (`id`)
);

INSERT INTO `payment_methods` (`id`, `payment_method_name`) VALUES (NULL, 'Efectivo'), (NULL, 'Tarjeta de credito');

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
    product_status ENUM('active' , 'draft') DEFAULT 'active',
    product_name VARCHAR(50) NOT NULL,
    product_description TEXT NOT NULL,
    product_price FLOAT NOT NULL,
    product_stock int NOT NULL DEFAULT 0,
    product_discount FLOAT,
    product_poster VARCHAR(100),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
    PRIMARY KEY (`id`)
);

CREATE TABLE `order_statuses` (
    id int NOT NULL AUTO_INCREMENT,
    order_status_status ENUM('active' , 'draft') DEFAULT 'active',
    order_name ENUM('Nuevo' , 'Confirmado' , 'Preparando' , 'Enviando' , 'Entregado') DEFAULT 'Nuevo' NOT NULL UNIQUE,
    PRIMARY KEY (`id`)
);

INSERT INTO `order_statuses` (`id`, `order_name`) VALUES (NULL, 'Nuevo'), (NULL, 'Confirmado'), (NULL, 'Preparando'), (NULL, 'Enviando'), (NULL, 'Entregado');

CREATE TABLE `orders` (
    id int NOT NULL AUTO_INCREMENT,
    customer_id int NOT NULL,
    payment_method int NOT NULL,
    description TEXT NOT NULL,
    order_actual_status int NOT NULL,
    total_paid FLOAT NOT NULL,
    address VARCHAR(60) NOT NULL,
    FOREIGN KEY (`customer_id`) REFERENCES `users`(`id`),
    FOREIGN KEY (`payment_method`) REFERENCES `payment_methods`(`id`),
    FOREIGN KEY (`order_actual_status`) REFERENCES `order_statuses`(`id`),
    PRIMARY KEY (`id`)
);

CREATE TABLE `order_statuses_history` (
    id int NOT NULL AUTO_INCREMENT,
    order_id int NOT NULL,
    order_status int NOT NULL,
    order_status_date TIMESTAMP,
    FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`),
    FOREIGN KEY (`order_status`) REFERENCES `order_statuses`(`id`),
    PRIMARY KEY (`id`)
);

CREATE TABLE `order_products` (
    id int NOT NULL AUTO_INCREMENT,
    product_id int NOT NULL,
    order_id int NOT NULL,
    cuantity int NOT NULL DEFAULT 1,
    FOREIGN KEY (`product_id`) REFERENCES `products`(`id`),
    FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`),
    PRIMARY KEY (`id`)
);

INSERT INTO `users` (`id`, `rol`, `email`, `password`, `username`, `full_name`, `phone`, `address`) VALUES
(1, 1, 'admin@admin.com', '$2a$10$PFjBasMVcP5ei955/UjrHu1vAuBPWJ/F7AIrfMGNq7LVouLOYMITS', 'admin', 'Juan Araque', '3104070562', 'Calle 012 A #24 - 08'),
(2, 2, 'user@admin.com', '$2a$10$OUF.uPyO0caQrQ8y/PoAX.0Z/EebpkOiPKCaCn2zCkwUXu8RIvwXi', 'user', 'Andrea Cano', '3104010327', 'Calle 2 # 16 - 35');