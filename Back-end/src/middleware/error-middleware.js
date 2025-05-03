import {ResponseError} from "../error/response-error.js";
import {v7 as uuid} from 'uuid';

const errorMiddleware = async (err, req, res, next) => {
    if (!err) {
        next();
        return;
    }

    if (err instanceof ResponseError) {
        res.status(err.status).json({
            request_id: uuid().toString(),
            errors: err.message,
        }).end();
    } else {
        res.status(500).json({
            errors: err.message,
        }).end();
    }
}

export {
    errorMiddleware
}