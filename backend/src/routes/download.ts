import express from 'express';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import {
  downloadVideo,
  downloadAudio as downloadAudioYtdlp,
  downloadSubtitles
} from '../services/downloadService';
import {
  convertToMp3,
  convertToM4a,
  convertToWav,
  extractAudio,
  getAudioInfo
} from '../services/ffmpegService';

const router = express.Router();
const unlinkAsync = promisify(fs.unlink);

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
      sizeInMB: (result.size / 1024 / 1024).toFixed(2) + ' MB',
      downloadUrl: `/downloads/${result.filename}`
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

    const validFormats = ['mp3', 'm4a', 'wav'];
    const selectedFormat = validFormats.includes(format) ? format : 'mp3';

    console.log(`Downloading audio: ${url} (format: ${selectedFormat})`);

    // Download best audio with yt-dlp
    const ytdlpResult = await downloadAudioYtdlp(url, 'best');
    const inputPath = ytdlpResult.path;
    
    // If format is not mp3, convert it
    let finalResult = ytdlpResult;
    if (selectedFormat !== 'mp3') {
      const downloadPath = process.env.DOWNLOAD_PATH || './downloads';
      const timestamp = Date.now();
      const outputPath = path.join(
        downloadPath,
        `audio_${timestamp}_converted.${selectedFormat}`
      );

      console.log(`Converting audio to ${selectedFormat}...`);

      if (selectedFormat === 'm4a') {
        await convertToM4a(inputPath, outputPath, 'high');
      } else if (selectedFormat === 'wav') {
        await convertToWav(inputPath, outputPath);
      }

      // Clean up original file
      try {
        await unlinkAsync(inputPath);
      } catch (err) {
        console.warn('Failed to delete original audio file');
      }

      const stats = fs.statSync(outputPath);
      finalResult = {
        filename: path.basename(outputPath),
        path: outputPath,
        size: stats.size
      };
    }

    // Get audio info
    const audioInfo = await getAudioInfo(finalResult.path);

    res.json({
      success: true,
      message: 'Audio downloaded successfully',
      filename: finalResult.filename,
      format: selectedFormat,
      size: finalResult.size,
      sizeInMB: (finalResult.size / 1024 / 1024).toFixed(2) + ' MB',
      duration: audioInfo.duration,
      bitrate: audioInfo.bitrate,
      sampleRate: audioInfo.sampleRate,
      channels: audioInfo.channels,
      codec: audioInfo.codec,
      downloadUrl: `/downloads/${finalResult.filename}`
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
      sizeInKB: (result.size / 1024).toFixed(2) + ' KB',
      downloadUrl: `/downloads/${result.filename}`
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
