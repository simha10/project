"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const surveyRoutes_1 = __importDefault(require("./routes/surveyRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
/* console.log('userRoutes imported:', userRoutes); */
// Removed to prevent verbose logging of router object
// Load environment variables
dotenv_1.default.config();
// Initialize Express app
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
/* console.log('Mounting userRoutes at /users'); */
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/auth', authRoutes_1.default);
app.use('/survey', surveyRoutes_1.default);
app.use('/users', userRoutes_1.default);
// Health check route
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});
// Error handling middleware
app.use((err, req, res, next) => {
    //console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});
// Catch-all route for unknown endpoints to return JSON error
app.use((req, res) => {
    res.status(404).json({ error: `Cannot ${req.method} ${req.originalUrl}` });
});
// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
