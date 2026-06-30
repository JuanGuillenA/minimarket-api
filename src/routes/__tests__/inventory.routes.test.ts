import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import request from 'supertest';
import app from '../../app';
import { InventoryService } from '../../services/inventory/Inventory.service';

describe('Inventory Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('POST /api/v1/inventory/movements - Debería registrar movimiento', async () => {
    jest.spyOn(InventoryService.prototype, 'recordMovement').mockResolvedValue({} as any);
    const res = await request(app).post('/api/v1/inventory/movements').send({ productId: '1', type: 'entry', quantity: 5, reference: 'Ref' });
    expect([200, 201]).toContain(res.status);
    expect(res.body).toHaveProperty('success', true);
  });
});