import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import request from 'supertest';
import app from '../../app';
import { SupplyService } from '../../services/supply/Supply.service';

describe('Supply Routes & Controllers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /api/v1/supply/suppliers - Debería obtener los proveedores y retornar status 200', async () => {
    const mockData = [{ _id: '1', companyName: 'Proveedor ABC' }];

    jest.spyOn(SupplyService.prototype, 'getSuppliersList').mockResolvedValue(mockData as any);

    const response = await request(app).get('/api/v1/supply/suppliers');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
  });

  it('POST /api/v1/supply/suppliers - Debería crear un proveedor y retornar status 201 o 200', async () => {
    const newSupplier = {
      companyName: 'Nuevo Proveedor',
      contactEmail: 'nuevo@prov.com',
      phoneNumber: '+593987654321'
    };

    jest.spyOn(SupplyService.prototype, 'registerNewSupplier').mockResolvedValue({ _id: '2', ...newSupplier } as any);

    const response = await request(app)
      .post('/api/v1/supply/suppliers')
      .send(newSupplier);

    expect([200, 201]).toContain(response.status);
    expect(response.body).toHaveProperty('success', true);
  });

  it('POST /api/v1/supply/restock - Debería crear una orden de reposición y retornar status 201 o 200', async () => {
    const restockData = {
      supplierId: '123',
      itemsReceived: [{ articleCode: 'XYZ', quantity: 20, unitCost: 1.5 }]
    };

    jest.spyOn(SupplyService.prototype, 'registerRestockEntry').mockResolvedValue({ _id: '3', ...restockData } as any);

    const response = await request(app)
      .post('/api/v1/supply/restock')
      .send(restockData);

    expect([200, 201]).toContain(response.status);
    expect(response.body).toHaveProperty('success', true);
  });
});
