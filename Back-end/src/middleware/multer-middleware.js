import * as path from "node:path";
import * as fs from "node:fs";
import {logger} from "../application/logging.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const errorMulterMiddleware = async (err, req, res, next) => {
    if (!err) {
        next();
        return;
    }

    const filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(filename);

    if (req.file && req.file.path) {
        const filePath = path.join(__dirname, '../../', req.file.path.replace(/\\/g, '/'));
        fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) {
                logger.info(`Failed to delete image file: ${unlinkErr.message}`);
            } else {
                logger.info(`Image file deleted due to error: ${filePath}`);
            }
        });
    }

    next(err);
}

export {
    errorMulterMiddleware
}