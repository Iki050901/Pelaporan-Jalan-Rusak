import Joi from "joi";

const createCommentValidation = Joi.object({
    report_id: Joi.string().required(),
    user_id: Joi.string().required(),
    comment: Joi.string().required(),
})

const getCommentValidation = Joi.string().max(255)

export {
    createCommentValidation,
    getCommentValidation
}