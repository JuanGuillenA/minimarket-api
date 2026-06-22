import { ClientsRepository } from '../../repositories/clients/Clients.repository';

export class ClientsService {
    private clientsRepo: ClientsRepository;

    constructor() {
        this.clientsRepo = new ClientsRepository();
    }

    async getClients() {
        return await this.clientsRepo.fetchAllClients();
    }

    async createClient(data: any) {
        if (!data.name || !data.identification || !data.phone || !data.email) {
            throw new Error('Datos obligatorios del cliente incompletos');
        }
        return await this.clientsRepo.saveClient(data);
    }

    async updateClient(clientId: string, data: any) {
        return await this.clientsRepo.updateClient(clientId, data);
    }
}
