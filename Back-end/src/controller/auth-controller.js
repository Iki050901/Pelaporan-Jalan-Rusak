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

const loginGoogle = async (req, res, next) => {
    try {
        const user = await authService.loginGoogle(req.user);
        res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${user.token.token}`);
    } catch (e) {
        next(e);
    }
}

const update = async (req, res, next) => {
    try {
        const id = req.user.id;
        const { profile_data } = req.body;
        const request = JSON.parse(profile_data);
        request.id = id;
        const avatar = req.files['avatar'] ? req.files['avatar'][0] : undefined;
        request.avatar = avatar ? {
            filename: avatar.filename,
            path: avatar.path,
            mimetype: avatar.mimetype,
            size: avatar.size
        } : undefined;
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
    loginGoogle,
    refresh,
    logout,
    get
}