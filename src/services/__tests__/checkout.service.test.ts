// src/services/__tests__/checkout.service.test.ts
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { CheckoutService } from '../checkout/Checkout.service';
import { CheckoutRepository } from '../../repositories/checkout/Checkout.repository';
import { InventoryRepository } from '../../repositories/inventory/Inventory.repository';
// Mockeamos ambas clases de repositorios
jest.mock('../../repositories/checkout/Checkout.repository');
jest.mock('../../repositories/inventory/Inventory.repository');
describe('Checkout Service', () => {
 let checkoutService: CheckoutService;
 // Instanciamos los mocks
 const mockCheckoutRepo = new CheckoutRepository() as jest.Mocked<CheckoutRepository>;
 const mockInventoryRepo = new InventoryRepository() as jest.Mocked<InventoryRepository>;
 beforeEach(() => {
 jest.clearAllMocks();
 checkoutService = new CheckoutService();
 // Inyectamos los mocks manualmente
 (checkoutService as any).checkoutRepo = mockCheckoutRepo;
 (checkoutService as any).inventoryRepo = mockInventoryRepo;
 });
 it('Debería obtener todas las cajas registradas', async () => {
 const mockRegisters = [{ _id: '1', registerNumber: 1, currentBalance: 100 }];
 mockCheckoutRepo.fetchAllRegisters.mockResolvedValue(mockRegisters as any);
 const result = await checkoutService.getCashRegisters();
 expect(result).toEqual(mockRegisters);
 expect(mockCheckoutRepo.fetchAllRegisters).toHaveBeenCalledTimes(1);
 });
 it('Debería procesar una venta descontando stock y actualizando la caja', async () => {
 const saleData = {
 registerId: 'caja1',
 paymentMethod: 'cash',
 itemsSold: [{ articleCode: 'ART1', quantity: 2, unitPrice: 5 }], // Subtotal: 10
 discount: 2 // Total Amount: 8
 };
 // Simulamos que el artículo existe en el inventario y tiene suficiente stock
 mockInventoryRepo.findArticleByBarcode.mockResolvedValue({ _id: 'art_id', stockLevel: 10 }
as any);
 mockInventoryRepo.updateArticleStock.mockResolvedValue(true as any);
 mockInventoryRepo.saveInventoryMovement.mockResolvedValue(true as any);
 
 mockCheckoutRepo.updateRegisterBalance.mockResolvedValue(true as any);
 mockCheckoutRepo.saveCashMovement.mockResolvedValue(true as any);
 mockCheckoutRepo.saveTransaction.mockImplementation(async (data) => data as any);
 const result: any = await checkoutService.processSale(saleData);
 // Verificamos que los cálculos matemáticos se hayan hecho bien
 expect(result.subtotal).toBe(10);
 expect(result.totalAmount).toBe(8);
 // Verificamos que llamó al inventario para descontar stock
 expect(mockInventoryRepo.updateArticleStock).toHaveBeenCalledWith('art_id', -2);
 });
 it('Debería lanzar error si se intenta vender algo sin stock suficiente', async () => {
 const saleData = {
 registerId: 'caja1', paymentMethod: 'cash',
 itemsSold: [{ articleCode: 'ART1', quantity: 5, unitPrice: 5 }]
 };
 // Simulamos que el inventario solo tiene 2 unidades disponibles
 mockInventoryRepo.findArticleByBarcode.mockResolvedValue({ stockLevel: 2 } as any);
 await expect(checkoutService.processSale(saleData))
 .rejects.toThrow('Stock insuficiente para el artículo ART1');
 });
 it('Debería cerrar la caja y calcular la diferencia exacta', async () => {
 const closeData = { registerId: 'caja1', countedBalance: 150 };
 
 // Simulamos que el sistema esperaba que hubieran 160
 mockCheckoutRepo.findRegisterById.mockResolvedValue({ currentBalance: 160 } as any);
 mockCheckoutRepo.closeRegister.mockImplementation(async (id, data) => data as any);
 const result: any = await checkoutService.closeRegister(closeData);
 // Verificamos que haya detectado el faltante de -10
 expect(result.difference).toBe(-10);
 });
});