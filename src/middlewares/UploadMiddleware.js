import multer from "multer";
import path from "path";

const generateRamdomName = (count, ext) => {
    const posibleChars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
    let filename = "";
    for (let i = 1; i < count; i++) {
        const ramdomChar = Math.floor(
            Math.random() * (posibleChars.length - 1 - 0)
        );
        filename += posibleChars[ramdomChar];
    }

    return filename + ext;
};

export const Upload = (destination) => {
    const storage = multer.diskStorage({
        destination: (err, file, cb) => {
            cb(null, __dirname + "/../../public/assets/" + destination);
        },
        filename: (err, file, cb) => {
            cb(null, generateRamdomName(40, path.extname(file.originalname)));
        },
    });

    return multer({
        storage,
    });
};