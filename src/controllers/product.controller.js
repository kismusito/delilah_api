import { convertRowDataPacket, checkFields } from "../helpers";
import db from "../database";
const productMethods = {};
import fs from "fs";

/**
 * Last modified: 06/05/2021
 */
productMethods.getProducts = async (req, res) => {
    try {
        const products = await db.query(
            "SELECT * FROM products WHERE product_status = 'active'"
        );
        return res.status(200).json({
            status: true,
            data: { products },
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};

/**
 * Last modified: 06/05/2021
 */
productMethods.getProduct = async (req, res) => {
    try {
        const { id } = req.params;
        if (id) {
            const product = await db.query(
                "SELECT * FROM products WHERE id = ?",
                [id]
            );
            const productConvert = convertRowDataPacket(product);
            return res.status(200).json({
                status: true,
                data: { product: productConvert.data },
            });
        } else {
            return res.status(200).json({
                status: true,
                message: "Product ID is required",
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};

/**
 * Last modified: 06/05/2021
 */
productMethods.createProduct = async (req, res) => {
    try {
        const {
            product_name,
            product_description,
            product_price,
            stock,
            product_discount,
        } = req.body;
        const verifyData = checkFields([
            {
                text: "product name",
                value: product_name,
                type: "text",
                length: 5,
                required: true,
            },
            {
                text: "product description",
                value: product_description,
                type: "text",
                length: 10,
                required: true,
            },
            {
                text: "stock",
                value: stock,
                type: "number",
                required: true,
            },
            {
                text: "product price",
                value: product_price,
                type: "number",
                required: true,
            },
        ]);
        if (verifyData.status) {
            let poster = "";
            if (req.file) {
                poster = "/assets/uploads/products/" + req.file.filename;
            }

            await db.query(
                `INSERT INTO products (user_id, product_name, product_description, product_price, product_stock , product_discount, product_poster) VALUES (? , ? , ? , ? , ? , ?,?)`,
                [
                    req.user.id,
                    product_name,
                    product_description,
                    product_price,
                    stock,
                    product_discount ? product_discount : 0,
                    poster,
                ]
            );

            return res.status(201).json({
                status: true,
                message: "Product created successfully.",
            });
        } else {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({
                status: false,
                errors: verifyData.errors,
                message: "Some fields has errors.",
            });
        }
    } catch (error) {
        if (req.file) {
            fs.unlinkSync(file.path);
        }
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};

/**
 * Last modified: 10/05/2021
 */
productMethods.updateProduct = async (req, res) => {
    try {
        const {
            productID,
            product_name,
            product_description,
            product_price,
            stock,
            product_discount,
        } = req.body;
        const verifyData = checkFields([
            {
                text: "ID del producto",
                value: productID,
                type: "number",
                required: true,
            },
            {
                text: "product name",
                value: product_name,
                type: "text",
                length: 5,
                required: true,
            },
            {
                text: "product description",
                value: product_description,
                type: "text",
                length: 10,
                required: true,
            },
            {
                text: "stock",
                value: stock,
                type: "number",
                required: true,
            },
            {
                text: "product price",
                value: product_price,
                type: "number",
                required: true,
            },
        ]);
        if (verifyData.status) {
            const product = await db.query(
                "SELECT * FROM products WHERE id = ?",
                [productID]
            );
            const productConvert = convertRowDataPacket(product);
            if (productConvert.data) {
                const getProduct = productConvert.data;
                if (getProduct.user_id.toString() === req.user.id.toString()) {
                    let poster = getProduct.product_poster
                        ? getProduct.product_poster
                        : "";
                    if (req.file) {
                        if (poster.length > 0) {
                            if (
                                await fs.existsSync(
                                    __dirname + "/../../public" + poster
                                )
                            ) {
                                fs.unlinkSync(
                                    __dirname + "/../../public" + poster
                                );
                            }
                        }

                        poster =
                            "/assets/uploads/products/" + req.file.filename;
                    }

                    await db.query(
                        "UPDATE products SET product_name = ?, product_description = ?, product_price = ?, product_stock = ?, product_discount = ?, product_poster = ? WHERE id = ?",
                        [
                            product_name,
                            product_description,
                            product_price,
                            stock,
                            product_discount ? product_discount : 0,
                            poster,
                            productID,
                        ]
                    );

                    return res.status(200).json({
                        status: true,
                        message: "Product updated successfully.",
                    });
                } else {
                    if (req.file) {
                        fs.unlinkSync(file.path);
                    }
                    return res.status(400).json({
                        status: false,
                        message: "You can't modify this resource.",
                    });
                }
            } else {
                if (req.file) {
                    fs.unlinkSync(file.path);
                }
                return res.status(500).json({
                    status: false,
                    message: "There was an error, please try again.",
                });
            }
        } else {
            if (req.file) {
                fs.unlinkSync(file.path);
            }
            return res.status(400).json({
                status: false,
                errors: verifyData.errors,
                message: "Some fields has errors.",
            });
        }
    } catch (error) {
        if (req.file) {
            fs.unlinkSync(file.path);
        }
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};

/**
 * Last modified: 10/05/2021
 */
productMethods.deleteProduct = async (req, res) => {
    try {
        const { productID } = req.body;
        const verifyData = checkFields([
            {
                text: "ID del producto",
                value: productID,
                type: "number",
                required: true,
            },
        ]);
        if (verifyData.status) {
            const product = await db.query(
                "SELECT * FROM products WHERE id = ?",
                [productID]
            );
            const productConvert = convertRowDataPacket(product);
            if (productConvert.data) {
                const getProduct = productConvert.data;
                if (getProduct.user_id.toString() === req.user.id.toString()) {
                    await db.query(
                        "UPDATE products SET product_status = ? WHERE id = ?",
                        ["draft", productID]
                    );
                    return res.status(200).json({
                        status: true,
                        message: "The product was archived.",
                    });
                } else {
                    return res.status(400).json({
                        status: false,
                        message: "You can't modify this resource.",
                    });
                }
            } else {
                return res.status(500).json({
                    status: false,
                    message: "There was an error, please try again.",
                });
            }
        } else {
            return res.status(400).json({
                status: false,
                errors: verifyData.errors,
                message: "Some fields has errors.",
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};

export { productMethods as ProductController };
