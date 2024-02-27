import * as dotenv from 'dotenv';
dotenv.config();

export const Env = () => ({
    UPLOAD_FILE_PATH: process.env.UPLOAD_FILE_PATH,
    PORT: process.env.PORT,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
    DB_NAME: process.env.DB_NAME,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    MONGO_URI: process.env.MONGO_URI

})