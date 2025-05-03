import {v7 as uuid} from "uuid";
import axios from "axios";
import {logger} from "../application/logging.js";

export const authMiddleware = async (req, res, next) => {
    const token = req.get('Authorization');

    if (!token) {
        const requestId = uuid().toString()
        return res.status(401).json({
            request_id: requestId,
            errors: 'Unauthorized: No token provided',
        })
    }

    try {
        const response = await axios.post(`${process.env.URL_REQ}/api/validate/auth`,{
            token
        })

        if (!response.data.data) {
            const requestId = uuid().toString()
            return res.status(400).json({
                request_id: requestId,
                errors: 'Unauthorized: Invalid Token',
            });
        }

        req.user = response.data.data.user;
        next();
    } catch (error) {
        logger.info(error)
        const requestId = uuid().toString()
        res.status(500).json({
            request_id: requestId,
            errors: 'Unauthorized: No token provided',
        })
    }
}