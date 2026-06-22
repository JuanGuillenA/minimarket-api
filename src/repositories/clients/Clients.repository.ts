import Client from '../../models/clients/Clients.model';

export class ClientsRepository {
    async fetchAllClients() {
        return await Client.find({ isActive: true });
    }

    async fetchClientById(clientId: string) {
        return await Client.findById(clientId);
    }

    async saveClient(clientData: any) {
        const newClient = new Client(clientData);
        return await newClient.save();
    }

    async updateClient(clientId: string, updateData: any) {
        return await Client.findByIdAndUpdate(clientId, updateData, { new: true });
    }
}
