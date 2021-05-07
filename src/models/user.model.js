import db from "../database";
import { convertRowDataPacket } from "../helpers";

export const getUserByParam = async (value, param) => {
    const getUser = await db.query(`SELECT * FROM users WHERE ${param} = ?`, [
        value,
    ]);
    if (getUser) {
        if (getUser.length > 0) {
            const parseData = convertRowDataPacket(getUser);
            if (parseData.type === "object") {
                return {
                    status: true,
                    user: parseData.data,
                };
            } else {
                return {
                    status: false,
                    message: "User not found",
                };
            }
        } else {
            return {
                status: false,
                message: "User not found",
            };
        }
    } else {
        return {
            status: false,
            message: "User not found",
        };
    }
};
