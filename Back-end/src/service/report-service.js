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
import axios from "axios";
import moment from "moment-timezone";
import PDFDocument from "pdfkit-table";

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
    if (report.video) {
        const uploadVideoPath = process.env.FILE_UPLOAD_REPORT_VIDEOS.replace(process.env.DELETE_PATH_UPLOAD, "");
        videoPathURL = `${process.env.DOMAIN}/${uploadVideoPath}/${report.video.filename}`;
    }

    const createReport = await prismaClient.reports.create({
        data: {
            title: report.title,
            desc: sanitizeReportDesc,
            location: report.location,
            lat: report.lat,
            long: report.long,
            video_url: videoPathURL,
            is_district_validate: false,
            is_pupr_validate: false,
            district: report.district,
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
            location: true,
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
            image_url: `${process.env.DOMAIN}/${filePathUpload}/${image.filename}`,
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

    const oldVideosPath = reportInDatabase.video_url.replace(`${process.env.DOMAIN}/`, "");
    const newUploadVideoPath = process.env.FILE_UPLOAD_REPORT_VIDEOS.replace(process.env.DELETE_PATH_UPLOAD, "")
    const newVideoPathURL = report?.video?.filename
        ? `${process.env.DOMAIN}/${newUploadVideoPath}/${report.video.filename}`
        : undefined;

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
        location: report.location,
        lat: report.lat,
        long: report.long,
        district: report.district,
        video_url: newVideoPathURL,
        is_district_validate: false,
        is_pupr_validate: false,
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
            validation_status: {
                connect: {
                    id: 1
                }
            },
            updated_at: new Date().toISOString(),
        },
        select: {
            id: true,
            title: true,
            desc: true,
            location: true,
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
        (!Array.isArray(report.images) || report.images.length === 0)
    ) {
        throw new ResponseError(400, "Gambar tidak boleh kosong !");
    }

    const imagesToDelete = existingImages.filter(img => !report.image_to_keep.includes(img.id));

    for (const img of imagesToDelete) {
        const deletedImage = img.image_url.replace(`${process.env.DOMAIN}}/`, "");
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
            image_url: `${process.env.DOMAIN}/${newPathUpload}/${image.filename}`,
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

const list = async (limit, page, status, level_damage, user_id, role_id, isTable, district, sort) => {

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

    let arrayStatus;
    if (status) {
        arrayStatus = status.split(',').map(Number);
    }

    const whereClause = {
        ...(Array.isArray(arrayStatus) && arrayStatus.length > 0
                ? { validation_stat_id: { in: arrayStatus } }
                : arrayStatus
                    ? { validation_stat_id: arrayStatus }
                    : {  }
        ),
        ...(level_damage && ({ damage_level_id: level_damage })),
        ...(role_id === 3 && user_id && {
            user_id: user_id
        }),
        ...(district && ({ district: district})),
        is_delete: false
    };

    const anotherWhereClause = {
        ...(Array.isArray(arrayStatus) && arrayStatus.length > 0
                ? { validation_stat_id: { in: arrayStatus } }
                : arrayStatus
                    ? { validation_stat_id: arrayStatus }
                    : {  }
        ),
        ...(level_damage && { damage_level_id: level_damage }),
        ...(district && ({ district: district })),
        is_delete: false,
    };

    const isTableBool = isTable === true || isTable === "true";
    const check = isTableBool ? whereClause : anotherWhereClause;
    const sortOrder = sort === 'oldest' ? 'asc' : 'desc';

    const reports = await prismaClient.reports.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where: check,
        orderBy: {
            created_at: sortOrder,
        },
        select: {
            id: true,
            title: true,
            desc: true,
            lat: true,
            long: true,
            location: true,
            district: true,
            damage_level: true,
            validation_status: true,
            is_district_validate: true,
            is_pupr_validate: true,
            video_url: true,
            user: true,
            created_at: true
        }
    })

    const totalReports = await prismaClient.reports.count({
        where: isTable ? whereClause : anotherWhereClause,
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
            created_at : moment(report.created_at).tz("Asia/Jakarta").locale('id').format('DD MMMM YYYY'),
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

    const getReport = await prismaClient.reports.findFirst({
        where: {
            id: reportId
        },
        select: {
            id: true,
            title: true,
            desc: true,
            location: true,
            lat: true,
            long: true,
            notes: true,
            district: true,
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

    getReport.created_at = moment(getReport.created_at).tz("Asia/Jakarta").locale('id').format('DD MMMM YYYY')
    return getReport
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
            is_district_validate: true,
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

const reportDashboard = async () => {
    const baseFilter = { is_delete: false };

    const getReportCountByFilter = async (filter) => {
        return prismaClient.reports.count({
            where: {...baseFilter, ...filter}
        });
    };


    const getDamageReportCounts = async (damageIds) => {
        return Promise.all(
            damageIds.map(id => getReportCountByFilter({ damage_level_id: id }))
        );
    };

    const [
        totalReport,
        totalActiveReport,
        ...damageReports
    ] = await Promise.all([
        getReportCountByFilter(),
        getReportCountByFilter({validation_stat_id: {in : [3, 2]} }),
        getReportCountByFilter({validation_stat_id: {in : [5, 6]} }),
        getReportCountByFilter({validation_stat_id: 7}),
    ]);

    return {
        total_report: totalReport,
        total_active_report: totalActiveReport,
        total_report_process: damageReports[0],
        total_report_done: damageReports[1],
    };
};


const reportDashboardByDamageLevel = async () => {
    const reportByDamageLevel1 = await prismaClient.reports.findMany({
        where: {
            is_delete: false,
            damage_level_id: 1
        },
        select: {
            damage_level: true,
            lat: true,
            long: true,
            location: true,
        }
    })

    const reportByDamageLevel2 = await prismaClient.reports.findMany({
        where: {
            is_delete: false,
            damage_level_id: 2
        },
        select: {
            damage_level: true,
            lat: true,
            long: true,
            location: true,
        }
    })

    const reportByDamageLevel3 = await prismaClient.reports.findMany({
        where: {
            is_delete: false,
            damage_level_id: 3
        },
        select: {
            damage_level: true,
            lat: true,
            long: true,
            location: true,
        }
    })

    return {
        report_by_damage_level_1: reportByDamageLevel1,
        report_by_damage_level_2: reportByDamageLevel2,
        report_by_damage_level_3: reportByDamageLevel3,
    }
}

const getLocation = async (lat, long) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}`;

    const response = await axios.get(url);

    return response.data;
}

const getLocationDistrict = async () => {
    const url = 'https://alamat.thecloudalert.com/api/kecamatan/get/?d_kabkota_id=77';

    const response = await axios.get(url);

    return response.data;
}

const getReport = async (month, year, res) => {
    let startDate, endDate;

    if (year && month) {
        startDate = new Date(year, month - 1, 1);
        endDate = new Date(year, month, 0, 23, 59, 59);
    } else if (year) {
        startDate = new Date(year, 0, 1);
        endDate = new Date(year, 11, 31, 23, 59, 59);
    }

    const reports = await prismaClient.reports.findMany({
        where: {
            is_delete: false,
            ...(startDate &&
                endDate && {
                    created_at: {
                        gte: startDate,
                        lte: endDate,
                    },
                }),
        },
        include: {
            user: true,
            ReportImages: true,
            validation_status: true,
            damage_level: true,
        },
    });

    // Buat dokumen PDF
    const doc = new PDFDocument({ size: "A4", margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
        "Content-Disposition",
        `attachment; filename=laporan-${month || "all"}-${year}.pdf`
    );
    doc.pipe(res);

    // Judul
    doc.fontSize(16).text("Rekapitulasi Laporan Kerusakan Jalan", { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Provinsi: Jawa Barat`);
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Kabupaten: Garut`);
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Dinas: Dinas Pekerjaan Umum dan Penataan Ruang (PUPR)`);
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Periode: ${month ? `${month}-${year}` : `Tahun ${year}`}`);
    doc.moveDown(1);

    // Tabel
    const table = {
        headers: ["No", "Tanggal", "Tingkat Kerusakan", "Kecamatan", "Lokasi", "Link Lokasi"],
        rows: reports.map((report, index) => [
            index + 1,
            moment(report.created_at).format("DD/MM/YYYY"),
            report.damage_level?.level || "-",
            report.district || "-",
            report.location || "-",
            `https://www.google.com/maps/search/?api=1&query=${report.lat},${report.long}`
        ]),
    };

    await doc.table(table, {
        prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10),
        prepareRow: (row, i) => doc.font("Helvetica").fontSize(9),
        columnSpacing: 5,
        padding: 5,
        columnsSize: [30, 70, 100, 150, 80, 80]
    });

    const pageWidth = doc.page.width;
    const margin = 50;
    const contentWidth = pageWidth - margin * 2;
    const rightX = margin + contentWidth * 0.75; // Adjust if needed

    doc.moveDown();
    doc.text(`Garut, ${moment(Date.now()).tz("Asia/Jakarta").locale('id').format('DD MMMM, YYYY')}`, rightX, doc.y, {
        align: 'center'
    });

    doc.moveDown();
    doc.text(`Mengetahui`, rightX, doc.y, {
        align: 'center'
    });

    doc.moveDown();
    doc.font("Helvetica-Bold")
        .text(`Kepala Bidang Bina Marga`, rightX, doc.y, {
            align: 'center'
        });

    doc.moveDown(4);
    doc.font("Helvetica-Bold")
        .text(`Dadan Yuda Prayoga, ST`, rightX, doc.y, {
            align: 'center'
        });

    doc.moveDown();
    doc.font("Helvetica")
        .text(`NIP. 19790506 201001 1 017`, rightX, doc.y, {
            align: 'center'
        });

    doc.end();
}

export default {
    create,
    update,
    remove,
    list,
    get,
    validateDistrict,
    validatePupr,
    reportDashboard,
    reportDashboardByDamageLevel,
    getLocation,
    getLocationDistrict,
    getReport
}