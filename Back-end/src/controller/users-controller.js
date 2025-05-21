import usersService from "../service/users-service.js";

const create = async (req, res, next) => {
    try {
        const result = await usersService.create(req.body)
        res.status(200).send({
            data: result,
        })
    } catch (e) {
        next(e);
    }
}

const update = async (req, res, next) => {
    try {
        const userId = req.params.user_id;
        const request = req.body;
        request.id = userId;
        const result = await usersService.update(request)
        res.status(200).send({
            data: result,
        })
    } catch (e) {
        next(e);
    }
}

const remove = async (req, res, next) => {
    try {
        const userId = req.params.user_id;
        await usersService.remove(userId)
        res.status(200).send({
            data: "OK"
        })
    } catch (e) {
        next(e);
    }
}

const list = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit);
        const page = parseInt(req.query.page);
        const latest = req.query.latest || true
        const result = await usersService.list(limit, page, latest);
        res.status(200).send({
            data: result,
        })
    } catch (e) {
        next(e);
    }
}

const get = async (req, res, next) => {
    try {
        const userId = req.params.user_id;
        const result = await usersService.get(userId);
        res.status(200).send({
            data: result,
        })
    } catch (e) {
        next(e);
    }
}

export default {
    create,
    update,
    remove,
    list,
    get
}