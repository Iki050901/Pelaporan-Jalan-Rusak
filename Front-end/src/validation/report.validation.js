import Joi, {object} from 'joi';

const fileSchema = Joi.object({
    filename: Joi.string().required(),
    filepath: Joi.string().required(),
    mimetype: Joi.string().required(),
    size: Joi.number().max(5000000).required()
})

export const createReportValidation = Joi.object({
    title: Joi.string()
        .required()
        .max(100)
        .messages({
            'string.empty': 'Judul laporan tidak boleh kosong',
            'string.min': 'Judul laporan maksimal 100 karakter',
            'any.required': 'Judul laporan tidak boleh kosong',
        }),
    desc: Joi.string()
        .required()
        .max(5000)
        .messages({
            'string.empty': 'Deskripsi tidak boleh kosong',
            'string.max': 'Deskripsi maksimal 5000 karakter',
            'any.required': 'Deskripsi harus diisi'
        }),
    damage_level_id: Joi.number()
        .required()
        .valid("ringan", "sedang", "berat")
        .messages(
            {
                'any.only': 'Tingkat kerusakan tidak valid',
                'any.empty': 'Tingkat kerusakan tidak boleh kosong',
                'any.required': 'Pilih tingkat kerusakan',
            }
        ),
    lat: Joi.number()
        .required()
        .min(-90)
        .max(90)
        .messages({
            'number.base': 'Latitude harus berupa angka',
            'number.min': 'Latitude tidak valid',
            'number.max': 'Latitude tidak valid',
            'any.required': 'Latitude harus diisi'
        }),
    long: Joi.number()
        .required()
        .min(-180)
        .max(180)
        .messages({
            'number.base': 'Longitude harus berupa angka',
            'number.min': 'Longitude tidak valid',
            'number.max': 'Longitude tidak valid',
            'any.required': 'Longitude harus diisi'
        }),
    location: Joi.string()
        .required()
        .max(255)
        .messages({
            'string.empty': 'Lokasi tidak boleh kosong',
            'string.max': 'Lokasi maksimal 255 karakter',
            'any.required': 'Lokasi harus diisi'
        }),
    images: Joi.array()
        .required()
        .min(1)
        .max(5)
        .items(Joi.any())
        .messages({
            'array.max': 'Maksimal 5 foto yang dapat diunggah',
            'array.min': 'Minimal 1 foto yang harus diunggah',
            'any.required': 'Foto harus diunggah'
        }),
    video: Joi.any()
        .optional()
})

export const updateReportValidation = Joi.object({
    title: Joi.string()
        .empty('')
        .optional()
        .max(100)
        .messages({
            'string.empty': 'Judul laporan tidak boleh kosong',
            'string.min': 'Judul laporan maksimal 100 karakter',
        }),
    desc: Joi.string()
        .empty('')
        .optional()
        .messages({
            'string.empty': 'Deskripsi laporan tidak boleh kosong',
        }),
    damage_level_id: Joi.number()
        .empty('')
        .optional()
        .valid("ringan", "sedang", "berat")
        .messages(
            {
                'any.only': 'Tingkat kerusakan tidak valid',
                'any.empty': 'Tingkat kerusakan tidak boleh kosong',
                'any.required': 'Pilih tingkat kerusakan',
            }
        ),
    lat: Joi.number()
        .empty('')
        .optional()
        .min(-90)
        .max(90)
        .messages({
            'number.base': 'Latitude harus berupa angka',
            'number.min': 'Latitude tidak valid',
            'number.max': 'Latitude tidak valid',
        }),
    long: Joi.number()
        .empty('')
        .optional()
        .min(-180)
        .max(180)
        .messages({
            'number.base': 'Longitude harus berupa angka',
            'number.min': 'Longitude tidak valid',
            'number.max': 'Longitude tidak valid',
        }),
    location: Joi.string()
        .empty('')
        .optional()
        .max(255)
        .messages({
            'string.max': 'Lokasi maksimal 255 karakter',
        }),
    images: Joi.array()
        .empty('')
        .optional()
        .items(Joi.any())
        .max(5)
        .messages({
            'array.max': 'Maksimal 5 foto yang dapat diunggah'
        }),
    video: Joi.any()
        .optional()
})