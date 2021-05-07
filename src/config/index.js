import dotenv from "dotenv";
dotenv.config();

export const config = {
    db: {
        host: process.env.DBHOST || "localhost",
        database: process.env.DBNAME || "delilah",
        user: process.env.DBUSER || "root",
        password: process.env.DBPASSWORD || "",
    },
    private_key: process.env.PRIVATE_KEY || "GvZXJoGDyXCyxrBYurREzLcAhAbPgHMf",
};
