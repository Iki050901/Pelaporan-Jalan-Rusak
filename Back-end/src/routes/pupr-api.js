import express from "express";
import {authMiddleware} from "../middleware/auth-middleware.js";
import reportController from "../controller/report-controller.js";
import {rolesMiddleware} from "../middleware/roles-middleware.js";
import usersController from "../controller/users-controller.js";

const puprRouter = new express.Router();

// Report API
puprRouter.put('/api/pupr/report/validate/:report_id/:validate_id',
    authMiddleware,
    rolesMiddleware(['PUPR']),
    reportController.validatePupr
);

// Users API
puprRouter.post('/api/pupr/users/create',
    authMiddleware,
    rolesMiddleware(['PUPR']),
    usersController.create)

puprRouter.put('/api/pupr/users/update/:user_id',
    authMiddleware,
    rolesMiddleware(['PUPR']),
    usersController.update)

puprRouter.delete('/api/pupr/users/remove/:user_id',
    authMiddleware,
    rolesMiddleware(['PUPR']),
    usersController.remove)

puprRouter.get('/api/pupr/users/:user_id',
    authMiddleware,
    rolesMiddleware(['PUPR']),
    usersController.get)

puprRouter.get('/api/pupr/users',
    authMiddleware,
    rolesMiddleware(['PUPR']),
    usersController.list)

puprRouter.get('/api/pupr/report/export',
    reportController.getReport)
export {
    puprRouter
}