import reportService from "../service/report-service.js";
import {logger} from "../application/logging.js";

const create = async (req, res, next) => {
    try {
        const { report_data } = req.body;
        const request = JSON.parse(report_data);
        request.user_id = req.user.id;
        const images = req.files['images'] || [];
        request.images = images.length > 0 ? images.map((file) => ({
            filename: file.filename,
            filepath: file.path,
            mimetype: file.mimetype,
            size: file.size
        })) : [];
        const video = req.files['video'] ? req.files['video'][0] : undefined;
        request.video = video ? {
            filename: video.filename,
            path: video.path,
            mimetype: video.mimetype,
            size: video.size
        } : undefined;
        const result = await reportService.create(request);
        res.status(200).json({
            data: result,
        })
    } catch (e) {
        next(e);
    }
}

const update = async (req, res, next) => {
    try {
        const reportId = req.params.report_id;
        const { report_data } = req.body;
        const request = JSON.parse(report_data)
        const images = req.files['images'] || [];
        request.images = images.length > 0 ? images.map((file) => ({
            filename: file.filename,
            filepath: file.path,
            mimetype: file.mimetype,
            size: file.size
        })) : [];
        const video = req.files['video'] ? req.files['video'][0] : undefined;
        request.video = video ? {
            filename: video.filename,
            path: video.path,
            mimetype: video.mimetype,
            size: video.size
        } : undefined;
        request.id = reportId;
        const result = await reportService.update(request);
        res.status(200).json({
            data: result,
        })
    } catch (e) {
        next(e);
    }
}

const remove = async (req, res, next) => {
    try {
        const reportId = req.params.report_id;
        await reportService.remove(reportId);
        res.status(200).json({
            data: "OK",
        })
    } catch (e) {
        next(e);
    }
}

const list = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const roleId = req.user.role.id;
        const isTable = req.query.isTable
        const district = req.query.district
        const sort = req.query.sort
        const limit = parseInt(req.query.limit);
        const page = parseInt(req.query.page);
        const status = req.query.status;
        const level_damage = parseInt(req.query.level_damage);
        const result = await reportService.list(limit, page, status, level_damage, userId, roleId, isTable, district, sort);
        res.status(200).json({
            data: result,
        })
    } catch (e) {
        next(e);
    }
}

const get = async (req, res, next) => {
    try {
        const reportId = req.params.report_id
        const result = await reportService.get(reportId);
        res.status(200).json({
            data: result,
        })
    } catch (e) {
        next(e);
    }
}

const validateDistrict = async (req, res, next) => {
    try {
        const request = {
            ...req.body,
            report_id: req.params.report_id,
            validation_stat_id: parseInt(req.params.validate_id, 10)
        }
        const result = await reportService.validateDistrict(request);
        res.status(200).json({
            data: result,
        })
    } catch (e) {
        next(e);
    }
}

const validatePupr = async (req, res, next) => {
    try {
        const request = {
            ...req.body,
            report_id: req.params.report_id,
            validation_stat_id: parseInt(req.params.validate_id, 10)
        }
        const result = await reportService.validatePupr(request);
        res.status(200).json({
            data: result,
        })
    } catch (e) {
        next(e);
    }
}

const reportDashboard = async (req, res, next) => {
    try {
        const result = await reportService.reportDashboard();
        res.status(200).json({
            data: result,
        })
    } catch (e) {
        next(e);
    }
}

const reportDashboardByDamageLevel = async (req, res, next) => {
    try {
        const result = await reportService.reportDashboardByDamageLevel();
        res.status(200).json({
            data: result,
        })
    } catch (e) {
        next(e);
    }
}

const getLocation = async (req, res, next) => {
    try {
        const result = await reportService.getLocation(req.query.lat, req.query.long);
        res.status(200).json({
            data: result,
        })
    } catch (e) {
        next(e);
    }
}

const getLocationDistrict = async (req, res, next) => {
    try {
        const result = await reportService.getLocationDistrict();
        res.status(200).json({
            data: result,
        })
    } catch (e) {
        next(e);
    }
}

const getReport = async (req, res, next) => {
    try {
        const year = parseInt(req.query.year);
        const month = parseInt(req.query.month);
        await reportService.getReport(month, year, res);
    } catch (e) {
        next(e);
    }
}

export default {
    create,
    update,
    remove,
    list,
    get,
    validateDistrict,
    validatePupr,
    reportDashboard,
    reportDashboardByDamageLevel,
    getLocation,
    getLocationDistrict,
    getReport
}