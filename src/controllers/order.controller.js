import { convertRowDataPacket, checkFields } from "../helpers";
import {
    verifyProductAndStock,
    getOrderNewId,
    checkOrderStatusByID,
} from "../models";
import db from "../database";
const orderMethods = {};

/**
 * Last modified: 10/05/2021
 */
orderMethods.getOrders = async (req, res) => {
    try {
        const orders = await db.query(
            `SELECT O.* , S.order_name AS order_status_name , P.payment_method_name , U.full_name AS customer_name FROM orders O 
            INNER JOIN order_statuses S ON S.id = O.order_actual_status 
            INNER JOIN payment_methods P ON P.id = O.payment_method 
            INNER JOIN users U ON U.id = O.customer_id`
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
orderMethods.getOrderProducts = async (req, res) => {
    try {
        const { id } = req.params;
        if (id) {
            const order = await db.query(
                `SELECT OP.id , OP.order_id , OP.cuantity , P.* FROM order_products OP
                INNER JOIN products P ON P.id = OP.product_id
                WHERE order_id = ?`,
                [id]
            );
            const orderConvert = convertRowDataPacket(order);

            if (orderConvert.empty) {
                return res.status(400).json({
                    status: false,
                    message: "No se ha encontrado la orden",
                });
            }

            return res.status(200).json({
                status: true,
                data: { orderProducts: orderConvert.data },
            });
        } else {
            return res.status(200).json({
                status: true,
                message: "Order ID is required",
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
orderMethods.getOrder = async (req, res) => {
    try {
        const { id } = req.params;
        if (id) {
            const order = await db.query(
                `SELECT O.* , S.order_name AS order_status_name , P.payment_method_name , U.full_name AS customer_name FROM orders O 
                INNER JOIN order_statuses S ON S.id = O.order_actual_status 
                INNER JOIN payment_methods P ON P.id = O.payment_method 
                INNER JOIN users U ON U.id = O.customer_id
                WHERE O.id = ?`,
                [id]
            );
            const orderConvert = convertRowDataPacket(order);

            if (orderConvert.empty) {
                return res.status(400).json({
                    status: false,
                    message: "No se ha encontrado la orden",
                });
            }

            return res.status(200).json({
                status: true,
                data: { order: orderConvert.data },
            });
        } else {
            return res.status(200).json({
                status: true,
                message: "Order ID is required",
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
orderMethods.getOrderStatusHistory = async (req, res) => {
    try {
        const { id } = req.params;
        if (id) {
            const orderHistory = await db.query(
                `SELECT OH.id , OS.order_name AS order_status_name , OH.order_status_date FROM order_statuses_history OH 
                INNER JOIN order_statuses OS ON OS.id = OH.order_status
                WHERE order_id = ?`,
                [id]
            );
            const orderHistoryConvert = convertRowDataPacket(orderHistory);

            if (orderHistoryConvert.empty) {
                return res.status(400).json({
                    status: false,
                    message: "No se ha encontrado la orden",
                });
            }

            return res.status(200).json({
                status: true,
                data: { orderHistory: orderHistoryConvert.data },
            });
        } else {
            return res.status(200).json({
                status: true,
                message: "Order ID is required",
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
orderMethods.createOrder = async (req, res) => {
    try {
        const { customer_id, payment_method, products_data, address } =
            req.body;

        const verifyData = checkFields([
            {
                text: "customer id",
                value: customer_id,
                type: "number",
                required: true,
            },
            {
                text: "payment method",
                value: payment_method,
                type: "number",
                required: true,
            },
            {
                text: "products",
                value: products_data,
                type: "array",
                required: true,
            },
        ]);

        const orderNewIDStatus = await getOrderNewId();

        if (orderNewIDStatus.status) {
            if (verifyData.status) {
                const products = await verifyProductAndStock(products_data);

                if (!products.status) {
                    return res.status(400).json({
                        status: false,
                        message: products.error,
                    });
                }

                let orderDescription = "";
                let totalPaid = 0;
                products.products.map((product) => {
                    orderDescription +=
                        product.cuantity + "X " + product.product_name + " ";
                    totalPaid +=
                        Number(product.product_price) *
                        Number(product.cuantity);
                });

                const orderAddress = address ? address : req.user.address;

                db.getConnection((err, connection) => {
                    if (err) {
                        return res.status(500).json({
                            status: false,
                            message: err,
                        });
                    }
                    connection.beginTransaction((err) => {
                        if (err) {
                            return res.status(500).json({
                                status: false,
                                message: err,
                            });
                        }

                        connection.query(
                            "INSERT INTO orders (customer_id , payment_method , description , order_actual_status , total_paid , address) VALUES (? , ? , ? , ? , ? , ?)",
                            [
                                customer_id,
                                payment_method,
                                orderDescription,
                                orderNewIDStatus.orderID,
                                totalPaid,
                                orderAddress,
                            ],
                            (err, results) => {
                                if (err) {
                                    connection.rollback();
                                    return res.status(500).json({
                                        status: false,
                                        message: err,
                                    });
                                }

                                const insertedOrderID = results.insertId;

                                connection.query(
                                    "INSERT INTO order_statuses_history (order_id , order_status) VALUES (? , ?)",
                                    [insertedOrderID, orderNewIDStatus.orderID],
                                    (err, results) => {
                                        if (err) {
                                            connection.rollback();
                                            return res.status(500).json({
                                                status: false,
                                                message: err,
                                            });
                                        }

                                        products.products.map((product) => {
                                            connection.query(
                                                "INSERT INTO order_products (product_id , order_id , cuantity) VALUES (? , ? , ?)",
                                                [
                                                    product.id,
                                                    insertedOrderID,
                                                    Number(product.cuantity),
                                                ],
                                                (err, results) => {
                                                    if (err) {
                                                        connection.rollback();
                                                        return res
                                                            .status(500)
                                                            .json({
                                                                status: false,
                                                                message: err,
                                                            });
                                                    }

                                                    connection.query(
                                                        "UPDATE products SET product_stock = ? WHERE id = ?",
                                                        [
                                                            Number(
                                                                product.product_stock
                                                            ) -
                                                                Number(
                                                                    product.cuantity
                                                                ),
                                                            product.id,
                                                        ],
                                                        (err, results) => {
                                                            if (err) {
                                                                connection.rollback();
                                                                return res
                                                                    .status(500)
                                                                    .json({
                                                                        status: false,
                                                                        message:
                                                                            err,
                                                                    });
                                                            }

                                                            connection.commit();
                                                        }
                                                    );
                                                }
                                            );
                                        });

                                        return res.status(201).json({
                                            status: true,
                                            message:
                                                "Order was created successfully.",
                                        });
                                    }
                                );
                            }
                        );
                    });
                });
            } else {
                return res.status(400).json({
                    status: false,
                    errors: verifyData.errors,
                    message: "Some fields has errors.",
                });
            }
        } else {
            return res.status(400).json({
                status: false,
                message: orderNewIDStatus.message,
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
orderMethods.updateOrderStatus = async (req, res) => {
    try {
        const { order_id, status_id } = req.body;
        const verifyData = checkFields([
            {
                text: "order ID",
                value: order_id,
                type: "number",
                required: true,
            },
            {
                text: "status id",
                value: status_id,
                type: "number",
                required: true,
            },
        ]);
        if (verifyData.status) {
            const order = await db.query("SELECT * FROM orders WHERE id = ?", [
                order_id,
            ]);
            if (order) {
                if (order.length > 0) {
                    const parseData = convertRowDataPacket(order);
                    if (parseData.type === "object") {
                        const checkNewStatus = await checkOrderStatusByID(
                            status_id
                        );
                        if (checkNewStatus.status) {
                            db.getConnection((err, connection) => {
                                if (err) {
                                    return res.status(500).json({
                                        status: false,
                                        message: err,
                                    });
                                }
                                connection.beginTransaction((err) => {
                                    if (err) {
                                        return res.status(500).json({
                                            status: false,
                                            message: err,
                                        });
                                    }

                                    connection.query(
                                        "UPDATE orders SET order_actual_status = ? WHERE id = ?",
                                        [status_id, order_id],
                                        (err, results) => {
                                            if (err) {
                                                connection.rollback();
                                                return res.status(500).json({
                                                    status: false,
                                                    message: err,
                                                });
                                            }

                                            connection.query(
                                                "INSERT INTO order_statuses_history (order_id , order_status) VALUES (? , ?)",
                                                [order_id, status_id],
                                                (err, results) => {
                                                    if (err) {
                                                        connection.rollback();
                                                        return res
                                                            .status(500)
                                                            .json({
                                                                status: false,
                                                                message: err,
                                                            });
                                                    }

                                                    connection.commit();
                                                    return res
                                                        .status(200)
                                                        .json({
                                                            status: true,
                                                            message:
                                                                "Order status updated successfully.",
                                                        });
                                                }
                                            );
                                        }
                                    );
                                });
                            });
                        } else {
                            return res.status(400).json({
                                status: false,
                                message: `The new status is not a valid status`,
                            });
                        }
                    } else {
                        return res.status(400).json({
                            status: false,
                            message: `Order with ${order_id} not found`,
                        });
                    }
                } else {
                    return res.status(400).json({
                        status: false,
                        message: `Order with ${order_id} not found`,
                    });
                }
            } else {
                return res.status(400).json({
                    status: false,
                    message: `Order with ${order_id} not found`,
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
orderMethods.deleteOrder = async (req, res) => {
    try {
        const { order_id } = req.body;
        const verifyData = checkFields([
            {
                text: "order ID",
                value: order_id,
                type: "number",
                required: true,
            },
        ]);
        if (verifyData.status) {
            const order = await db.query("SELECT * FROM orders WHERE id = ?", [
                order_id,
            ]);
            if (order) {
                if (order.length > 0) {
                    const parseData = convertRowDataPacket(order);
                    if (parseData.type === "object") {
                        db.getConnection((err, connection) => {
                            if (err) {
                                return res.status(500).json({
                                    status: false,
                                    message: err,
                                });
                            }
                            connection.beginTransaction((err) => {
                                if (err) {
                                    return res.status(500).json({
                                        status: false,
                                        message: err,
                                    });
                                }

                                connection.query(
                                    "DELETE FROM order_statuses_history WHERE order_id = ?",
                                    [order_id],
                                    (err, results) => {
                                        if (err) {
                                            connection.rollback();
                                            return res.status(500).json({
                                                status: false,
                                                message: err,
                                            });
                                        }

                                        connection.query(
                                            "DELETE FROM order_products WHERE order_id = ?",
                                            [order_id],
                                            (err, results) => {
                                                if (err) {
                                                    connection.rollback();
                                                    return res
                                                        .status(500)
                                                        .json({
                                                            status: false,
                                                            message: err,
                                                        });
                                                }

                                                connection.query(
                                                    "DELETE FROM orders WHERE id = ?",
                                                    [order_id],
                                                    (err, results) => {
                                                        if (err) {
                                                            connection.rollback();
                                                            return res
                                                                .status(500)
                                                                .json({
                                                                    status: false,
                                                                    message:
                                                                        err,
                                                                });
                                                        }

                                                        connection.commit();
                                                        return res
                                                            .status(200)
                                                            .json({
                                                                status: true,
                                                                message:
                                                                    "Order deleted successfully.",
                                                            });
                                                    }
                                                );
                                            }
                                        );
                                    }
                                );
                            });
                        });
                    } else {
                        return res.status(400).json({
                            status: false,
                            message: `Order with ${order_id} not found`,
                        });
                    }
                } else {
                    return res.status(400).json({
                        status: false,
                        message: `Order with ${order_id} not found`,
                    });
                }
            } else {
                return res.status(400).json({
                    status: false,
                    message: `Order with ${order_id} not found`,
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

export { orderMethods as OrderController };
