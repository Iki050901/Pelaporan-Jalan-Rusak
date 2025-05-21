import express from "express";
import {authMiddleware} from "../middleware/auth-middleware.js";
import reportController from "../controller/report-controller.js";
import {rolesMiddleware} from "../middleware/roles-middleware.js";


const districtRouter = new express.Router();

// Report API
districtRouter.put('/api/district/report/validate/:report_id/:validate_id',
    authMiddleware,
    rolesMiddleware(['KECAMATAN']),
    reportController.validateDistrict
);

export {
    districtRouter
}