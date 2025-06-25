import {prismaClient} from "../src/application/database.js";
import {damageLevel, roles, validationStatus} from "./data/roles-seed.js";
import winston from "winston";
import {createUserSeedDistrict, createUserSeedPupr} from "./data/user-seed.js";

async function main() {

    // await prismaClient.roles.deleteMany()
    //
    // await prismaClient.roles.createMany({
    //     data: roles.map(role => ({
    //         role: role.role,
    //     }))
    // })
    //
    // await prismaClient.damageLevel.deleteMany()
    //
    // await prismaClient.damageLevel.createMany({
    //     data: damageLevel.map(level => ({
    //         level: level.level,
    //     }))
    // })
    //
    // await prismaClient.validationStatus.deleteMany()
    //
    // await prismaClient.validationStatus.createMany({
    //     data: validationStatus.map(status => ({
    //         status: status.status,
    //     }))
    // })

    await createUserSeedDistrict()
    await createUserSeedPupr()
}

main()
    .catch((e) => {
        winston.error(e)
        process.exit(1);
    })
    .finally(async () => {
        await prismaClient.$disconnect();
    });