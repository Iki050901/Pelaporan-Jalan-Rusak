import {validate} from "../validation/validate.js";
import {createCommentValidation, getCommentValidation} from "../validation/comment-validation.js";
import {prismaClient} from "../application/database.js";
import {ResponseError} from "../error/response-error.js";

const create = async (request) => {
    const comment = validate(createCommentValidation, request)

    const reportInDatabase = await prismaClient.reports.findFirst({
        where: {
            id: comment.report_id,
        }
    })

    if (!reportInDatabase) {
        throw new ResponseError(404, 'Laporan tidak ditemukan !')
    }

    return prismaClient.comments.create({
        data: {
            report: {
                connect: {
                    id: comment.report_id
                }
            },
            user: {
                connect: {
                    id: comment.user_id
                }
            },
            comment: comment.comment,
        },
        select: {
            id: true,
            report: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    number_phone: true,
                }
            },
            comment: true,
            created_at: true,
        }
    })

}

const remove = async (commentId) => {
    commentId = validate(getCommentValidation, commentId)

    const commentInDatabase = await prismaClient.comments.findFirst({
        where: {
            id: commentId,
        }
    })

    if (!commentInDatabase) {
        throw new ResponseError(404, 'Komentar tidak ditemukan !')
    }

    await prismaClient.comments.delete({
        where: {
            id: commentId,
        }
    })
}

const list = async (limit, page, latest, report_id) => {

    const reportInDatabase = await prismaClient.reports.findFirst({
        where: {
            id: report_id,
        }
    })

    if (!reportInDatabase) {
        throw new ResponseError(404, 'Laporan tidak ditemukan !')
    }

    page = page || 1;
    const pageSize = limit || 10;

    const comments = await prismaClient.comments.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where: {
            report_id: report_id,
            ...(latest && ({created_at: {lt: new Date().toISOString() }})),
        },
        orderBy: {
            created_at: 'desc'
        },
        select: {
            id: true,
            report: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    number_phone: true,
                }
            },
            comment: true,
            created_at: true,
        }
    })

    const totalComments = await prismaClient.comments.count({
        where: {
            report_id: report_id,
            ...(latest && ({created_at: {lt: new Date().toISOString() }})),
        }
    })

    const totalPages = Math.ceil(totalComments / pageSize);

    return {
        comments: comments,
        total_pages: totalPages,
        current_page: page,
        page_size: pageSize,
        total_data: totalComments,
    }
}


export default {
    create,
    remove,
    list,
}