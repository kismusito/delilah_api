import db from "../database";
import { convertRowDataPacket } from "../helpers";

export const verifyProductAndStock = async (products = []) => {
    let productData = {
        status: true,
        error: "",
        products: [],
    };
    for (let i in products) {
        const product = products[i];
        if (product.product_id && product.cuantity) {
            const getProduct = await db.query(
                "SELECT * FROM products WHERE id = ?",
                [product.product_id]
            );
            const productConvertData = convertRowDataPacket(getProduct);

            if (productConvertData.empty) {
                productData = {
                    status: false,
                    error: `Product with id ${product.product_id} is not valid, check it and try again.`,
                };
                break;
            }

            const productGetData = productConvertData.data;

            if (productGetData.product_stock - product.cuantity < 0) {
                productData = {
                    status: false,
                    error: `Product with id ${product.product_id} has not sufficient stock.`,
                };
                break;
            }

            productData.products = [
                { ...productGetData, cuantity: product.cuantity },
                ...productData.products,
            ];
        } else {
            productData = {
                status: false,
                error: `You need provide product id and cuantity used for each product.`,
            };
            break;
        }
    }

    return productData;
};
