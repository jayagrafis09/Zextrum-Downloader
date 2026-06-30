/**
 * Standardized error codes and messages
 */

export enum ErrorCode {
  // Validation Errors (400)
  INVALID_URL = 'INVALID_URL',
  MISSING_URL = 'MISSING_URL',
  INVALID_QUALITY = 'INVALID_QUALITY',
  INVALID_FORMAT = 'INVALID_FORMAT',
  INVALID_LANGUAGE = 'INVALID_LANGUAGE',

  // Rate Limiting (429)
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',

  // Server Errors (500)
  DOWNLOAD_FAILED = 'DOWNLOAD_FAILED',
  CONVERSION_FAILED = 'CONVERSION_FAILED',
  FFMPEG_NOT_AVAILABLE = 'FFMPEG_NOT_AVAILABLE',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  TIMEOUT = 'TIMEOUT',
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.INVALID_URL]: 'Invalid YouTube URL format',
  [ErrorCode.MISSING_URL]: 'YouTube URL is required',
  [ErrorCode.INVALID_QUALITY]: 'Invalid video quality',
  [ErrorCode.INVALID_FORMAT]: 'Invalid audio format',
  [ErrorCode.INVALID_LANGUAGE]: 'Invalid subtitle language',
  [ErrorCode.RATE_LIMIT_EXCEEDED]: 'Too many requests, please try again later',
  [ErrorCode.DOWNLOAD_FAILED]: 'Failed to download content',
  [ErrorCode.CONVERSION_FAILED]: 'Failed to convert audio format',
  [ErrorCode.FFMPEG_NOT_AVAILABLE]: 'FFmpeg is not available',
  [ErrorCode.FILE_TOO_LARGE]: 'File size exceeds maximum limit',
  [ErrorCode.TIMEOUT]: 'Request took too long',
  [ErrorCode.INTERNAL_ERROR]: 'An unexpected error occurred'
};

export const getErrorStatus = (code: ErrorCode): number => {
  const statusMap: Record<ErrorCode, number> = {
    [ErrorCode.INVALID_URL]: 400,
    [ErrorCode.MISSING_URL]: 400,
    [ErrorCode.INVALID_QUALITY]: 400,
    [ErrorCode.INVALID_FORMAT]: 400,
    [ErrorCode.INVALID_LANGUAGE]: 400,
    [ErrorCode.RATE_LIMIT_EXCEEDED]: 429,
    [ErrorCode.DOWNLOAD_FAILED]: 500,
    [ErrorCode.CONVERSION_FAILED]: 500,
    [ErrorCode.FFMPEG_NOT_AVAILABLE]: 503,
    [ErrorCode.FILE_TOO_LARGE]: 413,
    [ErrorCode.TIMEOUT]: 408,
    [ErrorCode.INTERNAL_ERROR]: 500
  };
  return statusMap[code] || 500;
};
