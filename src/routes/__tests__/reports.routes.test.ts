import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import request from 'supertest';
import app from '../../app';
import { ReportsService } from '../../services/reports/Reports.service';

describe('Reports Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /api/v1/reports/inventory - Debería obtener reporte', async () => {
    jest.spyOn(ReportsService.prototype, 'generateInventoryReport').mockResolvedValue([] as any);
    const res = await request(app).get('/api/v1/reports/inventory');
    expect(res.status).toBe(200);
  });

  it('GET /api/v1/reports/sales - Debería obtener reporte', async () => {
    jest.spyOn(ReportsService.prototype, 'generateSalesReport').mockResolvedValue([] as any);
    const res = await request(app).get('/api/v1/reports/sales');
    expect(res.status).toBe(200);
  });

  it('GET /api/v1/reports/clients - Debería obtener reporte', async () => {
    jest.spyOn(ReportsService.prototype, 'generateClientsReport').mockResolvedValue([] as any);
    const res = await request(app).get('/api/v1/reports/clients');
    expect(res.status).toBe(200);
  });
});