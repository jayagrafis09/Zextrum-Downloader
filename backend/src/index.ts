import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { verifyFFmpeg } from './services/ffmpegService';
import downloadRoutes from './routes/download';
import infoRoutes from './routes/info';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const DOWNLOAD_PATH = process.env.DOWNLOAD_PATH || './downloads';

// Ensure downloads directory exists
if (!fs.existsSync(DOWNLOAD_PATH)) {
  fs.mkdirSync(DOWNLOAD_PATH, { recursive: true });
}

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for downloads
app.use('/downloads', express.static(DOWNLOAD_PATH));

// Health Check
app.get('/api/health', async (req, res) => {
  const ffmpegAvailable = await verifyFFmpeg();
  res.json({
    status: 'ok',
    message: 'Zextrum Downloader API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    ffmpeg: ffmpegAvailable ? '✅ Available' : '❌ Not available'
  });
});

// API Routes
app.use('/api/download', downloadRoutes);
app.use('/api/info', infoRoutes);

// 404 Handler
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`\n🚀 Zextrum Downloader API running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 CORS origin: ${process.env.FRONTEND_URL}`);
  console.log(`📁 Download path: ${DOWNLOAD_PATH}`);
  console.log(`🎬 FFmpeg configured at: ${process.env.FFMPEG_PATH || 'system default'}\n`);
});

export default app;
