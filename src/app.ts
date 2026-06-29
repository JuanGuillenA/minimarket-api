import dotenv from 'dotenv';
dotenv.config();
import express, { Application } from 'express';
import cors from 'cors';
import { setupSwagger } from './config/swagger';
import catalogRoutes from './routes/catalog.routes';
import supplyRoutes from './routes/supply.routes';
import checkoutRoutes from './routes/checkout.routes';
import accessRoutes from './routes/access.routes';
import clientsRoutes from './routes/clients.routes';
import inventoryRoutes from './routes/inventory.routes';
import reportsRoutes from './routes/reports.routes';
class AppServer {
public app: Application;
constructor() {
this.app = express();
this.initializeMiddlewares();
this.initializeRoutes();
}
private initializeMiddlewares(): void {
this.app.use(cors());
this.app.use(express.json());
setupSwagger(this.app);
}
private initializeRoutes(): void {
this.app.get('/api/v1/health', (req, res) => {
res.status(200).json({ status: 'Super Store API is up and running' });
});
this.app.use('/api/v1/catalog', catalogRoutes);
this.app.use('/api/v1/supply', supplyRoutes);
this.app.use('/api/v1/checkout', checkoutRoutes);
this.app.use('/api/v1/access', accessRoutes);
this.app.use('/api/v1/clients', clientsRoutes);
this.app.use('/api/v1/inventory', inventoryRoutes);
this.app.use('/api/v1/reports', reportsRoutes);
}
}
export default new AppServer().app;