import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
    try {
        const dbUri = process.env.DATABASE_URL;
        
        if (!dbUri) {
            throw new Error('La variable DATABASE_URL no está definida en el archivo .env');
        }

        await mongoose.connect(dbUri);
        console.log('Database connection initialized successfully.');
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1); 
    }
};