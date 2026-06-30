import { Request, Response, NextFunction } from 'express';

export interface CustomError extends Error {
  status?: number;
  details?: any;
}

/**
 * Global error handling middleware
 */
export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  const details = err.details || undefined;

  console.error('Error:', {
    status,
    message,
    details,
    path: req.path,
    method: req.method
  });

  res.status(status).json({
    error: message,
    status,
    ...(details && { details })
  });
};

/**
 * 404 Not Found middleware
 */
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route not found',
    status: 404,
    path: req.path
  });
};
