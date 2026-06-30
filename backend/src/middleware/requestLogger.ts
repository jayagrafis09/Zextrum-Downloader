import { Request, Response, NextFunction } from 'express';

interface RequestLogEntry {
  timestamp: string;
  method: string;
  path: string;
  ip: string;
  status?: number;
  duration?: number;
  error?: string;
}

const logs: RequestLogEntry[] = [];
const MAX_LOGS = 1000; // Keep only latest 1000 logs in memory

/**
 * Request logging middleware
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';

  // Capture response
  const originalSend = res.send;
  res.send = function (data: any) {
    const duration = Date.now() - startTime;
    const logEntry: RequestLogEntry = {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      ip: String(clientIp),
      status: res.statusCode,
      duration
    };

    // Only log download endpoints and health checks
    if (req.path.includes('/api/') && (req.path.includes('/download') || req.path.includes('/health'))) {
      logs.push(logEntry);
      if (logs.length > MAX_LOGS) {
        logs.shift();
      }
    }

    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
    return originalSend.call(this, data);
  };

  next();
};

/**
 * Get request logs
 */
export const getLogs = (): RequestLogEntry[] => {
  return logs;
};

/**
 * Clear request logs
 */
export const clearLogs = (): void => {
  logs.length = 0;
};
