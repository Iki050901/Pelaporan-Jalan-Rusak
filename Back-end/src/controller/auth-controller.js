import authService from "../service/auth-service.js";

const register = async (req, res, next) => {
    try {
        const result = await authService.register(req.body);
        res.status(200).json({
            data: result,
        })
    } catch (e) {
        next(e);
    }
}

const login = async (req, res, next) => {
    try {
        const result = await authService.login(req.body);
        res.status(200).json({
            data: result,
        })
    } catch (e) {
        next(e);
    }
}

const update = async (req, res, next) => {
    try {
        const id = req.user.id;
        const request = req.body;
        request.id = id;
        const result = await authService.update(request);
        res.status(200).json({
            data: result,
        })
    } catch (e) {
        next(e);
    }
}

const refresh = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const token = req.user.token;
        const result = await authService.refresh({user_id: userId, token});
        res.status(200).json({
            data: result,
        })
    } catch (e) {
        next(e);
    }
}

const logout = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const token = req.user.token;
        await authService.logout({user_id: userId, token});
        res.status(200).json({
            data: "Logout Success",
        })
    } catch (e) {
        next(e);
    }
}

const get = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const token = req.user.token;
        const result = await authService.get({user_id: userId, token});
        res.status(200).json({
            data: result,
        })
    } catch (e) {
        next(e);
    }
}

export default {
    register,
    update,
    login,
    refresh,
    logout,
    get
}