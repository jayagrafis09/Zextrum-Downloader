import express from 'express';
const router = express.Router();

// GET /api/info?url=<youtube_url>
router.get('/', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    // TODO: Implement video info extraction using yt-dlp
    res.json({
      message: 'Video info endpoint - to be implemented',
      url,
      info: {
        title: 'Example Video',
        duration: 600,
        thumbnail: 'https://via.placeholder.com/320x180'
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
