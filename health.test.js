const request = require('supertest');
const express = require('express');

const app = express();
app.get('/', (req, res) => res.json({ message: "API is running..." }));

describe('Server Health Check', () => {
    it('GET / should return 200 and success message', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe("API is running...");
    });
});
