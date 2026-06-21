import express, { Application } from 'express';
import cors from 'cors';
import { connectDatabase } from './config/db';
import { setupSwagger } from './config/swagger';

class AppServer {
    public app: Application;
    private port: string | number;

    constructor() {
        this.app = express();
        this.port = 4000;
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