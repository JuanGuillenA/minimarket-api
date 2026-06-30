// src/routes/__tests__/access.routes.test.ts
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import request from 'supertest';
import app from '../../app';
import { AccessService } from '../../services/access/Access.service';

describe('Access Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /api/v1/access/roles - Debería obtener los roles', async () => {
    jest.spyOn(AccessService.prototype, 'getSystemRoles').mockResolvedValue([{ id: '1', roleName: 'Admin' }] as any);
    const response = await request(app).get('/api/v1/access/roles');
    expect(response.status).toBe(200);
  });

  it('POST /api/v1/access/roles - Debería crear un rol', async () => {
    jest.spyOn(AccessService.prototype, 'createNewRole').mockResolvedValue({} as any);
    const response = await request(app).post('/api/v1/access/roles').send({ roleName: 'Cajero', description: 'Caja' });
    expect([200, 201]).toContain(response.status);
  });

  it('GET /api/v1/access/users - Debería obtener los usuarios', async () => {
    jest.spyOn(AccessService.prototype, 'getSystemUsers').mockResolvedValue([] as any);
    const response = await request(app).get('/api/v1/access/users');
    expect(response.status).toBe(200);
  });

  it('POST /api/v1/access/users - Debería crear un usuario', async () => {
    jest.spyOn(AccessService.prototype, 'registerUser').mockResolvedValue({} as any);
    const response = await request(app).post('/api/v1/access/users').send({ username: 'juan', password: '123', fullName: 'Juan', roleId: '1' });
    expect([200, 201]).toContain(response.status);
  });

  it('POST /api/v1/access/login - Debería hacer login', async () => {
    jest.spyOn(AccessService.prototype, 'loginUser').mockResolvedValue({ token: 'jwt-token', user: {} } as any);
    const response = await request(app).post('/api/v1/access/login').send({ username: 'sebas', password: '123' });
    expect(response.status).toBe(200);
  });
});