import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { SupplyService } from '../supply/Supply.service';
import { SupplyRepository } from '../../repositories/supply/Supply.repository';

jest.mock('../../repositories/supply/Supply.repository');

describe('Supply Service', () => {
  let supplyService: SupplyService;
  const mockRepo = new SupplyRepository() as jest.Mocked<SupplyRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    supplyService = new SupplyService();
    (supplyService as any).supplyRepo = mockRepo;
  });

  it('Debería retornar una lista de proveedores activos', async () => {
    const mockSuppliers = [
      { _id: '1', companyName: 'Proveedor ABC', contactEmail: 'contacto@abc.com' }
    ];
    mockRepo.fetchActiveSuppliers.mockResolvedValue(mockSuppliers as any);

    const result = await supplyService.getSuppliersList();

    expect(result).toEqual(mockSuppliers);
    expect(mockRepo.fetchActiveSuppliers).toHaveBeenCalledTimes(1);
  });

  it('Debería lanzar error si faltan datos en registerNewSupplier', async () => {
    const invalidData = { companyName: 'Empresa Incompleta' };

    await expect(supplyService.registerNewSupplier(invalidData))
      .rejects.toThrow('Faltan datos obligatorios del proveedor');
  });

  it('Debería calcular el costo total y registrar la orden de reposición', async () => {
    const orderData = {
      supplierId: '123',
      itemsReceived: [
        { articleCode: 'A1', quantity: 10, unitCost: 1.5 },
        { articleCode: 'A2', quantity: 5, unitCost: 2.0 }
      ]
    };
    mockRepo.saveRestockOrder.mockImplementation(async (data) => data as any);

    const result: any = await supplyService.registerRestockEntry(orderData);

    expect(result.totalOrderCost).toBe(25);
    expect(mockRepo.saveRestockOrder).toHaveBeenCalledTimes(1);
  });
});