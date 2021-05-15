import { getUserByParam } from "../models";
import { config } from "../config";
import jwt from "jsonwebtoken";
import db from "../database";
const userMethods = {};
import {
    checkIfIsEmail,
    convertRowDataPacket,
    verifyPassword,
    checkFields,
    encryptPassword,
} from "../helpers";

/**
 * Last modified: 04/05/2021
 */
userMethods.login = async (req, res) => {
    try {
        const { emailorusername, password } = req.body;
        if (emailorusername && password) {
            const searchBy = checkIfIsEmail(emailorusername)
                ? "email"
                : "username";
            const getUser = await db.query(
                `SELECT U.* , R.rol_name FROM users U INNER JOIN roles R ON R.id = U.rol WHERE U.${searchBy} = ?`,
                [emailorusername]
            );
            if (getUser) {
                if (getUser.length > 0) {
                    const parseData = convertRowDataPacket(getUser);
                    if (parseData.type === "object") {
                        if (
                            await verifyPassword(
                                password,
                                parseData.data.password
                            )
                        ) {
                            const token = await jwt.sign(
                                {
                                    id: parseData.data.id,
                                    rol: parseData.data.rol_name,
                                    email: parseData.data.email,
                                    username: parseData.data.username,
                                    phone: parseData.data.phone,
                                    address: parseData.data.address,
                                },
                                config.private_key,
                                {
                                    expiresIn: "12h",
                                }
                            );
                            if (token) {
                                return res.status(200).json({
                                    status: true,
                                    token,
                                    message: "Correct credentials",
                                });
                            } else {
                                return res.status(500).json({
                                    status: false,
                                    message:
                                        "There was an error, please try again",
                                });
                            }
                        } else {
                            return res.status(400).json({
                                status: false,
                                message: "User or password incorrect",
                            });
                        }
                    } else {
                        return res.status(500).json({
                            status: false,
                            message: "There was an error, please try again",
                        });
                    }
                } else {
                    return res.status(400).json({
                        status: false,
                        message: "User or password incorrect",
                    });
                }
            } else {
                return res.status(400).json({
                    status: false,
                    message: "User or password incorrect",
                });
            }
        } else {
            return res.status(400).json({
                status: false,
                message: "All fields are required",
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
userMethods.register = async (req, res) => {
    try {
        const { username, email, password, full_name, phone, address } =
            req.body;
        const verifyData = checkFields([
            {
                text: "username",
                value: username,
                type: "text",
                length: 5,
                required: true,
            },
            {
                text: "email",
                value: email,
                type: "email",
                required: true,
            },
            {
                text: "password",
                value: password,
                type: "text",
                length: 6,
                required: true,
            },
            {
                text: "full_name",
                value: full_name,
                type: "text",
                length: 8,
                required: true,
            },
            {
                text: "phone",
                value: phone,
                type: "number",
                length: 10,
                required: true,
            },
            {
                text: "address",
                value: address,
                type: "text",
                length: 6,
                required: true,
            },
        ]);
        if (verifyData.status) {
            const checkEmailAvailability = await getUserByParam(email, "email");
            if (checkEmailAvailability.status) {
                return res.status(400).json({
                    status: false,
                    message: "The email is already taken.",
                });
            }

            const checkUsernameAvailability = await getUserByParam(
                username,
                "username"
            );
            if (checkUsernameAvailability.status) {
                return res.status(400).json({
                    status: false,
                    message: "The username is already taken.",
                });
            }

            const encryptUserPassword = await encryptPassword(password);

            await db.query(
                `INSERT INTO users (rol , email , password , username , full_name , phone , address) VALUES(? , ? , ? , ? , ? , ? , ?)`,
                [
                    2,
                    email,
                    encryptUserPassword,
                    username,
                    full_name,
                    phone,
                    address,
                ]
            );

            return res.status(201).json({
                status: true,
                message: "User registered successfully.",
            });
        } else {
            return res.status(400).json({
                status: false,
                errors: verifyData.errors,
                message: "Some fields has errors.",
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};

/**
 * Last modified: 06/05/2021
 */
userMethods.authenticate = async (req, res) => {
    return res.status(200).json({
        status: true,
        message: "Correct token and credentials.",
    });
};

export { userMethods as UserController };
