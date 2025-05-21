import {prismaClient} from "../../src/application/database.js";
import {createReportData} from "./reports-utils.js";

export const createTestComment = async () => {

    const report = await createReportData()

    return prismaClient.comments.create({
        data: {
            comment: "Test Comment",
            user: {
                connect: {
                    id: "user1"
                }
            },
            report: {
                connect: {
                    id: report.id
                }
            }

        }
    })
}

export const removeTestComment = async () => {
    await prismaClient.comments.deleteMany({})
}