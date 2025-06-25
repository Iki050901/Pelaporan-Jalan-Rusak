import {prismaClient} from "../../src/application/database.js";


export const reportData = async () => {
    return {
        title: "Jalan Rusak di Jln. Merdeka",
        desc: "Jalan Rusak di Jln. Merdeka, bisa menyebabkan kecelakaan di jalan",
        lat: "-6.203333",
        long: "106.823333",
        location: "Jalan Merdeka",
        damage_level_id: 2,
    }
}

export const createReportData = async (kecamatan = false, pupr = false) => {
    return prismaClient.reports.create({
        data: {
            user: {
                connect: {
                    id: "user1"
                }
            },
            title: "Jalan Rusak di Jln. Nasution",
            desc: "Jalan Rusak di Jln. Nasution, susah untuk dilewati",
            lat: -6.203333,
            long: 106.823333,
            location: "Jalan Nasution",
            damage_level: {
                connect: {
                    id: 3
                }
            },
            validation_status: {
                connect: {
                    id: kecamatan ? 3 : pupr ? 4 : 1
                }
            },
            ...(kecamatan ? ({is_district_validate: true}) : pupr ? ({ is_pupr_validate: true}): undefined),
            video_url: "uploads/reports/videos/2.jpg",
            is_pupr_validate: pupr,
            is_district_validate: kecamatan,
        }
    })
}

export const removeReportData = async () => {
    await prismaClient.reportImages.deleteMany({})

    await prismaClient.reports.deleteMany({})
}