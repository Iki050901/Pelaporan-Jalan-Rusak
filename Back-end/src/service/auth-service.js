import {
    getUserValidation,
    loginUserValidation, loginWithGoogleUserValidation,
    registerUserValidation,
    updateUserValidation
} from "../validation/auth-validation.js";
import {validate} from "../validation/validate.js";
import {prismaClient} from "../application/database.js";
import {ResponseError} from "../error/response-error.js";
import * as bcrypt from "bcrypt";
import moment from "moment-timezone";
import {generateRefreshToken, generateToken} from "../utils/generateToken.js";
import path from "node:path";
import fs from "node:fs";
import {logger} from "../application/logging.js";


const register = async (request) => {
    const user = validate(registerUserValidation, request);

    const existingUser = await prismaClient.users.findFirst({
        where: {
            OR : [
                {number_phone: user.number_phone},
                {email: user.email}
            ],
            is_delete: false,
        },
        select: {
            number_phone: true,
            email: true
        }
    })

    if (existingUser) {
        if (existingUser.number_phone === user.number_phone) {
            throw new ResponseError(400, 'No. Handphone telah terdaftar !')
        }
        if (existingUser.email === user.email) {
            throw new ResponseError(400, 'Email telah terdaftar !')
        }
    }

    user.password = await bcrypt.hash(user.password, 10);
    const userMatch = await bcrypt.compare(user.confirm_password, user.password)

    if (!userMatch) {
        throw new ResponseError(400, "Password dan Confirm Password tidak sama !")
    }

    const {confirm_password, ...newUser} = user;

    const tokenRefreshExpired = moment(Date.now())
        .add(40, 'minutes')
        .toDate();

    const tokenExpired = moment(Date.now())
        .add(40, 'minutes')
        .toDate();

    const token = await generateToken({
        email: newUser.email,
    })

    const refreshToken = await generateRefreshToken({
        email: newUser.email,
    })

    const userCreate = await prismaClient.users.create({
        data: {
            ...newUser,
            refresh_token: {
                create: {
                    refresh_token: refreshToken,
                    expired_at: tokenRefreshExpired
                }
            },
            role : {
                connect: {
                    id: 3
                }
            }
        },
        select: {
            id: true,
            name: true,
            email: true,
            number_phone: true,
            role_id: true,
            refresh_token: true,
        }
    })

    userCreate.token = await prismaClient.token.create({
        data: {
            token: token,
            expired_at: tokenExpired,
            email: user.email,
            user: {
                connect: {email: user.email}
            }
        },
        select: {
            id: true,
            token: true,
            expired_at: true,
            email: true
        }
    });

    return userCreate;
}

const login = async (request) => {
    const user = validate(loginUserValidation, request);

    const userInDatabase = await prismaClient.users.findUnique({
        where: {
            email: user.email
        },
        select: {
            id: true,
            name: true,
            email: true,
            number_phone: true,
            refresh_token: true,
            refresh_token_id: true,
            is_delete: true,
            password: true,
            role_id: true,
        }
    })

    if (!userInDatabase) {
        throw new ResponseError(400, 'Email atau Password salah !')
    }

    if (userInDatabase && userInDatabase.is_delete === true) {
        throw new ResponseError(400, 'Tidak dapat login, akun anda telah dihapus !')
    }

    const isPasswordValid = await bcrypt.compare(user.password, userInDatabase.password)
    if (!isPasswordValid) {
        throw new ResponseError(400, 'Email atau Password salah !')
    }

    delete user.password;
    const refreshToken = await generateRefreshToken({
        email: user.email,
    })

    const token = await generateToken({
        email: user.email,
    })

    const currentDateTime = await moment().tz('Asia/Jakarta').toDate();
    const refreshTokenExpired = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const tokenExpired = moment(currentDateTime)
        .add(40, 'minutes')
        .tz('Asia/Jakarta')
        .toDate();

    if (userInDatabase && userInDatabase.refresh_token) {
        await prismaClient.refreshToken.delete({
            where: {
                id: userInDatabase.refresh_token_id,
            }
        })
    }

    await prismaClient.users.update({
        where: {
            email: user.email,
        },
        data: {
            refresh_token: {
                create: {
                    refresh_token: refreshToken,
                    expired_at: refreshTokenExpired
                }
            }
        },
        select: {
            id: true,
        }
    })

    const tokenCreate = await prismaClient.token.create({
        data: {
            token: token,
            expired_at: tokenExpired,
            email: user.email,
            user: {
                connect: {email: user.email}
            }
        },
        select: {
            id: true,
            token: true,
            expired_at: true,
            email: true,
        }
    });

    const getUser = await prismaClient.users.findFirst({
        where: {
            email: user.email,
        },
        select: {
            id: true,
            name: true,
            email: true,
            number_phone: true,
            refresh_token: {
               select: {
                   id: true,
                   refresh_token: true,
                   expired_at: true,
               }
            },
            role_id: true,
        }
    })

    getUser.token = tokenCreate

    return getUser;
}

const update = async (request) => {
    const user = validate(updateUserValidation, request);

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
            avatar: true,
        }
    })

    if (!userInDatabase) {
        throw new ResponseError(404, 'Pengguna tidak ditemukan !')
    }

    if (userInDatabase) {
        if (userInDatabase.number_phone === user.number_phone && user.id !== userInDatabase.id) {
            throw new ResponseError( 400,'No. Handphone telah terdaftar !')
        }
        if (userInDatabase.email === user.number_phone && user.id !== userInDatabase.id) {
            throw new ResponseError( 400,'No. Handphone telah terdaftar !')
        }
    }

    const data = {
        name: user.name,
        email: user.email,
        number_phone: user.number_phone,
        avatar: user.avatar
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

    if (user.avatar) {
        const oldAvatarPath = userInDatabase.avatar?.replace(`${process.env.DOMAIN}/`, "");
        const newUploadAvatarPath = process.env.FILE_UPLOAD_PROFILE.replace(process.env.DELETE_PATH_UPLOAD, "")
        const newAvatarPathURL = user?.profile?.filename
            ? `${process.env.DOMAIN}/${newUploadAvatarPath}/${user?.profile?.filename}`
            : undefined;

        if (newAvatarPathURL && oldAvatarPath && newAvatarPathURL !== oldAvatarPath) {
            const fullPath =  path.join(process.env.DELETE_PATH_UPLOAD, oldAvatarPath.replace(/\\/g, '/'))
            fs.unlink(fullPath, (err) => {
                if (err) {
                    logger.error(`Failed to delete old image: ${err.message}`)
                } else {
                    logger.info(`Deleted old image: ${oldAvatarPath}`)
                }
            });
        }
    }

    return prismaClient.users.update({
        where: {
            id: user.id,
        },
        data: {
            ...data
        },
        select: {
            id: true,
            name: true,
            email: true,
            number_phone: true,
        }
    })
}

const loginGoogle = async (request) => {
    const user = validate(loginWithGoogleUserValidation, request);

    let userInDatabase = await prismaClient.users.findUnique({
        where: {
            email: user.email
        },
        select: {
            id: true,
            name: true,
            email: true,
            number_phone: true,
            refresh_token: true,
            refresh_token_id: true,
            is_delete: true,
            role_id: true,
        }
    })

    if (!userInDatabase) {
        userInDatabase = await prismaClient.users.create({
            data: {
                name: user.name,
                email: user.email,
                number_phone: user.number_phone,
                google_id: user.google_id,
                role: {
                    connect: {
                        id: 3
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

    const refreshToken = await generateRefreshToken({
        email: user.email,
    })

    const token = await generateToken({
        email: user.email,
    })

    if (userInDatabase.refresh_token_id) {
        await prismaClient.refreshToken.delete({
            where: {
                id: userInDatabase.refresh_token_id,
            }
        })
    }

    const currentDateTime = await moment().tz('Asia/Jakarta').toDate();
    const refreshTokenExpired = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const tokenExpired = moment(currentDateTime)
        .add(40, 'minutes')
        .tz('Asia/Jakarta')
        .toDate();

    await prismaClient.users.update({
        where: {
            email: user.email,
        },
        data: {
            refresh_token: {
                create: {
                    refresh_token: refreshToken,
                    expired_at: refreshTokenExpired
                }
            }
        }
    })

    const tokenCreate = await prismaClient.token.create({
        data: {
            token: token,
            expired_at: tokenExpired,
            email: user.email,
            user: {
                connect: {email: user.email}
            }
        },
        select: {
            id: true,
            token: true,
            expired_at: true,
            email: true,
        }
    })

    const getUser = await prismaClient.users.findFirst({
        where: {
            email: user.email,
        },
        select: {
            id: true,
            name: true,
            email: true,
            number_phone: true,
            refresh_token: {
                select: {
                    id: true,
                    refresh_token: true,
                    expired_at: true,
                }
            },
            role_id: true,
        }
    })

    getUser.token = tokenCreate

    return getUser;
}

const logout = async (request) => {
    const data = validate(getUserValidation, request);

    const tokenInDatabase = await prismaClient.token.findFirst({
        where: {
            token: data.token
        }
    })

    if (!tokenInDatabase) {
        throw ResponseError(404, "Token tidak ditemukan !")
    }

    await prismaClient.users.update({
        where: {
            id: data.user_id,
        },
        data: {
            refresh_token: {
                delete: true
            }
        }
    })

    await prismaClient.token.delete({
        where: {
            token: data.token,
            id: tokenInDatabase.id,
        }
    })
}

const refresh = async (request) => {
    const user = validate(getUserValidation, request);

    const getUser = await prismaClient.users.findUnique({
        where: {
            id: user.user_id,
        },
        select: {
            id: true,
            name: true,
            email: true,
            number_phone: true,
            refresh_token_id: true,
            role_id: true,
        }
    })

    const getToken = await prismaClient.token.findFirst({
        where: {
            token: user.token,
        },
        select: {
            id: true,
        }
    })

    if (!getUser) {
        throw ResponseError(404, "Pengguna tidak ditemukan !")
    }

    const refreshTokenOnDatabase = await prismaClient.refreshToken.findFirst({
        where: {
            id: getUser.refresh_token_id
        }
    })

    if (!refreshTokenOnDatabase) {
        throw ResponseError(302, "Refresh token tidak ditemukan !")
    }

    const refreshTokenExpired = moment(refreshTokenOnDatabase.expired_at).tz('Asia/Jakarta');
    const currentDateTime = moment(new Date()).tz('Asia/Jakarta');

    if (!refreshTokenExpired.isAfter(currentDateTime)) {
        throw new ResponseError(302, "Refresh Token telah kadaluarsa, harap login kembali !")
    }

    const refreshToken = await generateRefreshToken({
        id: getUser.id,
        email: getUser.email,

    })

    const token = await generateToken({
        id: getUser.id,
        email: getUser.email,
    })

    const refreshTokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const tokenExpires = await moment(currentDateTime)
        .add(40, 'minutes')
        .tz('Asia/Jakarta')
        .toDate();

    await prismaClient.refreshToken.delete({
        where: {
            id: getUser.refresh_token_id
        }
    })

    await prismaClient.token.delete({
        where: {
            id: getToken.id,
            email: getUser.token,
        }
    })

    const createToken = await prismaClient.token.create({
        data: {
            token: token,
            expired_at: tokenExpires,
            email: getUser.email,
            user: {
                connect: {id: user.user_id}
            }
        },
        select: {
            id: true,
            token: true,
            expired_at: true,
            email: true,
        }
    })

    const userUpdate = await prismaClient.users.update({
        where: {
            id: user.user_id,
        },
        data: {
            refresh_token: {
                create: {
                    refresh_token: refreshToken,
                    expired_at: refreshTokenExpires,
                }
            }
        },
        select: {
            id: true,
            name: true,
            email: true,
            number_phone: true,
            refresh_token: true,
            role_id: true,
        }
    })

    userUpdate.token = createToken;

    return userUpdate;
}

const get = async (request) => {
    const user = validate(getUserValidation, request);

    const token = await prismaClient.token.findFirst({
        where: {
            user_id: user.user_id,
            token: user.token,
            expired_at: {
                gt: new Date()
            }
        },
        select: {
            id: true,
            token: true,
            expired_at: true,
            email: true
        }
    })

    const getUser = await prismaClient.users.findUnique({
        where: {
            id: user.user_id,
        },
        select: {
            id: true,
            name: true,
            email: true,
            number_phone: true,
            role: true,
            district: true,
            avatar: true,
            refresh_token: {
              select: {
                  refresh_token: true,
                  expired_at: true,
                  id: true,
              }
            },
        }
    })

    if (!token) {
        throw ResponseError(302, "Your session has expired, redirecting to login page!")
    }


    if (!user) {
        throw ResponseError(404, "Pengguna tidak ditemukan !")
    }

    getUser.token = token;

    return getUser;
}

export default {
    register,
    update,
    login,
    loginGoogle,
    logout,
    refresh,
    get
}