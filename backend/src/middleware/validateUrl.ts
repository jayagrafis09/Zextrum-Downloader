import { Request, Response, NextFunction } from 'express';

/**
 * Validate YouTube URL in request body or query
 */
export const validateYouTubeUrl = (req: Request, res: Response, next: NextFunction) => {
  const url = req.body?.url || req.query?.url;

  if (!url) {
    return res.status(400).json({ error: 'YouTube URL is required' });
  }

  if (typeof url !== 'string') {
    return res.status(400).json({ error: 'URL must be a string' });
  }

  if (!isValidYouTubeUrl(url)) {
    return res.status(400).json({ error: 'Invalid YouTube URL format' });
  }

  next();
};

/**
 * Helper: Validate YouTube URL format
 */
function isValidYouTubeUrl(url: string): boolean {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube|youtu|youtube-nocookie)\.(com|be)\//;
  return youtubeRegex.test(url);
}
