// src/routes/__tests__/checkout.routes.test.ts
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import request from 'supertest';
import app from '../../app';
import { CheckoutService } from '../../services/checkout/Checkout.service';
describe('Checkout Routes & Controllers', () => {
 beforeEach(() => {
 jest.clearAllMocks();
 });
 it('GET /api/v1/checkout/registers - Debería obtener las cajas y retornar 200', async () => {
 const mockData = [{ _id: '1', registerNumber: 1 }];
 
 jest.spyOn(CheckoutService.prototype, 'getCashRegisters').mockResolvedValue(mockData as
any);
 const response = await request(app).get('/api/v1/checkout/registers');
 expect(response.status).toBe(200);
 expect(response.body).toHaveProperty('success', true);
 });
 it('POST /api/v1/checkout/transactions - Debería procesar una venta y retornar 201 o 200',
async () => {
 const saleData = {
 registerId: '123', paymentMethod: 'cash',
 itemsSold: [{ articleCode: 'ART1', quantity: 2, unitPrice: 5 }]
 };
 
 jest.spyOn(CheckoutService.prototype, 'processSale').mockResolvedValue(saleData as any);
 const response = await request(app)
 .post('/api/v1/checkout/transactions')
 .send(saleData);
 expect([200, 201]).toContain(response.status);
 expect(response.body).toHaveProperty('success', true);
 });
 it('POST /api/v1/checkout/movements - Debería registrar un movimiento y retornar 201 o 200',
async () => {
 const movementData = { registerId: '123', type: 'income', amount: 50, paymentMethod: 'cash' };
 
 jest.spyOn(CheckoutService.prototype,
'addCashMovement').mockResolvedValue(movementData as any);
 const response = await request(app)
 .post('/api/v1/checkout/movements')
 .send(movementData);
 expect([200, 201]).toContain(response.status);
 expect(response.body).toHaveProperty('success', true);
 });
 it('POST /api/v1/checkout/close - Debería cerrar caja y retornar 200', async () => {
 const closeData = { registerId: '123', countedBalance: 150 };
 
 jest.spyOn(CheckoutService.prototype, 'closeRegister').mockResolvedValue(closeData as
any);
 const response = await request(app)
 .post('/api/v1/checkout/close')
 .send(closeData);
 expect(response.status).toBe(200);
 expect(response.body).toHaveProperty('success', true);
 });
});