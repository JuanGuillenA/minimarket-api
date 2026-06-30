import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import request from 'supertest';
import app from '../../app';
import { ClientsService } from '../../services/clients/Clients.service';

describe('Clients Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /api/v1/clients - Debería obtener los clientes', async () => {
    jest.spyOn(ClientsService.prototype, 'getClients').mockResolvedValue([] as any);
    const res = await request(app).get('/api/v1/clients');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
  });

  it('POST /api/v1/clients - Debería crear un cliente', async () => {
    jest.spyOn(ClientsService.prototype, 'createClient').mockResolvedValue({} as any);
    const res = await request(app).post('/api/v1/clients').send({ name: 'A', identification: '1', phone: '1', email: 'a@a.com' });
    expect([200, 201]).toContain(res.status);
  });

  it('PUT /api/v1/clients/:id - Debería actualizar un cliente', async () => {
    jest.spyOn(ClientsService.prototype, 'updateClient').mockResolvedValue({} as any);
    const res = await request(app).put('/api/v1/clients/1').send({ phone: '2' });
    expect(res.status).toBe(200);
  });
});