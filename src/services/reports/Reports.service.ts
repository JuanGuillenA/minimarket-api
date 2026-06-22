import Article from '../../models/catalog/Articles.model';
import Transaction from '../../models/checkout/Transactions.model';
import Client from '../../models/clients/Clients.model';

export class ReportsService {
    async generateInventoryReport() {
        return await Article.find({}).select('barcode name stockLevel retailPrice sectionId');
    }

    async generateSalesReport() {
        return await Transaction.find({}).select('registerId paymentMethod subtotal discount totalAmount itemsSold createdAt');
    }

    async generateClientsReport() {
        return await Transaction.aggregate([
            { $match: { clientId: { $ne: null } } },
            {
                $group: {
                    _id: '$clientId',
                    totalPurchases: { $sum: 1 },
                    totalAmount: { $sum: '$totalAmount' }
                }
            },
            {
                $lookup: {
                    from: 'clients',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'client'
                }
            },
            { $unwind: '$client' },
            {
                $project: {
                    clientId: '$_id',
                    name: '$client.name',
                    identification: '$client.identification',
                    totalPurchases: 1,
                    totalAmount: 1
                }
            },
            { $sort: { totalAmount: -1 } }
        ]);
    }
}
