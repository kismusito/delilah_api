import db from "../database";
import { convertRowDataPacket } from "../helpers";

export const getOrderNewId = async () => {
    const status = await db.query(
        "SELECT * FROM order_statuses WHERE order_name = ?",
        ["Nuevo"]
    );
    if (status) {
        if (status.length > 0) {
            const parseData = convertRowDataPacket(status);
            if (parseData.type === "object") {
                return {
                    status: true,
                    orderID: parseData.data.id,
                };
            } else {
                return {
                    status: false,
                    message: "Order status not found",
                };
            }
        } else {
            return {
                status: false,
                message: "Order status not found",
            };
        }
    } else {
        return {
            status: false,
        };
    }
};

export const checkOrderStatusByID = async (id) => {
    const status = await db.query("SELECT * FROM order_statuses WHERE id = ?", [
        id,
    ]);
    if (status) {
        if (status.length > 0) {
            const parseData = convertRowDataPacket(status);
            if (parseData.type === "object") {
                return {
                    status: true,
                    statusData: parseData.data,
                };
            } else {
                return {
                    status: false,
                    message: "Order status not found",
                };
            }
        } else {
            return {
                status: false,
                message: "Order status not found",
            };
        }
    } else {
        return {
            status: false,
        };
    }
};
