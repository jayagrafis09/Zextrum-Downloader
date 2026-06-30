/**
 * Utility functions for input validation
 */

export const validateURL = (url: string): boolean => {
  if (!url || typeof url !== 'string') {
    return false;
  }

  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube|youtu|youtube-nocookie)\.(com|be)\//;
  return youtubeRegex.test(url);
};

export const validateVideoQuality = (quality: string): boolean => {
  const validQualities = ['highest', '4k', '1080p', '720p', '480p', '360p', 'worst'];
  return validQualities.includes(quality);
};

export const validateAudioFormat = (format: string): boolean => {
  const validFormats = ['mp3', 'm4a', 'wav'];
  return validFormats.includes(format);
};

export const validateSubtitleLanguage = (language: string): boolean => {
  const validLanguages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'zh', 'ar'];
  return validLanguages.includes(language);
};

export const sanitizeString = (str: string): string => {
  // Remove potentially dangerous characters
  return str.replace(/[<>"'&]/g, '');
};

export const validateFileSize = (size: number, maxSize: number): boolean => {
  return size > 0 && size <= maxSize;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

export const getClientIp = (req: any): string => {
  return (
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.socket.remoteAddress ||
    'unknown'
  );
};
