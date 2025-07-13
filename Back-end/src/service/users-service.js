import {validate} from "../validation/validate.js";
import {createUserValidation, getUsersValidation, updateUsersValidation} from "../validation/users-validation.js";
import {prismaClient} from "../application/database.js";
import {ResponseError} from "../error/response-error.js";
import * as bcrypt from "bcrypt";
import Joi from "joi";

const create = async (request) => {
    const user = validate(createUserValidation, request);

    const userInDatabase = prismaClient.users.findFirst({
        where: {
            OR : [
                {number_phone: user.number_phone},
                {email: user.email}
            ],
            is_delete: false
        },
        select: {
            number_phone: true,
            email: true
        }
    })

    if (userInDatabase) {
        if (userInDatabase.number_phone === user.number_phone) {
            throw new ResponseError('No. Handphone telah terdaftar !')
        }
        if (userInDatabase.email === user.email) {
            throw new ResponseError('Email telah terdaftar !')
        }
    }

    user.password = await bcrypt.hash(user.password, 10);
    const userMatch = await bcrypt.compare(user.confirm_password, user.password)

    if (!userMatch) {
        throw new ResponseError(400, "Password dan Confirm Password tidak sama !")
    }

    return prismaClient.users.create({
        data: {
            name: user.name,
            email: user.email,
            number_phone: user.number_phone,
            password: user.password,
            district: user.district,
            role : {
                connect: {
                    id: user.role_id
                }
            }
        },
        select: {
            id: true,
            name: true,
            email: true,
            number_phone: true,
            role_id: true,
        }
    });
}

const update = async (request) => {
    const user = validate(updateUsersValidation, request);

    const userInDatabase = await prismaClient.users.findFirst({
        where: {
            id: user.id
        },
        select: {
            id: true,
            name: true,
            email: true,
            number_phone: true,
            role_id: true,
        }
    })

    if (!userInDatabase) {
        throw new ResponseError(404, 'Pengguna tidak ditemukan !')
    }

    if (userInDatabase) {
        if (userInDatabase.number_phone === user.number_phone && userInDatabase.id !== user.id) {
            throw new ResponseError('No. Handphone telah terdaftar !')
        }
        if (userInDatabase.email === user.email && userInDatabase.id !== user.id) {
            throw new ResponseError('Email telah terdaftar !')
        }
    }

    const data = {
        name: user.name,
        email: user.email,
        number_phone: user.number_phone,
        district: user.district,
    }

    if (user.password) {
        if (!user.confirm_password) {
            throw new ResponseError(400, 'Confirm Password harus di isi !')
        }

        const hashPass = await bcrypt.hash(user.password, 10);
        const isConfirmPasswordValid = await bcrypt.compare(user.confirm_password, hashPass)

        if (!isConfirmPasswordValid) {
            throw new ResponseError(400, 'Password dan Confirm Password tidak sama !')
        }

        data.password = hashPass;
    }

    return prismaClient.users.update({
        where: {
            id: user.id,
        },
        data: {
            ...data,
            role: {
                connect: {
                    id: user.role_id
                }
            }
        },
        select: {
            id: true,
            name: true,
            email: true,
            number_phone: true,
        }
    })
}

const remove = async (userId) => {
    userId = validate(getUsersValidation, userId);
    
    const userInDatabase = await prismaClient.users.findFirst({
        where: {
            id: userId
        },
        select: {
            is_delete: true,
        }
    })
    
    if (!userInDatabase) {
        throw new ResponseError(404, 'Pengguna tidak ditemukan !')
    }
    
    if (userInDatabase && userInDatabase.is_delete === true) {
        throw new ResponseError(400, 'Tidak dapat menghapus akun karena akun ini telah dihapus sebelumnya !')
    }

    prismaClient.reports.update({
        where: {
            user_id: userId
        },
        data: {
            is_delete: true,
        }
    })
    
    return  prismaClient.users.update({
        where: {
            id: userId
        },
        data: {
            is_delete: true
        }
    });
}

const list = async (limit, page, latest) => {

    page = page || 1;
    const pageSize = limit || 10;

    const users = await prismaClient.users.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where: {
            is_delete: false,
        },
        select: {
            id: true,
            name: true,
            email: true,
            number_phone: true,
            role: true,
            district: true
        }
    })

    const totalUsers = await prismaClient.users.count({
        where: {
            is_delete: false,
        }
    })

    const totalPages = Math.ceil(totalUsers / pageSize);

    return {
        users: users,
        total_pages: totalPages,
        current_page: page,
        page_size: pageSize,
        total_data: totalUsers,
    }
}

const get = async (userId) => {
    userId = validate(getUsersValidation, userId);

    const users = await prismaClient.users.findFirst({
        where: {
            id: userId,
        },
        select: {
            id: true,
            name: true,
            email: true,
            number_phone: true,
            role: true,
            district: true
        }
    })

    if (!users) {
        throw new ResponseError(404, 'Pengguna tidak ditemukan !')
    }

    return users;
}



export default {
    create,
    update,
    remove,
    list,
    get
}