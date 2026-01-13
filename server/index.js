const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const { generateQuiz } = require('./aiService');
const setupSocketHandlers = require('./socketHandler');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// API Routes
app.post('/api/generate-quiz', async (req, res) => {
    const { topic } = req.body;
    if (!topic) {
        return res.status(400).json({ error: 'Topic is required' });
    }

    try {
        const questions = await generateQuiz(topic);
        res.json({ questions });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate quiz' });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.send('Server is running');
});

// Socket setup
setupSocketHandlers(io);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
