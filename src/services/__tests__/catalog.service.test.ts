// src/services/__tests__/catalog.service.test.ts 
import { describe, it, expect, jest, beforeEach } from '@jest/globals'; 
import { CatalogService } from '../catalog/Catalog.service'; 
import { CatalogRepository } from '../../repositories/catalog/Catalog.repository'; 
// 1. Mockeamos la clase completa del repositorio 
jest.mock('../../repositories/catalog/Catalog.repository'); 
describe('Catalog Service', () => { 
let catalogService: CatalogService; 
// Obtenemos una referencia al mock para poder controlar sus métodos 
const mockRepo = new CatalogRepository() as jest.Mocked<CatalogRepository>; 
beforeEach(() => { 
jest.clearAllMocks(); 
catalogService = new CatalogService(); 
// Inyectamos nuestro mock en lugar de la instancia real 
(catalogService as any).catalogRepo = mockRepo; 
}); 
it('Debería retornar una lista de artículos exitosamente', async () => { 
// Datos de prueba falsos 
const mockArticles = [ 
{ _id: '1', name: 'Leche', retailPrice: 1.25 }, 
{ _id: '2', name: 'Pan', retailPrice: 0.50 } 
]; 
// Configuramos la respuesta del repositorio 
mockRepo.fetchAllArticles.mockResolvedValue(mockArticles as any); 
// Ejecutamos el servicio 
const result = await catalogService.getInventoryList(); 
// Validamos 
expect(result).toEqual(mockArticles); 
expect(mockRepo.fetchAllArticles).toHaveBeenCalledTimes(1); 
}); 
it('Debería lanzar error si faltan datos obligatorios en createNewArticle', async () => { 
const invalidData = { name: 'Producto incompleto' }; // Falta barcode y retailPrice 
await expect(catalogService.createNewArticle(invalidData)) 
.rejects.toThrow('Faltan datos obligatorios para el artículo'); 
}); 
}); 