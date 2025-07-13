import Joi from "joi";

const fileSchema = Joi.object({
    filename: Joi.string().required(),
    filepath: Joi.string().required(),
    mimetype: Joi.string().required(),
    size: Joi.number().max(5000000).required()
})

const imageKeepSchema = Joi.number()

const createReportValidation = Joi.object({
    user_id: Joi.string().required(),
    title: Joi.string().required().max(255),
    desc: Joi.string().required(),
    location: Joi.string().required(),
    lat: Joi.string().required().custom((value, helpers) => {
        const parsed = parseFloat(value);
        if (isNaN(parsed) || parsed < -90 || parsed > 90) {
            return helpers.error('any.invalid');
        }
        return parsed;
    }, 'Latitude validation'),
    long: Joi.string().required().custom((value, helpers) => {
        const parsed = parseFloat(value);
        if (isNaN(parsed) || parsed < -180 || parsed > 180) {
            return helpers.error('any.invalid');
        }
        return parsed;
    }, 'Longitude validation'),
    damage_level_id: Joi.number().required(),
    images: Joi.array().items(fileSchema).required().max(5).required(),
    video: Joi.object().optional(),
    district: Joi.string()
})

const updateReportValidation = Joi.object({
    id: Joi.string().required(),
    title: Joi.string().max(255),
    desc: Joi.string(),
    location: Joi.string().required(),
    lat: Joi.string().required().custom((value, helpers) => {
        const parsed = parseFloat(value);
        if (isNaN(parsed) || parsed < -90 || parsed > 90) {
            return helpers.error('any.invalid');
        }
        return parsed;
    }, 'Latitude validation'),
    long: Joi.string().required().custom((value, helpers) => {
        const parsed = parseFloat(value);
        if (isNaN(parsed) || parsed < -180 || parsed > 180) {
            return helpers.error('any.invalid');
        }
        return parsed;
    }, 'Longitude validation'),
    damage_level_id: Joi.number(),
    image_to_keep: Joi.array().items(imageKeepSchema),
    images: Joi.array().items(fileSchema).max(5),
    video: Joi.object().optional(),
    district: Joi.string()
})

const getReportValidation = Joi.string().max(255)

const validateReportValidation = Joi.object({
    report_id: Joi.string().max(255).required(),
    validation_stat_id: Joi.number().required(),
    note : Joi.string().max(255).empty(''),
})

export {
    createReportValidation,
    updateReportValidation,
    getReportValidation,
    validateReportValidation
}