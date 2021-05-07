import mysql from "mysql";
import { config } from "./config";
import { promisify } from "util";

const pool = mysql.createPool(config.db);

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === "PROTOCOL_CONNECTION_LOST") {
            console.error("Connection lost");
        }

        if (err.code === "ER_CON_COUNT_ERROR") {
            console.error("Connection has to many connections");
        }

        if (err.code === "ECONNREFUSED") {
            console.error("Database connection refused");
        }
    }

    if (connection) connection.release();
    console.log("Connection established");
    return;
});

pool.query = promisify(pool.query);

export default pool;
