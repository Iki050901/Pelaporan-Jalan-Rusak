import Joi from "joi";

const createUserValidation = Joi.object({
    name: Joi.string().required().max(255),
    email: Joi.string().required().max(255),
    number_phone: Joi.string().required().max(14),
    password: Joi.string().required().max(255),
    confirm_password: Joi.string().required().max(255),
    role_id: Joi.number().required(),
    district: Joi.string(),
})

const updateUsersValidation = Joi.object({
    id: Joi.string().empty(''),
    name: Joi.string().max(255).empty(''),
    email: Joi.string().max(255).empty(''),
    number_phone: Joi.string().max(14).empty(''),
    password: Joi.string().max(255).empty(''),
    confirm_password: Joi.string().max(255).empty(''),
    role_id: Joi.number().empty(''),
    district: Joi.string(),
})

const getUsersValidation = Joi.string().required()

export {
    createUserValidation,
    updateUsersValidation,
    getUsersValidation
}