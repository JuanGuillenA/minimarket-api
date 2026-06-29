import app from './app';
import { connectDatabase } from './config/db';
const PORT = process.env.PORT || 5001;
const startServer = async () => {
try {
await connectDatabase();
app.listen(PORT, () => {
console.log(`Server executing on port ${PORT}`);
});
} catch (error) {
console.error('Error starting server:', error);
}
};
startServer();