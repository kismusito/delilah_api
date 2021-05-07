import app from "./app";
import dotenv from "dotenv";

dotenv.config();

(async () => {
    await app.listen(process.env.PORT || 4000);
    console.log(`App running on port ${process.env.PORT || 4000}`);
})();
