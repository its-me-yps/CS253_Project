import app from '../../app.js';
import request from 'supertest';

describe('Testing Admin Login Route', () => {
    test('admin login with valid credentials', async () => {
        const req = {
            body: {
                username: process.env.ADMIN_USERNAME,
                password: process.env.ADMIN_PASSWORD
            }
        };

        const res = await request(app).post('/session/admin/login').send(req.body);
        expect(res.status).toEqual(200);
        expect(res.body).toEqual({ message: 'Admin logged in successfully' });
    });

    test('admin login with invalid credentials', async () => {
        const req = {
            body: {
                username: 'invalid_username',
                password: 'invalid_password'
            }
        };

        const res = await request(app).post('/session/admin/login').send(req.body);
        expect(res.status).toEqual(401);
        expect(res.body).toEqual({ message: 'Invalid credentials' });
    });
});

describe('Testing Student Login Route', () => {
    test('student login with valid credentials', async () => {
        const req = {
            body: {
                roll: '221223',
                pass: 'a1234567'
            }
        };

        const res = await request(app).post('/session/student/login').send(req.body);
        expect(res.status).toEqual(200);
        expect(res.body).toEqual({ message: 'student logged in successfully' });
    });

    test('student login with invalid credentials', async () => {
        const req = {
            body: {
                roll: '221223',
                pass: 'invalid_password'
            }
        };

        const res = await request(app).post('/session/student/login').send(req.body);
        expect(res.status).toEqual(401);
        expect(res.body).toEqual({ message: 'Invalid credentials' });
    });

    test('student login with non-existing roll', async () => {
        const req = {
            body: {
                roll: 'non_existing_roll',
                pass: 'a1234567'
            }
        };

        const res = await request(app).post('/session/student/login').send(req.body);
        expect(res.status).toEqual(401);
        expect(res.body).toEqual({ message: 'student not found' });
    });
});

describe('Testing Washerman Login Route', () => {
    test('washerman login with valid credentials', async () => {
        const req = {
            body: {
                contact: '1111111111',
                pass: 'washerman1'
            }
        };

        const res = await request(app).post('/session/washerman/login').send(req.body);
        expect(res.status).toEqual(200);
        expect(res.body).toEqual({ message: 'Washerman logged in successfully' });
    });

    test('washerman login with invalid credentials', async () => {
        const req = {
            body: {
                contact: 1111111111,
                pass: 'invalid_password'
            }
        };

        const res = await request(app).post('/session/washerman/login').send(req.body);
        expect(res.status).toEqual(401);
        expect(res.body).toEqual({ message: 'Invalid credentials' });
    });

    test('washerman login with non-existing contact', async () => {
        const req = {
            body: {
                contact: 'non_existing_contact',
                pass: 'washerman1'
            }
        };

        const res = await request(app).post('/session/washerman/login').send(req.body);
        expect(res.status).toEqual(401);
        expect(res.body).toEqual({ message: 'Washerman not found' });
    });
});
