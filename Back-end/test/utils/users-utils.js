import moment from "moment-timezone";
import {prismaClient} from "../../src/application/database.js";
import * as bcrypt from "bcrypt";

const expiresAt = moment().add(7, 'days')

export const createTestUser = async () => {
    return prismaClient.users.create({
        data: {
            id: "user1",
            name: "User",
            email: "user@test.com",
            number_phone: "087331221331",
            password: await bcrypt.hash("rahasia", 10),
            refresh_token: {
                create: {
                    id: "user1",
                    refresh_token: "userRefreshToken",
                    expired_at: expiresAt.toDate()
                }
            },
            Token: {
                create: {
                    id: "user1",
                    token: "userToken",
                    expired_at: expiresAt.toDate(),
                    email: "user@test.com",
                }
            },
            role: {
                connect: {
                    id: 3
                }
            }
        }
    })
}

export const removeTestUser = async () => {
    await prismaClient.token.deleteMany({})

    await prismaClient.refreshToken.deleteMany({})

    await prismaClient.users.deleteMany({})
}

export const createTestUserDistrict = async () => {
    await prismaClient.users.create({
        data: {
            id: "userdistrict1",
            name: "District User",
            email: "userdistrict@test.com",
            number_phone: "087331221332",
            password: await bcrypt.hash("rahasia", 10),
            refresh_token: {
                create: {
                    id: "userdistrict1",
                    refresh_token: "userDistrictRefreshToken",
                    expired_at: expiresAt.toDate()
                }
            },
            Token: {
                create: {
                    id: "userdistrict1",
                    token: "userDistrictToken",
                    expired_at: expiresAt.toDate(),
                    email: "userdistrict@test.com",
                }
            },
            role: {
                connect: {
                    id: 2
                }
            }
        }
    })
}

export const createTestUserPupr = async () => {
    await prismaClient.users.create({
        data: {
            id: "userpupr1",
            name: "Pupr User",
            email: "userpupr@test.com",
            number_phone: "087331221333",
            password: await bcrypt.hash("rahasia", 10),
            refresh_token: {
                create: {
                    id: "userpupr1",
                    refresh_token: "userPuprRefreshToken",
                    expired_at: expiresAt.toDate()
                }
            },
            Token: {
                create: {
                    id: "userpupr1",
                    token: "userPuprToken",
                    expired_at: expiresAt.toDate(),
                    email: "userpupr@test.com",
                }
            },
            role: {
                connect: {
                    id: 1
                }
            }
        }
    })
}
