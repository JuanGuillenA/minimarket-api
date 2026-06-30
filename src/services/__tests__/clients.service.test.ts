import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { ClientsService } from '../clients/Clients.service';
import { ClientsRepository } from '../../repositories/clients/Clients.repository';

jest.mock('../../repositories/clients/Clients.repository');

describe('Clients Service', () => {
  let clientsService: ClientsService;
  const mockRepo = new ClientsRepository() as jest.Mocked<ClientsRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    clientsService = new ClientsService();
    (clientsService as any).clientsRepo = mockRepo;
  });

  it('Debería obtener la lista de clientes', async () => {
    const mockClients = [{ _id: '1', name: 'María' }];
    mockRepo.fetchAllClients.mockResolvedValue(mockClients as any);

    const result = await clientsService.getClients();
    expect(result).toEqual(mockClients);
  });

  it('Debería crear un cliente exitosamente', async () => {
    const newClient = { name: 'Juan', identification: '123', phone: '099', email: 'j@j.com' };
    mockRepo.saveClient.mockResolvedValue({ _id: '2', ...newClient } as any);

    const result: any = await clientsService.createClient(newClient);
    expect(result.name).toBe('Juan');
  });

  it('Debería lanzar error al crear si faltan datos', async () => {
    await expect(clientsService.createClient({ name: 'Incompleto' }))
      .rejects.toThrow('Datos obligatorios del cliente incompletos');
  });

  it('Debería actualizar un cliente', async () => {
    mockRepo.updateClient.mockResolvedValue(true as any);
    const result = await clientsService.updateClient('1', { phone: '098' });
    expect(result).toBe(true);
  });
});