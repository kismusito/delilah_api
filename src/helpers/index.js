import bcrypt from "bcryptjs";

export const checkIfIsEmail = (string) => {
    const emailRegExp = new RegExp(
        "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"
    );
    return emailRegExp.test(string);
};

// Types text , value , type , length , required
export const checkFields = (data = []) => {
    let response = {
        status: true,
        errors: [],
    };

    for (let i in data) {
        const field = data[i];
        if (field.required) {
            if (!field.value) {
                response = {
                    status: false,
                    errors: [
                        ...response.errors,
                        `The field ${field.text} is required`,
                    ],
                };
                continue;
            }
        }

        if (field.length) {
            if (field.value.length < field.length) {
                response = {
                    status: false,
                    errors: [
                        ...response.errors,
                        `The field ${field.text} must have ${field.length} characteres`,
                    ],
                };
                continue;
            }
        }

        if (field.type) {
            switch (field.type) {
                case "text":
                    if (typeof field.value !== "string") {
                        response = {
                            status: false,
                            errors: [
                                ...response.errors,
                                `The field ${field.text} must be a text.`,
                            ],
                        };
                    }
                    break;
                case "email":
                    if (!checkIfIsEmail(field.value)) {
                        response = {
                            status: false,
                            errors: [
                                ...response.errors,
                                `The field ${field.text} is not a valid email format`,
                            ],
                        };
                    }
                    break;
                case "number":
                    if (Number(field.value).toString() === "NaN") {
                        response = {
                            status: false,
                            errors: [
                                ...response.errors,
                                `The field ${field.text} is not a valid number`,
                            ],
                        };
                    }
                    break;
                case "array":
                    if (!Array.isArray(field.value)) {
                        response = {
                            status: false,
                            errors: [
                                ...response.errors,
                                `The field ${field.text} is not a valid array format`,
                            ],
                        };
                    }
                    break;
                default:
                    break;
            }
        }
    }

    return response;
};

export const convertRowDataPacket = (data) => {
    const stringifyData = JSON.stringify(data);
    const parseData = JSON.parse(stringifyData);
    if (parseData.length > 1) {
        return {
            type: "array",
            data: parseData,
        };
    }

    if (parseData.length === 0) {
        return {
            type: "array",
            empty: true,
            data: [],
        };
    }

    return {
        type: "object",
        data: parseData[0],
    };
};

export const verifyPassword = (password, hashPassword) => {
    return bcrypt.compare(password.toString(), hashPassword.toString());
};

export const encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};
