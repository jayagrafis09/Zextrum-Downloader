import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import { VideoInfo, Format, Subtitle } from '../types';

const execAsync = promisify(exec);
const downloadPath = process.env.DOWNLOAD_PATH || './downloads';
const ytdlpPath = process.env.YTDLP_PATH || 'yt-dlp';

// Ensure downloads directory exists
if (!fs.existsSync(downloadPath)) {
  fs.mkdirSync(downloadPath, { recursive: true });
}

/**
 * Get video information from YouTube URL
 */
export const getVideoInfo = async (url: string): Promise<VideoInfo> => {
  try {
    const command = `${ytdlpPath} --dump-json "${url}"`;
    const { stdout } = await execAsync(command);
    const info = JSON.parse(stdout);

    return {
      id: info.id,
      title: info.title,
      description: info.description || '',
      duration: info.duration || 0,
      thumbnail: info.thumbnail,
      uploader: info.uploader,
      formats: parseFormats(info.formats),
      subtitles: parseSubtitles(info.subtitles)
    };
  } catch (error: any) {
    throw new Error(`Failed to fetch video info: ${error.message}`);
  }
};

/**
 * Download video from YouTube
 */
export const downloadVideo = async (
  url: string,
  quality: string = 'highest'
): Promise<{ filename: string; path: string; size: number }> => {
  try {
    const timestamp = Date.now();
    const outputTemplate = path.join(
      downloadPath,
      `video_${timestamp}_%(title)s.%(ext)s`
    );

    // Map quality to format selection
    const formatSelection = mapQualityToFormat(quality);

    const command = `${ytdlpPath} -f "${formatSelection}" -o "${outputTemplate}" "${url}"`;
    const { stdout } = await execAsync(command);

    // Find downloaded file
    const files = fs.readdirSync(downloadPath);
    const downloadedFile = files.find(f => f.includes(`video_${timestamp}`));

    if (!downloadedFile) {
      throw new Error('Downloaded file not found');
    }

    const filePath = path.join(downloadPath, downloadedFile);
    const stats = fs.statSync(filePath);

    return {
      filename: downloadedFile,
      path: filePath,
      size: stats.size
    };
  } catch (error: any) {
    throw new Error(`Failed to download video: ${error.message}`);
  }
};

/**
 * Download audio from YouTube
 */
export const downloadAudio = async (
  url: string,
  format: string = 'mp3'
): Promise<{ filename: string; path: string; size: number }> => {
  try {
    const timestamp = Date.now();
    const outputTemplate = path.join(
      downloadPath,
      `audio_${timestamp}_%(title)s.%(ext)s`
    );

    // Download best audio
    const command = `${ytdlpPath} -f "bestaudio" -x --audio-format ${format} -o "${outputTemplate}" "${url}"`;
    const { stdout } = await execAsync(command);

    // Find downloaded file
    const files = fs.readdirSync(downloadPath);
    const downloadedFile = files.find(f => f.includes(`audio_${timestamp}`));

    if (!downloadedFile) {
      throw new Error('Downloaded file not found');
    }

    const filePath = path.join(downloadPath, downloadedFile);
    const stats = fs.statSync(filePath);

    return {
      filename: downloadedFile,
      path: filePath,
      size: stats.size
    };
  } catch (error: any) {
    throw new Error(`Failed to download audio: ${error.message}`);
  }
};

/**
 * Download subtitles from YouTube
 */
export const downloadSubtitles = async (
  url: string,
  language: string = 'en'
): Promise<{ filename: string; path: string; size: number }> => {
  try {
    const timestamp = Date.now();
    const outputTemplate = path.join(
      downloadPath,
      `subtitles_${timestamp}_%(title)s.%(ext)s`
    );

    // Download subtitles
    const command = `${ytdlpPath} --write-subs --sub-langs ${language} --skip-download -o "${outputTemplate}" "${url}"`;
    const { stdout } = await execAsync(command);

    // Find downloaded file (could be .vtt or .srt)
    const files = fs.readdirSync(downloadPath);
    const downloadedFile = files.find(
      f => f.includes(`subtitles_${timestamp}`) && (f.endsWith('.vtt') || f.endsWith('.srt'))
    );

    if (!downloadedFile) {
      throw new Error('Subtitle file not found');
    }

    const filePath = path.join(downloadPath, downloadedFile);
    const stats = fs.statSync(filePath);

    return {
      filename: downloadedFile,
      path: filePath,
      size: stats.size
    };
  } catch (error: any) {
    throw new Error(`Failed to download subtitles: ${error.message}`);
  }
};

/**
 * Helper: Map quality string to yt-dlp format selection
 */
function mapQualityToFormat(quality: string): string {
  const qualityMap: { [key: string]: string } = {
    'highest': 'bestvideo+bestaudio/best',
    '4k': 'bestvideo[height<=2160]+bestaudio/best',
    '1080p': 'bestvideo[height<=1080]+bestaudio/best',
    '720p': 'bestvideo[height<=720]+bestaudio/best',
    '480p': 'bestvideo[height<=480]+bestaudio/best',
    '360p': 'bestvideo[height<=360]+bestaudio/best',
    'worst': 'worst'
  };

  return qualityMap[quality] || qualityMap['highest'];
}

/**
 * Helper: Parse formats from yt-dlp output
 */
function parseFormats(formats: any[]): Format[] {
  if (!formats || !Array.isArray(formats)) return [];

  return formats
    .filter(f => f.vcodec !== 'none' && f.acodec !== 'none')
    .slice(0, 10)
    .map(f => ({
      format_id: f.format_id,
      ext: f.ext,
      quality: `${f.height || 'audio only'}p`,
      filesize: f.filesize,
      fps: f.fps
    }));
}

/**
 * Helper: Parse subtitles from yt-dlp output
 */
function parseSubtitles(subtitles: any): Subtitle[] {
  if (!subtitles || typeof subtitles !== 'object') return [];

  const result: Subtitle[] = [];
  for (const [language, tracks] of Object.entries(subtitles)) {
    if (Array.isArray(tracks) && tracks[0]) {
      result.push({
        language,
        code: language,
        ext: tracks[0].ext || 'vtt'
      });
    }
  }
  return result;
}

/**
 * Clean up old files (older than 24 hours)
 */
export const cleanupOldFiles = async (): Promise<void> => {
  try {
    const files = fs.readdirSync(downloadPath);
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    for (const file of files) {
      const filePath = path.join(downloadPath, file);
      const stats = fs.statSync(filePath);
      const fileAge = now - stats.mtime.getTime();

      if (fileAge > maxAge) {
        fs.unlinkSync(filePath);
        console.log(`Cleaned up old file: ${file}`);
      }
    }
  } catch (error) {
    console.error('Error cleaning up old files:', error);
  }
};
