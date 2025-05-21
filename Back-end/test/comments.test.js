import supertest from "supertest";
import {web} from "../src/application/web.js"
import {logger} from "../src/application/logging.js";
import {createTestUser, createTestUserDistrict, createTestUserPupr, removeTestUser} from "./utils/users-utils.js";
import {createReportData, removeReportData} from "./utils/reports-utils.js";
import {createTestComment, removeTestComment} from "./utils/comments-utils.js";

describe('POST /api/report/:report_id/comments/create', () => {

    beforeEach(async () => {
        await createTestUser()
    })

    afterEach(async () => {
        await removeTestComment()
        await removeReportData();
        await removeTestUser();
    })
    
    it('should create comments', async () => {
        const report = await createReportData()
        const result = await supertest(web)
            .post(`/api/report/${report.id}/comments/create`)
            .set('Authorization', 'userToken')
            .send({
                comment: "Test Comment"
            })

        console.log(result.body)

        expect(result.status).toBe(200)
        expect(result.body.data.comment).toBe("Test Comment")
    });

    it('should reject create comments, because comment is blank', async () => {
        const report = await createReportData()
        const result = await supertest(web)
            .post(`/api/report/${report.id}/comments/create`)
            .set('Authorization', 'userToken')
            .send({
               comment: ""
            })

        console.log(result.body)

        expect(result.status).toBe(400)
        expect(result.body.errors).toBeDefined()
    });
});

describe('DELETE /api/report/comments/remove/:comment_id', () => {

    beforeEach(async () => {
        await createTestUser()
    })

    afterEach(async () => {
        await removeTestComment()
        await removeReportData();
        await removeTestUser();
    })
    
    it('should remove comments', async () => {
        const comment = await createTestComment()
        const result = await supertest(web)
            .delete(`/api/report/comments/remove/${comment.id}`)
            .set('Authorization', 'userToken')

        console.log(result.body)

        expect(result.status).toBe(200)
        expect(result.body.data).toBe("OK")
    })

    it('should reject remove comments, because id mismatch', async () => {
        const result = await supertest(web)
            .delete("/api/report/comments/remove/4")
            .set('Authorization', 'userToken')

        console.log(result.body)

        expect(result.status).toBe(404)
        expect(result.body.errors).toBeDefined()
    })
});

describe('GET /api/report/:report_id/comments', () => {

    beforeEach(async () => {
        await createTestUser()
    })

    afterEach(async () => {
        await removeTestComment()
        await removeReportData();
        await removeTestUser();
    })

    it('should get list comments', async () => {
        const report = await createReportData()
        const result = await supertest(web)
            .get(`/api/report/${report.id}/comments`)
            .set('Authorization', 'userToken')

        console.log(result.body)

        expect(result.status).toBe(200)
        expect(result.body.data.comments).toBeDefined()
        expect(result.body.data.page_size).toBe(10)
        expect(result.body.data.current_page).toBe(1)
        expect(result.body.data.total_pages).toBeDefined()
        expect(result.body.data.total_data).toBeDefined()

    });

    it('should get list comments, with query limit 5', async () => {
        const report = await createReportData()
        const result = await supertest(web)
            .get(`/api/report/${report.id}/comments?limit=5`)
            .set('Authorization', 'userToken')

        console.log(result.body)

        expect(result.status).toBe(200)
        expect(result.body.data.comments).toBeDefined()
        expect(result.body.data.page_size).toBe(5)
        expect(result.body.data.current_page).toBe(1)
        expect(result.body.data.total_pages).toBeDefined()
        expect(result.body.data.total_data).toBeDefined()
    });
});