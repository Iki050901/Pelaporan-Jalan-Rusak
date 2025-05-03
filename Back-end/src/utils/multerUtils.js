import {convertDateTimeLocale} from "./dateTimeUtils.js";
import * as path from "node:path";
import multer from "multer";
import fs from "node:fs";
import {ResponseError} from "../error/response-error.js";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folderPath = process.env.FILE_UPLOAD_PRODUCT

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        cb(null, folderPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() / 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
})

export const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: function (req, file, cb) {
        const fileTypes = /jpeg|jpg|png|webp/;
        const mimeType = fileTypes.test(file.mimetype);
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

        if (mimeType && extname) {
            return cb(null, true);
        }
        cb(new ResponseError(400, 'Only image files are allowed!'));
    }
})