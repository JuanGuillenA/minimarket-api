import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { InventoryService } from '../inventory/Inventory.service';
import { InventoryRepository } from '../../repositories/inventory/Inventory.repository';

jest.mock('../../repositories/inventory/Inventory.repository');

describe('Inventory Service', () => {
  let inventoryService: InventoryService;
  const mockRepo = new InventoryRepository() as jest.Mocked<InventoryRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    inventoryService = new InventoryService();
    (inventoryService as any).inventoryRepo = mockRepo;
  });

  it('Debería registrar un ingreso de inventario', async () => {
    const data = { productId: 'PROD1', type: 'entry', quantity: 10, reference: 'Compra' };
    mockRepo.findArticleByBarcode.mockResolvedValue({ _id: '1', stockLevel: 5 } as any);
    mockRepo.updateArticleStock.mockResolvedValue(true as any);
    mockRepo.saveInventoryMovement.mockResolvedValue(true as any);

    await inventoryService.recordMovement(data);
    expect(mockRepo.updateArticleStock).toHaveBeenCalledWith('1', 10);
  });

  it('Debería lanzar error si hay stock insuficiente en salida', async () => {
    const data = { productId: 'PROD1', type: 'exit', quantity: 20, reference: 'Venta' };
    mockRepo.findArticleByBarcode.mockResolvedValue({ _id: '1', stockLevel: 5 } as any);

    await expect(inventoryService.recordMovement(data))
      .rejects.toThrow('Stock insuficiente para el movimiento');
  });

  it('Debería lanzar error si faltan datos', async () => {
    await expect(inventoryService.recordMovement({ productId: '1' }))
      .rejects.toThrow('Datos incompletos para movimiento de inventario');
  });
});