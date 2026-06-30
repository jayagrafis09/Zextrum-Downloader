// Configuration constants
export const CONFIG = {
  // Rate Limiting
  RATE_LIMIT: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 50, // 50 requests per window
    message: 'Too many requests, please try again later'
  },

  // File Size Limits (in bytes)
  FILE_LIMITS: {
    maxDownloadSize: 500 * 1024 * 1024, // 500MB
    maxAudioSize: 200 * 1024 * 1024, // 200MB
    maxSubtitleSize: 10 * 1024 * 1024 // 10MB
  },

  // Timeout Settings (in milliseconds)
  TIMEOUT: {
    download: 10 * 60 * 1000, // 10 minutes
    conversion: 5 * 60 * 1000, // 5 minutes
    info: 30 * 1000 // 30 seconds
  },

  // Supported Formats
  FORMATS: {
    video: ['highest', '4k', '1080p', '720p', '480p', '360p', 'worst'],
    audio: ['mp3', 'm4a', 'wav'],
    subtitle: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'zh', 'ar']
  },

  // Quality Settings
  QUALITY: {
    audio: {
      low: 64,    // 64 kbps
      medium: 128, // 128 kbps
      high: 192    // 192 kbps
    }
  },

  // Error Messages
  ERRORS: {
    INVALID_URL: 'Invalid YouTube URL format',
    MISSING_URL: 'YouTube URL is required',
    INVALID_QUALITY: 'Invalid video quality',
    INVALID_FORMAT: 'Invalid audio format',
    FILE_TOO_LARGE: 'File size exceeds maximum limit',
    DOWNLOAD_TIMEOUT: 'Download took too long',
    CONVERSION_FAILED: 'Audio conversion failed',
    FFMPEG_NOT_AVAILABLE: 'FFmpeg is not available',
    RATE_LIMIT_EXCEEDED: 'Too many requests, please try again later',
    INTERNAL_ERROR: 'An unexpected error occurred'
  }
};

export default CONFIG;
