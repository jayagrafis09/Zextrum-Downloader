export interface DownloadRequest {
  url: string;
  quality?: string;
  format?: string;
  language?: string;
}

export interface VideoInfo {
  id: string;
  title: string;
  description: string;
  duration: number;
  thumbnail: string;
  uploader: string;
  formats: Format[];
  subtitles: Subtitle[];
}

export interface Format {
  format_id: string;
  ext: string;
  quality: string;
  filesize?: number;
  fps?: number;
}

export interface Subtitle {
  language: string;
  code: string;
  ext: string;
}

export interface DownloadResponse {
  success: boolean;
  message: string;
  filename?: string;
  path?: string;
  size?: number;
  duration?: number;
}

export interface ErrorResponse {
  error: string;
  status: number;
  details?: any;
}
