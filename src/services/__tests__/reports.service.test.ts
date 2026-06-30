import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { ReportsService } from '../reports/Reports.service';

// Usamos mockImplementation(async () => ...) para evitar el error de tipo "never" de TypeScript
jest.mock('../../models/catalog/Articles.model', () => ({
  __esModule: true,
  default: { 
    find: jest.fn().mockReturnValue({ 
      select: jest.fn().mockImplementation(async () => [{ name: 'Articulo1' }]) 
    }) 
  }
}));

jest.mock('../../models/checkout/Transactions.model', () => ({
  __esModule: true,
  default: { 
    find: jest.fn().mockReturnValue({ 
      select: jest.fn().mockImplementation(async () => [{ totalAmount: 100 }]) 
    }),
    aggregate: jest.fn().mockImplementation(async () => [{ name: 'Cliente Frecuente' }])
  }
}));

describe('Reports Service', () => {
  let reportsService: ReportsService;

  beforeEach(() => {
    jest.clearAllMocks();
    reportsService = new ReportsService();
  });

  it('Debería generar reporte de inventario', async () => {
    const result = await reportsService.generateInventoryReport();
    expect(result).toHaveLength(1);
  });

  it('Debería generar reporte de ventas', async () => {
    const result = await reportsService.generateSalesReport();
    expect(result).toHaveLength(1);
  });

  it('Debería generar reporte de clientes', async () => {
    const result = await reportsService.generateClientsReport();
    expect(result).toHaveLength(1);
  });
});