import dotenv from 'dotenv';
dotenv.config(); // <- Esta es la línea mágica que lee el archivo .env

import express, { Application } from 'express';
import cors from 'cors';
import { connectDatabase } from './config/db';
import { setupSwagger } from './config/swagger';
import catalogRoutes from './routes/catalog.routes';
import supplyRoutes from './routes/supply.routes';
import checkoutRoutes from './routes/checkout.routes';
import accessRoutes from './routes/access.routes';


class AppServer {
    public app: Application;
    private port: string | number;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || 5001;
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

        // Conectar todos los módulos del Minimarket
        this.app.use('/api/v1/catalog', catalogRoutes);
        this.app.use('/api/v1/supply', supplyRoutes);
        this.app.use('/api/v1/checkout', checkoutRoutes);
        this.app.use('/api/v1/access', accessRoutes);
    }

    public async start(): Promise<void> {
        await connectDatabase();
        this.app.listen(this.port, () => {
            console.log(`Server executing on port ${this.port}`);
        });
    }
}

const server = new AppServer();
server.start();