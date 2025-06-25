import commentsService from "../service/comments-service.js";

const create = async (req, res, next) => {
    try {
        const request = req.body;
        const reportId = req.params.report_id;
        request.user_id = req.user.id;
        request.report_id = reportId;
        const result = await commentsService.create(request);
        res.status(200).json({
            data: result,
        })
    } catch (e) {
        next(e);
    }
}

const remove = async (req, res, next) => {
    try {
        const commentId = req.params.comment_id;
        await commentsService.remove(commentId);
        res.status(200).json({
            data: "OK",
        })
    } catch (e) {
        next(e);
    }
}

const list = async (req, res, next) => {
    try {
        const reportId = req.params.report_id;
        const limit = parseInt(req.query.limit);
        const page = parseInt(req.query.page);
        const latest = req.query.latest || true
        const result = await commentsService.list(limit, page, latest, reportId);
        res.status(200).json({
            data: result,
        })
    } catch (e) {
        next(e);
    }
}

export default {
    create,
    remove,
    list,
}