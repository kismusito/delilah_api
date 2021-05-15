import { convertRowDataPacket, checkFields } from "../helpers";
import db from "../database";
const paymentMethods = {};

/**
 * Last modified: 10/05/2021
 */
paymentMethods.getPaymentMethods = async (req, res) => {
    try {
        const paymentMethods = await db.query(
            "SELECT * FROM payment_methods WHERE payment_method_status = ?",
            ["active"]
        );
        return res.status(200).json({
            status: true,
            data: { paymentMethods },
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};

/**
 * Last modified: 10/05/2021
 */
paymentMethods.getPaymentMethod = async (req, res) => {
    try {
        const { id } = req.params;
        if (id) {
            const paymentMethod = await db.query(
                "SELECT * FROM payment_methods WHERE id = ?",
                [id]
            );
            const paymentMethodConvert = convertRowDataPacket(paymentMethod);

            return res.status(200).json({
                status: true,
                data: { paymentMethod: paymentMethodConvert.data },
            });
        } else {
            return res.status(200).json({
                status: true,
                message: "Payment Method ID is required",
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
 * Last modified: 10/05/2021
 */
paymentMethods.createPaymentMethod = async (req, res) => {
    try {
        const { payment_method_name } = req.body;
        const verifyData = checkFields([
            {
                text: "payment method name",
                value: payment_method_name,
                type: "text",
                required: true,
            },
        ]);
        if (verifyData.status) {
            await db.query(
                `INSERT INTO payment_methods (payment_method_name) VALUES (?)`,
                [payment_method_name]
            );

            return res.status(201).json({
                status: true,
                message: "Payment method created successfully.",
            });
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

/**
 * Last modified: 10/05/2021
 */
paymentMethods.updatePaymentMethod = async (req, res) => {
    try {
        const { payment_method_id, payment_method_name } = req.body;
        const verifyData = checkFields([
            {
                text: "payment method id",
                value: payment_method_id,
                type: "number",
                required: true,
            },
            {
                text: "payment method name",
                value: payment_method_name,
                type: "text",
                required: true,
            },
        ]);
        if (verifyData.status) {
            await db.query(
                "UPDATE payment_methods SET payment_method_name = ? WHERE id = ?",
                [payment_method_name, payment_method_id]
            );
            return res.status(200).json({
                status: true,
                message: "Payment method updated successfully.",
            });
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

/**
 * Last modified: 10/05/2021
 */
paymentMethods.deletePaymentMethod = async (req, res) => {
    try {
        const { payment_method_id } = req.body;
        const verifyData = checkFields([
            {
                text: "payment method id",
                value: payment_method_id,
                type: "number",
                required: true,
            },
        ]);
        if (verifyData.status) {
            await db.query(
                "UPDATE payment_methods SET payment_method_status = ? WHERE id = ?",
                ["draft", payment_method_id]
            );
            return res.status(200).json({
                status: true,
                message: "The product was archived.",
            });
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

export { paymentMethods as PaymentMethodController };
