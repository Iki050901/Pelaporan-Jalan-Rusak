import Joi from "joi";

export const createCommentsValidation = Joi.object({
    comment: Joi.string().required()
        .messages({
            'any.required' : "Komentar harus di isi, tidak boleh kosong !",
            'string.empty': 'Komentar tidak boleh kosong',
        }),
})