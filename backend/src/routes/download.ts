import express from 'express';
import {
  downloadVideo,
  downloadAudio,
  downloadSubtitles
} from '../services/downloadService';

const router = express.Router();

// POST /api/download/video
router.post('/video', async (req, res) => {
  try {
    const { url, quality } = req.body;

    // Validation
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    if (typeof url !== 'string' || !isValidYouTubeUrl(url)) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    const validQualities = ['highest', '4k', '1080p', '720p', '480p', '360p', 'worst'];
    const selectedQuality = validQualities.includes(quality) ? quality : 'highest';

    console.log(`Downloading video: ${url} (quality: ${selectedQuality})`);

    const result = await downloadVideo(url, selectedQuality);

    res.json({
      success: true,
      message: 'Video downloaded successfully',
      filename: result.filename,
      size: result.size,
      sizeInMB: (result.size / 1024 / 1024).toFixed(2) + ' MB'
    });
  } catch (error: any) {
    console.error('Download video error:', error);
    res.status(500).json({
      error: 'Failed to download video',
      details: error.message
    });
  }
});

// POST /api/download/audio
router.post('/audio', async (req, res) => {
  try {
    const { url, format } = req.body;

    // Validation
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    if (typeof url !== 'string' || !isValidYouTubeUrl(url)) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    const validFormats = ['mp3', 'm4a', 'wav', 'opus', 'vorbis'];
    const selectedFormat = validFormats.includes(format) ? format : 'mp3';

    console.log(`Downloading audio: ${url} (format: ${selectedFormat})`);

    const result = await downloadAudio(url, selectedFormat);

    res.json({
      success: true,
      message: 'Audio downloaded successfully',
      filename: result.filename,
      format: selectedFormat,
      size: result.size,
      sizeInMB: (result.size / 1024 / 1024).toFixed(2) + ' MB'
    });
  } catch (error: any) {
    console.error('Download audio error:', error);
    res.status(500).json({
      error: 'Failed to download audio',
      details: error.message
    });
  }
});

// POST /api/download/subtitles
router.post('/subtitles', async (req, res) => {
  try {
    const { url, language } = req.body;

    // Validation
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    if (typeof url !== 'string' || !isValidYouTubeUrl(url)) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    const selectedLanguage = language || 'en';

    console.log(`Downloading subtitles: ${url} (language: ${selectedLanguage})`);

    const result = await downloadSubtitles(url, selectedLanguage);

    res.json({
      success: true,
      message: 'Subtitles downloaded successfully',
      filename: result.filename,
      language: selectedLanguage,
      size: result.size,
      sizeInKB: (result.size / 1024).toFixed(2) + ' KB'
    });
  } catch (error: any) {
    console.error('Download subtitles error:', error);
    res.status(500).json({
      error: 'Failed to download subtitles',
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
