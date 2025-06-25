import supertest from "supertest";
import {web} from "../src/application/web.js"
import {logger} from "../src/application/logging.js";
import {createTestUser, removeTestUser} from "./utils/users-utils.js";
import {prismaClient} from "../src/application/database.js";
import passport from "passport";

describe('POST /api/users/register', () => {

    afterEach(async () => {
        await removeTestUser();
    })
    
    it('should create register user', async () => {
        const result = await supertest(web)
            .post("/api/users/register")
            .send({
                name: "Test",
                email: "user@test.com",
                number_phone: "087331221331",
                password: "rahasia",
                confirm_password: "rahasia",
            })

        logger.info(result.body)

        expect(result.status).toBe(200)
        expect(result.body.data.name).toBe("Test")
        expect(result.body.data.email).toBe("user@test.com");
        expect(result.body.data.number_phone).toBe("087331221331");
        expect(result.body.data.password).toBeUndefined();
        expect(result.body.data.token).toBeDefined();
        expect(result.body.data.refresh_token).toBeDefined();
    });

    it('should reject register user', async () => {
        const result = await supertest(web)
            .post("/api/users/register")
            .send({
                name: "",
                email: "",
                number_phone: "",
                password: "",
                confirm_password: "",
            })

        logger.info(result.body)

        expect(result.status).toBe(400)
        expect(result.body.errors).toBeDefined()
    });
});

describe('POST /api/users/login', () => {
    
    beforeEach(async () => {
        await createTestUser()
    })
    
    afterEach(async () => {
        await removeTestUser();
    })

    it('should accept login user', async () => {
        const result = await supertest(web)
            .post('/api/users/login')
            .send({
                email: "user@test.com",
                password: "rahasia",
            })

        logger.info(result.body);

        expect(result.status).toBe(200)
        expect(result.body.data.id).toBe("user1");
        expect(result.body.data.token.token).not.toBe("userToken");
        expect(result.body.data.refresh_token.refresh_token).not.toBe("userRefreshToken");
        expect(result.body.data.name).toBe("User")
        expect(result.body.data.email).toBe("user@test.com");
        expect(result.body.data.number_phone).toBe("087331221331");
        expect(result.body.data.password).toBeUndefined();
    });

    it('should reject login user', async () => {
        const result = await supertest(web)
            .post('/api/users/login')
            .send({
                email: "",
                password: "",
            })

        logger.info(result.body);

        expect(result.status).toBe(400)
        expect(result.body.errors).toBeDefined()
    });
})

describe('GET /auth/google', () => {

    beforeEach(async () => {
        await createTestUser()
    })

    afterEach(async () => {
        await removeTestUser();
    })

    it('should should login user with google auth', async () => {
        const result = await supertest(web)
            .get('/auth/google')

        console.log(result.body)

        expect(result.status).toBe(302)
        expect(result.headers.location).toContain('accounts.google.com');
    });

    it('should handle google callback successfully', async () => {
        // Mock the passport authenticate middleware
        const mockUser = {
            googleId: '12345',
            email: 'test@example.com',
            name: 'Test User'
        };

        passport.authenticate = jest.fn((strategy, options) => {
            return (req, res, next) => {
                req.user = mockUser;
                next();
            };
        });

        const result = await supertest(web)
            .get('/auth/google/callback')
            .query({ code: 'mock_auth_code' });

        console.log(result.body)

        expect(result.status).toBe(200);
        expect(result.body).toHaveProperty('email');
        expect(result.body).toHaveProperty('name');
    });
});

describe('POST /api/users/logout', () => {

    beforeEach(async () => {
        await createTestUser()
    })

    afterEach(async () => {
        await removeTestUser();
    })

    it('should logout user', async () => {
        const result = await supertest(web)
            .delete('/api/users/logout')
            .set('Authorization', 'userToken')

        console.log(result.body)

        expect(result.status).toBe(200)
        expect(result.body.data).toBe("Logout Success")
    })
})

describe('POST /api/users/refresh', () => {
    beforeEach(async () => {
        await createTestUser()
    })

    afterEach(async () => {
        await removeTestUser();
    })

    it('should refresh token', async () => {
        const result = await supertest(web)
            .put('/api/users/refresh')
            .set('Authorization', 'userToken')

        console.log(result.body)

        expect(result.status).toBe(200)
        expect(result.body.data.token.token).not.toBe("userToken");
        expect(result.body.data.refresh_token.refresh_token).not.toBe("userRefreshToken");
    })
})

describe('PUT /api/users/current', () => {
    beforeEach(async () => {
        await createTestUser()
    })

    afterEach(async () => {
        await removeTestUser();
    })

    it('should update current user', async () => {
        const result = await supertest(web)
            .put('/api/users/current')
            .set('Authorization', 'userToken')
            .send({
                name: "Test1",
                email: "usertest@test.com",
                number_phone: "087331221334",
                password: "rahasia666",
                confirm_password: "rahasia666",
            })

        console.log(result.body)

        expect(result.status).toBe(200);
        expect(result.body.data.name).toBe("Test1");
        expect(result.body.data.email).toBe("usertest@test.com");
        expect(result.body.data.number_phone).toBe("087331221334");
        expect(result.body.data.password).toBeUndefined();
        expect(result.body.data.token).toBeUndefined();
        expect(result.body.data.refresh_token).toBeUndefined();
    })

    it('should update current user, if the password is empty', async () => {
        const result = await supertest(web)
            .put('/api/users/current')
            .set('Authorization', 'userToken')
            .send({
                name: "Test1",
                email: "usertest@test.com",
                number_phone: "087331221334",
                password: "",
                confirm_password: "",
            })

        console.log(result.body)

        expect(result.status).toBe(200);
        expect(result.body.data.name).toBe("Test1");
        expect(result.body.data.email).toBe("usertest@test.com");
        expect(result.body.data.number_phone).toBe("087331221334");
        expect(result.body.data.password).toBeUndefined();
        expect(result.body.data.token).toBeUndefined();
        expect(result.body.data.refresh_token).toBeUndefined();
    })
})

describe('GET /api/users/current', () => {

    beforeEach(async () => {
        await createTestUser()
    })

    afterEach(async () => {
        await removeTestUser();
    })

    it('should get current user', async () => {
        const result = await supertest(web)
            .get('/api/users/current')
            .set('Authorization', 'userToken')

        console.log(result.body)

        expect(result.status).toBe(200)
        expect(result.body.data.id).toBe("user1");
        expect(result.body.data.token.token).toBe("userToken");
        expect(result.body.data.token.expired_at).toBeDefined();
        expect(result.body.data.refresh_token.refresh_token).toBe("userRefreshToken");
        expect(result.body.data.refresh_token.expired_at).toBeDefined();
        expect(result.body.data.name).toBe("User")
        expect(result.body.data.email).toBe("user@test.com");
        expect(result.body.data.number_phone).toBe("087331221331");
        expect(result.body.data.password).toBeUndefined();
    })

})