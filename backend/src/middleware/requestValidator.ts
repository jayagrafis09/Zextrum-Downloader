import { Request, Response, NextFunction } from 'express';
import CONFIG from '../config/constants';
import { validateURL, validateVideoQuality, validateAudioFormat, validateSubtitleLanguage } from '../utils/validators';
import { ErrorCode, ERROR_MESSAGES, getErrorStatus } from '../utils/errorCodes';

/**
 * Validate YouTube URL in request body
 */
export const validateDownloadUrl = (req: Request, res: Response, next: NextFunction) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({
      error: ERROR_MESSAGES[ErrorCode.MISSING_URL],
      code: ErrorCode.MISSING_URL
    });
  }

  if (!validateURL(url)) {
    return res.status(400).json({
      error: ERROR_MESSAGES[ErrorCode.INVALID_URL],
      code: ErrorCode.INVALID_URL
    });
  }

  next();
};

/**
 * Validate video quality parameter
 */
export const validateQuality = (req: Request, res: Response, next: NextFunction) => {
  const { quality } = req.body;

  if (quality && !validateVideoQuality(quality)) {
    return res.status(400).json({
      error: ERROR_MESSAGES[ErrorCode.INVALID_QUALITY],
      code: ErrorCode.INVALID_QUALITY,
      validQualities: CONFIG.FORMATS.video
    });
  }

  next();
};

/**
 * Validate audio format parameter
 */
export const validateFormat = (req: Request, res: Response, next: NextFunction) => {
  const { format } = req.body;

  if (format && !validateAudioFormat(format)) {
    return res.status(400).json({
      error: ERROR_MESSAGES[ErrorCode.INVALID_FORMAT],
      code: ErrorCode.INVALID_FORMAT,
      validFormats: CONFIG.FORMATS.audio
    });
  }

  next();
};

/**
 * Validate subtitle language parameter
 */
export const validateLanguage = (req: Request, res: Response, next: NextFunction) => {
  const { language } = req.body;

  if (language && !validateSubtitleLanguage(language)) {
    return res.status(400).json({
      error: ERROR_MESSAGES[ErrorCode.INVALID_LANGUAGE],
      code: ErrorCode.INVALID_LANGUAGE,
      validLanguages: CONFIG.FORMATS.subtitle
    });
  }

  next();
};
