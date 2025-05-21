import {validate} from "../validation/validate.js";
import {
    createReportValidation,
    getReportValidation,
    updateReportValidation,
    validateReportValidation
} from "../validation/report-validation.js";
import {prismaClient} from "../application/database.js";
import {ResponseError} from "../error/response-error.js";
import {DOMPurify} from "../utils/sanitizeUtils.js";
import path from "node:path";
import fs from "node:fs";
import {logger} from "../application/logging.js";

const create = async (request) => {
    const report = validate(createReportValidation, request);

    const damageLevelExist = await prismaClient.damageLevel.count({
        where: {
            id: report.damage_level_id
        }
    })

    if (damageLevelExist !== 1) {
        throw new ResponseError(400, 'Tingkat Kerusakan tidak ditemukan !')
    }

    const sanitizeReportDesc = DOMPurify.sanitize(report.desc);

    let videoPathURL = null;
    if (report.videos) {
        const uploadVideoPath = process.env.FILE_UPLOAD_REPORT_VIDEOS.replace(process.env.DELETE_PATH_UPLOAD, "");
        videoPathURL = `${process.env.HOST}/${uploadVideoPath}/${report.videos.filename}`;
    }

    const createReport = await prismaClient.reports.create({
        data: {
            title: report.title,
            desc: sanitizeReportDesc,
            lat: report.lat,
            long: report.long,
            video_url: videoPathURL,
            is_district_validate: false,
            is_pupr_validate: false,
            damage_level: {
                connect: {
                    id: report.damage_level_id
                }
            },
            validation_status: {
                connect: {
                    id: 1
                }
            },
            user: {
                connect: {
                    id: report.user_id
                }
            }
        },
        select: {
            id: true,
            title: true,
            desc: true,
            lat: true,
            long: true,
            damage_level_id: true,
            validation_stat_id: true,
            video_url: true,
            created_at: true,
            updated_at: true,
        }
    })

    if (report.images.length > 0) {
        const filePathUpload = process.env.FILE_UPLOAD_REPORT_IMAGES.replace(process.env.DELETE_PATH_UPLOAD, "");
        const imageData = report.images.map((image) => ({
            report_id: createReport.id,
            image_url: `${process.env.HOST}/${filePathUpload}/${image.filename}`,
        }));

        await prismaClient.reportImages.createMany({
            data: imageData,
        });
    }

    const imagesReport = await prismaClient.reportImages.findMany({
        where: {
            report_id: createReport.id
        }
    });

    return {
        ...createReport,
        report_images: imagesReport,
    }
}

const update = async (request) => {
    const report = validate(updateReportValidation, request);

    const reportInDatabase = await prismaClient.reports.findFirst({
        where: {
            id: report.id
        },
        select: {
            video_url: true,
            validation_stat_id: true,
            is_district_validate: true,
        }
    })

    if (!reportInDatabase) {
        throw new ResponseError(404, 'Laporan tidak ditemukan !')
    }

    if (reportInDatabase && [3, 4, 5, 6].includes(reportInDatabase.validation_stat_id)) {
        throw new ResponseError(400, 'Tidak bisa di update karena sudah divalidasi oleh Kecamatan !')
    }

    const oldVideosPath = reportInDatabase.video_url.replace(`${process.env.HOST}/`, "");
    const newUploadVideoPath = process.env.FILE_UPLOAD_REPORT_VIDEOS.replace(process.env.DELETE_PATH_UPLOAD, "")
    const newVideoPathURL = report.video_url ? `${process.env.HOST}/${newUploadVideoPath}/${report.video_url.filename}`: undefined;

    if (newVideoPathURL && oldVideosPath && newVideoPathURL !== oldVideosPath) {
        const fullPath =  path.join(process.env.DELETE_PATH_UPLOAD, oldVideosPath.replace(/\\/g, '/'))
        fs.unlink(fullPath, (err) => {
            if (err) {
                logger.error(`Failed to delete old image: ${err.message}`)
            } else {
                logger.info(`Deleted old image: ${oldVideosPath}`)
            }
        });
    }

    if (report.desc) {
        report.desc = DOMPurify.sanitize(report.desc);
    }

    const updateData = {
        title: report.title,
        desc: report.desc,
        lat: report.lat,
        long: report.long,
        video_url: newVideoPathURL,
    }

    const updateReport = await prismaClient.reports.update({
        where: {
            id: report.id,
        },
        data: {
            ...updateData,
            damage_level: {
                connect: {
                    id: report.damage_level_id
                }
            },
            updated_at: new Date().toISOString(),
        },
        select: {
            id: true,
            title: true,
            desc: true,
            lat: true,
            long: true,
            damage_level_id: true,
            video_url: true,
            created_at: true,
            updated_at: true,
        }
    })

    const existingImages = await prismaClient.reportImages.findMany({
        where: {
            report_id: report.id
        }
    })

    if (
        existingImages.length > 0 &&
        (!Array.isArray(report.image_to_keep) || report.image_to_keep.length === 0) &&
        (!Array.isArray(report.files) || report.files.length === 0)
    ) {
        throw new ResponseError(400, "Gambar tidak boleh kosong !");
    }

    const imagesToDelete = existingImages.filter(img => !report.image_to_keep.includes(img.id));

    for (const img of imagesToDelete) {
        const deletedImage = img.image_url.replace(`${process.env.HOST}}/`, "");
        const fullPath = path.join(process.env.DELETE_PATH_UPLOAD, deletedImage)
        fs.unlink(fullPath, (err) => {
            if (err) {
                logger.error(`Failed to delete old image: ${err.message}`)
            } else {
                logger.info(`Deleted old image: ${deletedImage}`)
            }
        })
        await prismaClient.reportImages.delete({where: {id: img.id}});
    }

    const newPathUpload = process.env.FILE_UPLOAD_REPORT_IMAGES.replace(process.env.DELETE_PATH_UPLOAD, "")
    if (report.images && report.images.length > 0) {
        const reportImages = report.images.map(image => ({
            report_id: report.id,
            image_url: `${process.env.HOST}/${newPathUpload}/${image.filename}`,
        }))

        await prismaClient.reportImages.createMany({
            data: reportImages
        })
    }

    const importedImages = await prismaClient.reportImages.findMany({
        where: {
            report_id: report.id,
        },
        select: {
            id: true,
            image_url: true,
            report_id: true,
        },
    });

    return {
        ...updateReport,
        report_images: importedImages,
    }

}

const remove = async (reportId) => {
    reportId = validate(getReportValidation, reportId)

    const reportInDatabase = await prismaClient.reports.findFirst({
        where: {
            id: reportId
        },
        select: {
            video_url: true,
            validation_stat_id: true,
        }
    })

    if (!reportInDatabase) {
        throw new ResponseError(404, 'Laporan tidak ditemukan !')
    }

    if (reportInDatabase && [3, 4, 5, 6].includes(reportInDatabase.validation_stat_id)) {
        throw new ResponseError(400, 'Tidak bisa di hapus karena sudah divalidasi !')
    }

    return prismaClient.reports.update({
        where: {
            id: reportId,
        },
        data: {
            is_delete: true,
        },
    })
}

const list = async (limit, page, status, level_damage, user_id, role_id) => {

    const userInDatabase = await prismaClient.users.findFirst({
        where: {
            id: user_id
        },
        select: {
            id: true,
        }
    })

    if (!userInDatabase) {
        throw new ResponseError(404, 'Pengguna tidak ditemukan !')
    }

    const roleInDatabase = await prismaClient.roles.findFirst({
        where: {
            id: role_id
        },
        select: {
            id: true,
        }
    })

    if (!roleInDatabase) {
        throw new ResponseError(404, 'Role tidak ditemukan !')
    }

    page = page || 1;
    const pageSize = limit || 10;

    const whereClause = {
        ...(status && ({validation_stat_id: status})),
        ...(level_damage && ({damage_level_id: level_damage})),
        ...(role_id === 3 && ({user_id: user_id})),
        is_delete: false
    };

    const reports = await prismaClient.reports.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where: whereClause,
        select: {
            id: true,
            title: true,
            desc: true,
            lat: true,
            long: true,
            damage_level: true,
            validation_status: true,
            video_url: true,
        }
    })

    const totalReports = await prismaClient.reports.count({
        where: whereClause
    })

    const totalPages = Math.ceil(totalReports / pageSize);

    const reportImages = await prismaClient.reportImages.findMany({
        where: {
            report_id: {
                in: reports.map(report => report.id)
            },
        },
        select: {
            id: true,
            image_url: true,
            report_id: true,
        },
    })

    const reportsWithImages = reports.map(report => {
        const images = reportImages.filter(img => img.report_id === report.id);
        return {
            ...report,
            report_images: images
        };
    });

    return {
        reports: reportsWithImages,
        total_pages: totalPages,
        current_page: page,
        page_size: pageSize,
        total_data: totalReports
    }
}

const get = async (reportId) => {
    reportId = validate(getReportValidation, reportId);

    const reportInDatabase = await prismaClient.reports.findFirst({
        where: {
            id: reportId
        },
    })

    if (!reportInDatabase) {
        throw new ResponseError(404, 'Laporan tidak ditemukan !')
    }

    return prismaClient.reports.findFirst({
        where: {
            id: reportId
        },
        select: {
            id: true,
            title: true,
            desc: true,
            lat: true,
            long: true,
            damage_level: true,
            validation_status: true,
            is_pupr_validate: true,
            is_district_validate: true,
            video_url: true,
            created_at: true,
            updated_at: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    number_phone: true,
                }
            },
            ReportImages: true,
        }
    })
}

const validateDistrict = async (report) => {
    const validateData = validate(validateReportValidation, report);

    const reportInDatabase = await prismaClient.reports.findFirst({
        where: {
            id: validateData.report_id
        },
        select: {
            validation_stat_id: true,
            is_pupr_validate: true,
        }
    })

    const validateInDatabase = await prismaClient.validationStatus.findFirst({
        where: {
            id: validateData.validation_stat_id
        },
    })

    if (!validateInDatabase) {
        throw new ResponseError(400, 'Validasi Status tidak ditemukan !')
    }

    if (!reportInDatabase) {
        throw new ResponseError(404, 'Laporan tidak ditemukan !')
    }

    if (reportInDatabase && reportInDatabase.is_pupr_validate) {
        throw new ResponseError(400, 'Tidak bisa di validasi karena sudah divalidasi oleh PUPR !')
    }

    return prismaClient.reports.update({
        where: {
            id: validateData.report_id,
        },
        data: {
            ...(validateData.validation_stat_id === 3 && ({ is_district_validate: true })),
            validation_status: {
                connect: {
                    id: validateData.validation_stat_id
                }
            },
            notes: validateData.note
        },
        select: {
            validation_status: true,
            is_pupr_validate: true,
            is_district_validate: true,
            notes: true,
        }
    })
}

const validatePupr = async (report) => {
    const validateData = validate(validateReportValidation, report);

    const reportInDatabase = await prismaClient.reports.findFirst({
        where: {
            id: validateData.report_id
        },
        select: {
            validation_stat_id: true,
            is_district_validate: true,
        }
    })

    const validateInDatabase = await prismaClient.validationStatus.findFirst({
        where: {
            id: validateData.validation_stat_id
        },
    })

    if (!validateInDatabase) {
        throw new ResponseError(400, 'Validasi Status tidak ditemukan !')
    }

    if (!reportInDatabase) {
        throw new ResponseError(404, 'Laporan tidak ditemukan !')
    }

    if (reportInDatabase && reportInDatabase.is_district_validate === false) {
        throw new ResponseError(400, 'Tidak bisa di validasi karena belum divalidasi oleh Kecamatan !')
    }

    return prismaClient.reports.update({
        where: {
            id: validateData.report_id,
        },
        data: {
            ...(validateData.validation_stat_id === 4 || validateData.validation_stat_id === 5 && ({is_pupr_validate: true})),
            validation_status: {
                connect: {
                    id: validateData.validation_stat_id
                }
            },
            notes: validateData.note
        },
        select: {
            is_pupr_validate: true,
            is_district_validate: true,
            validation_status: true,
            notes: true,
        }
    });
}



export default {
    create,
    update,
    remove,
    list,
    get,
    validateDistrict,
    validatePupr
}