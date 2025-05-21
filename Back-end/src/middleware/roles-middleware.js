import {v7 as uuid} from 'uuid';

export const rolesMiddleware = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role.role)) {
            const requestId = uuid().toString();
            return res.status(403).json({
                request_id: requestId,
                errors: 'Forbidden: Insufficient role permissions',
            });
        }
        next();
    };
};