// src/routes/__tests__/health.test.ts
import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import app from '../../app';
describe('Health Check Endpoint', () => {
it('Debería retornar un código 200 y confirmar que la API funciona', async () => {
const response = await request(app).get('/api/v1/health');
expect(response.status).toBe(200);
expect(response.body).toBeDefined();
expect(response.body.status).toBe('Super Store API is up and running');
});
});