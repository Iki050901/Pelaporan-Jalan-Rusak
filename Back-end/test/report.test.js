import {createTestUser, createTestUserDistrict, createTestUserPupr, removeTestUser} from "./utils/users-utils.js";
import {createReportData, removeReportData, reportData} from "./utils/reports-utils.js";
import supertest from "supertest";
import {web} from "../src/application/web.js";
import path from "node:path";

describe('POST /api/users/report/create', () => {

    beforeEach(async () => {
        await createTestUser()
    })

    afterEach(async () => {
        await removeReportData();
        await removeTestUser();
    })

    it('should accept create report', async () => {
        const createDataReport = await reportData()
        const stringifyData = JSON.stringify(createDataReport)
        const result = await supertest(web)
            .post('/api/users/report/create')
            .set('Authorization', 'userToken')
            .field('report_data', stringifyData)
            .attach('images[]', path.join(__dirname, 'files-test/2.jpg'))
            .attach('images[]', path.join(__dirname, 'files-test/3.jpg'))
            .attach('images[]', path.join(__dirname, 'files-test/4.jpg'))
            .attach('images[]', path.join(__dirname, 'files-test/5.jpg'))
            .attach('images[]', path.join(__dirname, 'files-test/6.jpg'))
            .attach('video', path.join(__dirname, 'files-test/video.mp4'))

        expect(result.status).toBe(200)
        expect(result.body.data.title).toBe("Jalan Rusak di Jln. Merdeka")
        expect(result.body.data.desc).toBe("Jalan Rusak di Jln. Merdeka, bisa menyebabkan kecelakaan di jalan")
        expect(result.body.data.lat).toBe("-6.203333")
        expect(result.body.data.long).toBe("106.823333")
        expect(result.body.data.damage_level_id).toBe(2)
        expect(result.body.data.validation_stat_id).toBe(1)
        expect(result.body.data.video_url).toBeDefined()
        expect(result.body.data.report_images).toBeDefined()
    })
})

describe('PUT /api/users/report/update/:report_id', () => {

    beforeEach(async () => {
        await createTestUser()
    })

    afterEach(async () => {
        await removeReportData();
        await removeTestUser();
    })

    it('should accept update report', async () => {
        const createDataReport = await reportData()
        const stringifyData = JSON.stringify(createDataReport)
        const createReport = await createReportData()
        const result = await supertest(web)
            .put(`/api/users/report/update/${createReport.id}`)
            .set('Authorization', 'userToken')
            .field('report_data', stringifyData)
            .attach('images[]', path.join(__dirname, 'files-test/2.jpg'))
            .attach('images[]', path.join(__dirname, 'files-test/3.jpg'))
            .attach('images[]', path.join(__dirname, 'files-test/4.jpg'))
            .attach('images[]', path.join(__dirname, 'files-test/5.jpg'))
            .attach('images[]', path.join(__dirname, 'files-test/6.jpg'))
            .attach('video', path.join(__dirname, 'files-test/video.mp4'))

        console.log(result.body)

        expect(result.status).toBe(200)
        expect(result.body.data.title).toBe("Jalan Rusak di Jln. Merdeka")
        expect(result.body.data.desc).toBe("Jalan Rusak di Jln. Merdeka, bisa menyebabkan kecelakaan di jalan")
        expect(result.body.data.lat).toBe("-6.203333")
        expect(result.body.data.long).toBe("106.823333")
        expect(result.body.data.damage_level_id).toBe(2)
        expect(result.body.data.video_url).toBeDefined()
        expect(result.body.data.report_images).toBeDefined()
    })
})

describe('GET /api/report/remove/:report_id', () => {

    beforeEach(async () => {
        await createTestUser()
        await createTestUserPupr()
        await createTestUserDistrict()
    })

    afterEach(async () => {
        await removeReportData();
        await removeTestUser();
    })

    it('should accept delete report', async () => {
        const createReport = await createReportData()
        const result = await supertest(web)
            .delete(`/api/report/remove/${createReport.id}`)
            .set('Authorization', 'userToken')

        console.log(result.body)

        expect(result.status).toBe(200)
        expect(result.body.data).toBe("OK")
    })
})

describe('GET /api/report:report_id', () => {

    beforeEach(async () => {
        await createTestUser()
        await createTestUserPupr()
        await createTestUserDistrict()
    })

    afterEach(async () => {
        await removeReportData();
        await removeTestUser();
    })

    it('should accept get report, by Users', async () => {
        const createReport = await createReportData()
        const result = await supertest(web)
            .get(`/api/report/${createReport.id}`)
            .set('Authorization', 'userToken')

        console.log(result.body)

        expect(result.status).toBe(200)
        expect(result.body.data.title).toBe("Jalan Rusak di Jln. Nasution")
        expect(result.body.data.desc).toBe("Jalan Rusak di Jln. Nasution, susah untuk dilewati")
        expect(result.body.data.lat).toBe("-6.203333")
        expect(result.body.data.long).toBe("106.823333")
        expect(result.body.data.damage_level.id).toBe(3)
        expect(result.body.data.validation_status.id).toBe(1)
        expect(result.body.data.user.id).toBe("user1")
        expect(result.body.data.is_pupr_validate).toBe(false)
        expect(result.body.data.is_district_validate).toBe(false)
        expect(result.body.data.video_url).toBeDefined()
        expect(result.body.data.ReportImages).toBeDefined()
    })

    it('should accept get report, by District Users', async () => {
        const createReport = await createReportData()
        const result = await supertest(web)
            .get(`/api/report/${createReport.id}`)
            .set('Authorization', 'userDistrictToken')

        console.log(result.body)

        expect(result.status).toBe(200)
        expect(result.body.data.title).toBe("Jalan Rusak di Jln. Nasution")
        expect(result.body.data.desc).toBe("Jalan Rusak di Jln. Nasution, susah untuk dilewati")
        expect(result.body.data.lat).toBe("-6.203333")
        expect(result.body.data.long).toBe("106.823333")
        expect(result.body.data.damage_level.id).toBe(3)
        expect(result.body.data.validation_status.id).toBe(1)
        expect(result.body.data.user.id).toBe("user1")
        expect(result.body.data.is_pupr_validate).toBe(false)
        expect(result.body.data.is_district_validate).toBe(false)
        expect(result.body.data.video_url).toBeDefined()
        expect(result.body.data.ReportImages).toBeDefined()
    })

    it('should accept get report, by PUPR Users', async () => {
        const createReport = await createReportData()
        const result = await supertest(web)
            .get(`/api/report/${createReport.id}`)
            .set('Authorization', 'userPuprToken')

        console.log(result.body)

        expect(result.status).toBe(200)
        expect(result.body.data.title).toBe("Jalan Rusak di Jln. Nasution")
        expect(result.body.data.desc).toBe("Jalan Rusak di Jln. Nasution, susah untuk dilewati")
        expect(result.body.data.lat).toBe("-6.203333")
        expect(result.body.data.long).toBe("106.823333")
        expect(result.body.data.damage_level.id).toBe(3)
        expect(result.body.data.validation_status.id).toBe(1)
        expect(result.body.data.user.id).toBe("user1")
        expect(result.body.data.is_pupr_validate).toBe(false)
        expect(result.body.data.is_district_validate).toBe(false)
        expect(result.body.data.video_url).toBeDefined()
        expect(result.body.data.ReportImages).toBeDefined()
    })

    it('should reject get report, because no token', async () => {
        const createReport = await createReportData()
        const result = await supertest(web)
            .get(`/api/report/${createReport.id}`)

        console.log(result.body)

        expect(result.status).toBe(401)
        expect(result.body.errors).toBeDefined()
    })
})

describe('GET /api/report', () => {

    beforeEach(async () => {
        await createTestUser()
        await createTestUserPupr()
        await createTestUserDistrict()
        await createReportData()
    })

    afterEach(async () => {
        await removeReportData();
        await removeTestUser();
    })

    it('should accept get list report', async () => {
        const result = await supertest(web)
            .get(`/api/report`)
            .set('Authorization', 'userToken')

        console.log(result.body)

        expect(result.status).toBe(200)
        expect(result.body.data.reports.length).toBeGreaterThan(0)
        expect(result.body.data.total_pages).toBe(1)
        expect(result.body.data.current_page).toBe(1)
        expect(result.body.data.page_size).toBe(10)
        expect(result.body.data.total_data).toBe(1)

    })

    it('should accept get list report by level_damage', async () => {
        const result = await supertest(web)
            .get(`/api/report?level_damage=3`)
            .set('Authorization', 'userToken')

        console.log(result.body)

        expect(result.status).toBe(200)
        expect(result.body.data.reports.length).toBeGreaterThan(0)
        expect(result.body.data.total_pages).toBe(1)
        expect(result.body.data.current_page).toBe(1)
        expect(result.body.data.page_size).toBe(10)
        expect(result.body.data.total_data).toBe(1)

    })

    it('should accept get list report by status', async () => {
        const result = await supertest(web)
            .get(`/api/report?status=1`)
            .set('Authorization', 'userToken')

        console.log(result.body)

        expect(result.status).toBe(200)
        expect(result.body.data.reports.length).toBeGreaterThan(0)
        expect(result.body.data.total_pages).toBe(1)
        expect(result.body.data.current_page).toBe(1)
        expect(result.body.data.page_size).toBe(10)
        expect(result.body.data.total_data).toBe(1)
    })

    it('should accept get list report by page', async () => {
        const result = await supertest(web)
            .get(`/api/report?page=2`)
            .set('Authorization', 'userToken')

        console.log(result.body)

        expect(result.status).toBe(200)
        expect(result.body.data.reports.length).toBeGreaterThanOrEqual(0)
        expect(result.body.data.total_pages).toBe(1)
        expect(result.body.data.current_page).toBe(2)
        expect(result.body.data.page_size).toBe(10)
        expect(result.body.data.total_data).toBe(1)

    })

    it('should accept get list report by limit', async () => {
        const result = await supertest(web)
            .get(`/api/report?limit=10`)
            .set('Authorization', 'userToken')

        console.log(result.body)

        expect(result.status).toBe(200)
        expect(result.body.data.reports.length).toBeGreaterThan(0)
        expect(result.body.data.total_pages).toBe(1)
        expect(result.body.data.current_page).toBe(1)
        expect(result.body.data.page_size).toBe(10)
        expect(result.body.data.total_data).toBe(1)

    })
})

describe('PUT /api/district/report/validate/:report_id/:validate_id', () => {

    beforeEach(async () => {
        await createTestUser()
        await createTestUserDistrict()
    })

    afterEach(async () => {
        await removeReportData();
        await removeTestUser();
    })

    it('should accept validate report by district', async () => {
        const createReport = await createReportData()
        const result = await supertest(web)
            .put(`/api/district/report/validate/${createReport.id}/3`)
            .set('Authorization', 'userDistrictToken')

        console.log(result.body)

        expect(result.status).toBe(200)
        expect(result.body.data.validation_status.id).toBe(2)
        expect(result.body.data.validation_status.status).toBeDefined()
    })

    it('should accept validate report by district with notes', async () => {
        const createReport = await createReportData()
        const result = await supertest(web)
            .put(`/api/district/report/validate/${createReport.id}/2`)
            .set('Authorization', 'userDistrictToken')
            .send({
                note: "harap lampirkan foto bukti kecelakaan"
            })

        console.log(result.body)

        expect(result.status).toBe(200)
        expect(result.body.data.validation_status.id).toBe(2)
        expect(result.body.data.validation_status.status).toBeDefined()
    })

})

describe('PUT /api/pupr/report/validate/:report_id/:validate_id', () => {

    beforeEach(async () => {
        await createTestUser()
        await createTestUserPupr()
    })

    afterEach(async () => {
        await removeReportData();
        await removeTestUser();
    })

    it('should accept validate report by pupr', async () => {
        const createReport = await createReportData(true)
        const result = await supertest(web)
            .put(`/api/pupr/report/validate/${createReport.id}/5`)
            .set('Authorization', 'userPuprToken')

        console.log(result.body)

        expect(result.status).toBe(200)
        expect(result.body.data.validation_status.id).toBe(5)
        expect(result.body.data.validation_status.status).toBeDefined()
    })

    it('should accept validate report by pupr with notes', async () => {
        const createReport = await createReportData(true)
        const result = await supertest(web)
            .put(`/api/pupr/report/validate/${createReport.id}/6`)
            .set('Authorization', 'userPuprToken')
            .send({
                note: "harap lampirkan foto bukti kecelakaan"
            })

        console.log(result.body)

        expect(result.status).toBe(200)
        expect(result.body.data.validation_status.id).toBe(6)
        expect(result.body.data.validation_status.status).toBeDefined()
    })
})

describe('GET /api/report/dashboard', () => {

    beforeEach(async () => {
        await createTestUser()
        await createReportData()
    })

    afterEach(async () => {
        await removeReportData();
        await removeTestUser();
    })

    it('should accept get dashboard report', async () => {
        const result = await supertest(web)
            .get(`/api/report/dashboard`)

        console.log(result.body)

        expect(result.status).toBe(200)
    })
})


describe('GET /api/report/dashboard/by-level', () => {

    beforeEach(async () => {
        await createTestUser()
        await createReportData()
    })

    afterEach(async () => {
        await removeReportData();
        await removeTestUser();
    })

    it('should accept get dashboard report by level', async () => {
        const result = await supertest(web)
            .get(`/api/report/dashboard/by-level`)

        console.log(result.body)

        expect(result.status).toBe(200)
    })
})