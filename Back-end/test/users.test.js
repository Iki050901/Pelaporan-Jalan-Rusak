import {createTestUser, createTestUserPupr, removeTestUser} from "./utils/users-utils.js";
import supertest from "supertest";
import {web} from "../src/application/web.js";


describe('POST /api/pupr/users/create', () => {

    beforeEach(async () => {
        await createTestUserPupr()
    })

    afterEach(async () => {
        await removeTestUser();
    })

    it('should accept create user', async () => {
        const result = await supertest(web)
            .post('/api/pupr/users/create')
            .set('Authorization', 'userPuprToken')
            .send({
                name: "User 2",
                number_phone: "082212331323",
                email: "testuser2@test.com",
                password: "rahasia",
                confirm_password: "rahasia",
                role_id: 3,
            })

        console.log(result.body)

        expect(result.status).toBe(200)
    })
})

describe('PUT /api/pupr/users/update/:user_id', () => {

    beforeEach(async () => {
        await createTestUserPupr()
    })

    afterEach(async () => {
        await removeTestUser();
    })

    it('should accept update user', async () => {
        const user = await createTestUser()
        const result = await supertest(web)
            .put(`/api/pupr/users/update/${user.id}`)
            .set('Authorization', 'userPuprToken')
            .send({
                name: "User 2",
                number_phone: "082212331323",
                email: "testuser2@test.com",
                password: "rahasia",
                confirm_password: "rahasia",
                role_id: 3,
            })

        console.log(result.body)

        expect(result.status).toBe(200)
    })
})

describe('PUT /api/pupr/users/update/:user_id', () => {

    beforeEach(async () => {
        await createTestUserPupr()
    })

    afterEach(async () => {
        await removeTestUser();
    })

    it('should accept update user', async () => {
        const user = await createTestUser()
        const result = await supertest(web)
            .put(`/api/pupr/users/update/${user.id}`)
            .set('Authorization', 'userPuprToken')
            .send({
                name: "User 2",
                number_phone: "082212331323",
                email: "testuser2@test.com",
                password: "rahasia",
                confirm_password: "rahasia",
                role_id: 3,
            })

        console.log(result.body)

        expect(result.status).toBe(200)
    })
})

describe('GET /api/pupr/users/:user_id', () => {

    beforeEach(async () => {
        await createTestUserPupr()
    })

    afterEach(async () => {
        await removeTestUser();
    })

    it('should accept get user', async () => {
        const user = await createTestUser()
        const result = await supertest(web)
            .get(`/api/pupr/users/${user.id}`)
            .set('Authorization', 'userPuprToken')

        console.log(result.body)

        expect(result.status).toBe(200)
    })
})

describe('GET /api/pupr/users', () => {

    beforeEach(async () => {
        await createTestUserPupr()
    })

    afterEach(async () => {
        await removeTestUser();
    })

    it('should accept get list user', async () => {
        const result = await supertest(web)
            .get(`/api/pupr/users`)
            .set('Authorization', 'userPuprToken')

        console.log(result.body)

        expect(result.status).toBe(200)
    })
})

describe('DELETE /api/pupr/users/remove/:user_id', () => {

    beforeEach(async () => {
        await createTestUserPupr()
    })

    afterEach(async () => {
        await removeTestUser();
    })

    it('should accept remove list user', async () => {
        const user = await createTestUser()
        const result = await supertest(web)
            .delete(`/api/pupr/users/remove/${user.id}`)
            .set('Authorization', 'userPuprToken')

        console.log(result.body)

        expect(result.status).toBe(200)
    })
})