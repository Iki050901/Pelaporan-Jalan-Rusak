import express from "express";
import authController from "../controller/auth-controller.js";
import {authMiddleware} from "../middleware/auth-middleware.js";
import {rolesMiddleware} from "../middleware/roles-middleware.js";
import {uploadReport} from "../utils/multerUtils.js";
import reportController from "../controller/report-controller.js";
import commentsController from "../controller/comments-controller.js";

const usersRouter = new express.Router();

// Auth API
usersRouter.get('/api/users/current', authMiddleware, rolesMiddleware(['USER', 'KECAMATAN', 'PUPR']),authController.get)
usersRouter.put('/api/users/current', uploadReport.fields([
    { name: 'avatar', maxCount: 1 },
]), authMiddleware, rolesMiddleware(['USER', 'KECAMATAN', 'PUPR']), authController.update)
usersRouter.delete('/api/users/logout', authMiddleware, rolesMiddleware(['USER', 'KECAMATAN', 'PUPR']), authController.logout)
usersRouter.put('/api/users/refresh', authMiddleware, rolesMiddleware(['USER', 'KECAMATAN', 'PUPR']), authController.refresh)

// Report API
usersRouter.post('/api/users/report/create',  uploadReport.fields([
    { name: 'images', maxCount: 5 },
    { name: 'video', maxCount: 1 },
]), authMiddleware, rolesMiddleware(['USER']), reportController.create)

usersRouter.put('/api/users/report/update/:report_id', uploadReport.fields([
    { name: 'images', maxCount: 5 },
    { name: 'video', maxCount: 1 },
]), authMiddleware, rolesMiddleware(['USER']), reportController.update)

usersRouter.delete('/api/users/report/remove/:report_id',  authMiddleware, rolesMiddleware(['USER']), reportController.remove)
usersRouter.get('/api/report/:report_id',  authMiddleware, rolesMiddleware(['USER', 'KECAMATAN', 'PUPR']), reportController.get)
usersRouter.get('/api/report', authMiddleware, rolesMiddleware(['USER', 'KECAMATAN', 'PUPR']), reportController.list)

// Comments API
usersRouter.post('/api/report/:report_id/comments/create',  authMiddleware, rolesMiddleware(['USER', 'KECAMATAN', 'PUPR']), commentsController.create)
usersRouter.delete('/api/report/comments/remove/:comment_id',  authMiddleware, rolesMiddleware(['USER', 'KECAMATAN', 'PUPR']), commentsController.remove)
usersRouter.get('/api/report/:report_id/comments',  authMiddleware, rolesMiddleware(['USER', 'KECAMATAN', 'PUPR']), commentsController.list)

export {
    usersRouter
}