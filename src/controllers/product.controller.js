import { convertRowDataPacket, checkFields } from "../helpers";
import db from "../database";
const productMethods = {};
import fs from "fs";

/**
 * Last modified: 06/05/2021
 */
productMethods.getProducts = async (req, res) => {
    try {
        const products = await db.query("SELECT * FROM products");
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
                fs.unlinkSync(req.file.path);
            }

            await db.query(
                `INSERT INTO products (user_id, product_name, product_description, product_price, product_discount, product_poster) VALUES (? , ? , ? , ? , ?,?)`,
                [
                    req.user.id,
                    product_name,
                    product_description,
                    product_price,
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
 * Last modified: 06/05/2021
 */
productMethods.updateProduct = async (req, res) => {
    try {
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
productMethods.deleteProduct = async (req, res) => {
    try {
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};

export { productMethods as ProductController };
