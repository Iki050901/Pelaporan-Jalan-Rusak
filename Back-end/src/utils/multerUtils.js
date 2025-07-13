import multer from "multer";
import path from "path";
import fs from "fs";
import { ResponseError } from "../error/response-error.js";

const imageFolder = process.env.FILE_UPLOAD_REPORT_IMAGES;
const videoFolder = process.env.FILE_UPLOAD_REPORT_VIDEOS;
const profileFolder = process.env.FILE_UPLOAD_PROFILE;

fs.mkdirSync(imageFolder, { recursive: true });
fs.mkdirSync(videoFolder, { recursive: true });
fs.mkdirSync(profileFolder, { recursive: true });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'video') {
            cb(null, videoFolder);
        } else if (file.fieldname === 'images') {
            cb(null, imageFolder);
        } else if (file.fieldname === 'profile') {
            cb(null, profileFolder);
        } else {
            cb(new ResponseError(400, 'Unknown file field!'), null);
        }
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'images') {
        const imageTypes = /jpeg|jpg|png|webp/;
        const isValid = imageTypes.test(file.mimetype) && imageTypes.test(path.extname(file.originalname).toLowerCase());
        return isValid ? cb(null, true) : cb(new ResponseError(400, 'Only image files are allowed!'));
    }

    if (file.fieldname === 'video') {
        const videoTypes = /mp4|mkv/;
        const isValid = videoTypes.test(file.mimetype) && videoTypes.test(path.extname(file.originalname).toLowerCase());
        return isValid ? cb(null, true) : cb(new ResponseError(400, 'Only video files are allowed!'));
    }

    cb(new ResponseError(400, 'Invalid file field!'));
};

export const uploadReport = multer({
    storage,
    limits: { fileSize: 20 * 1024 * 1024 }, // max 20MB
    fileFilter,
});