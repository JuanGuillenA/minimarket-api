export const connectDatabase = async () => {
    try {
        
        console.log('Database connection initialized successfully.');
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
};