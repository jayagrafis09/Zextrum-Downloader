import express from 'express';
import { getVideoInfo } from '../services/downloadService';
import { verifyFFmpeg } from '../services/ffmpegService';

const router = express.Router();

// GET /api/info?url=<youtube_url>
router.get('/', async (req, res) => {
  try {
    const { url } = req.query;

    // Validation
    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    if (typeof url !== 'string' || !isValidYouTubeUrl(url)) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    console.log(`Fetching info for: ${url}`);

    const videoInfo = await getVideoInfo(url);

    res.json({
      success: true,
      data: videoInfo
    });
  } catch (error: any) {
    console.error('Get video info error:', error);
    res.status(500).json({
      error: 'Failed to fetch video information',
      details: error.message
    });
  }
});

// GET /api/info/system - Check system dependencies
router.get('/system', async (req, res) => {
  try {
    const ffmpegAvailable = await verifyFFmpeg();

    res.json({
      success: true,
      system: {
        ffmpeg: ffmpegAvailable ? '✅ Available' : '❌ Not available',
        node: process.version,
        platform: process.platform
      }
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to check system info',
      details: error.message
    });
  }
});

/**
 * Helper: Validate YouTube URL
 */
function isValidYouTubeUrl(url: string): boolean {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube|youtu|youtube-nocookie)\.(com|be)\//;
  return youtubeRegex.test(url);
}

export default router;
