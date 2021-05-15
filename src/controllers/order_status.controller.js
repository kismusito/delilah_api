import { convertRowDataPacket, checkFields } from "../helpers";
import db from "../database";
import { config } from "../config";
const orderStatusMethods = {};

/**
 * Last modified: 10/05/2021
 */
orderStatusMethods.getOrderStatuses = async (req, res) => {
    try {
        const orders = await db.query(
            "SELECT * FROM order_statuses WHERE order_status_status = ?",
            ["active"]
        );
        return res.status(200).json({
            status: true,
            data: { orders },
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
orderStatusMethods.getOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        if (id) {
            const orderStatus = await db.query(
                "SELECT * FROM order_statuses WHERE id = ?",
                [id]
            );
            const orderStatusConvert = convertRowDataPacket(orderStatus);

            return res.status(200).json({
                status: true,
                data: { order: orderStatusConvert.data },
            });
        } else {
            return res.status(200).json({
                status: true,
                message: "Order status ID is required",
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
orderStatusMethods.createOrderStatus = async (req, res) => {
    try {
        const { order_name } = req.body;
        const verifyData = checkFields([
            {
                text: "order name",
                value: order_name,
                type: "text",
                required: true,
            },
        ]);
        if (verifyData.status) {
            if (config.posible_order_statuses.includes(order_name)) {
                await db.query(
                    `INSERT INTO order_statuses (order_name) VALUES (?)`,
                    [order_name]
                );

                return res.status(201).json({
                    status: true,
                    message: "Order status created successfully.",
                });
            } else {
                return res.status(400).json({
                    status: false,
                    message: "Invalid status name.",
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

/**
 * Last modified: 10/05/2021
 */
orderStatusMethods.updateOrderStatus = async (req, res) => {
    try {
        const { order_status_id, order_name } = req.body;
        const verifyData = checkFields([
            {
                text: "order status id",
                value: order_status_id,
                type: "number",
                required: true,
            },
            {
                text: "order status name",
                value: order_name,
                type: "text",
                required: true,
            },
        ]);
        if (verifyData.status) {
            if (config.posible_order_statuses.includes(order_name)) {
                await db.query(
                    "UPDATE order_statuses SET order_name = ? WHERE id = ?",
                    [order_name, order_status_id]
                );
                return res.status(200).json({
                    status: true,
                    message: "Order status updated successfully.",
                });
            } else {
                return res.status(400).json({
                    status: false,
                    message: "Invalid status name.",
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

/**
 * Last modified: 10/05/2021
 */
orderStatusMethods.deleteOrderStatus = async (req, res) => {
    try {
        const { order_status_id } = req.body;
        const verifyData = checkFields([
            {
                text: "order status id",
                value: order_status_id,
                type: "number",
                required: true,
            },
        ]);
        if (verifyData.status) {
            await db.query(
                "UPDATE order_statuses SET order_status_status = ? WHERE id = ?",
                ["draft", order_status_id]
            );
            return res.status(200).json({
                status: true,
                message: "Order status was archived.",
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

export { orderStatusMethods as OrderStatusController };
