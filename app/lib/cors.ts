import cors from 'cors';

// Wrap the cors middleware
const corsMiddleware = cors({
  origin: ['https://ucse-iw-2024.onrender.com/', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

export default corsMiddleware;