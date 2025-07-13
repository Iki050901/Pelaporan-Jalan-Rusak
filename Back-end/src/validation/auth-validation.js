import Joi from "joi";

const registerUserValidation = Joi.object({
    name: Joi.string().required().max(255),
    email: Joi.string().required().max(255),
    number_phone: Joi.string().required().max(14),
    password: Joi.string().required().max(255),
    confirm_password: Joi.string().required().max(255),
})

const updateUserValidation = Joi.object({
    id: Joi.string().max(100).required(),
    name: Joi.string().max(255).empty(''),
    email: Joi.string().max(255).empty(''),
    avatar: Joi.object().optional(),
    number_phone: Joi.string().max(14).empty(''),
    password: Joi.string().max(255).empty(''),
    confirm_password: Joi.string().max(255).empty(''),
})

const loginUserValidation = Joi.object({
    email: Joi.string().required().max(255),
    password: Joi.string().required().max(255),
})

const loginWithGoogleUserValidation = Joi.object({
    email: Joi.string().required().max(255),
    google_id: Joi.string().required().max(255),
    name: Joi.string().required().max(255),
    number_phone: Joi.string().optional().empty(''),
})

const getUserValidation = Joi.object({
    user_id: Joi.string().max(100).required(),
    token: Joi.string().required()
})

const getTokenIdValidation = Joi.string().required()

export {
    getTokenIdValidation,
    registerUserValidation,
    loginUserValidation,
    loginWithGoogleUserValidation,
    getUserValidation,
    updateUserValidation
}