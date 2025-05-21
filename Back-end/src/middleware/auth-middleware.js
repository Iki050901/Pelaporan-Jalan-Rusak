import {prismaClient} from "../application/database.js";
import {logger} from "../application/logging.js";
import {v7 as uuid} from 'uuid';

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
        const tokenData = await prismaClient.token.findFirst({
            where: {
                token: token,
                expired_at: { gt: new Date() }
            },
            select: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        number_phone: true,
                        role: true,
                        refresh_token: true,
                    }
                },
                token: true,
            }
        })
        if (!tokenData) {
            const requestId = uuid().toString()
            return res.status(401).json({
                request_id: requestId,
                errors: "Unauthorized: Invalid Token",
            })
        }
        req.user = tokenData.user;
        req.user.token = tokenData.token;
        next();
    } catch (e) {
        logger.error(e.message);
        const requestId = uuid().toString()
        return res.status(500).json({
            request_id: requestId,
            errors: "Internal Server Error",
        })
    }
}