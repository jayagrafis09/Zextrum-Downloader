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

export interface DownloadStatus {
  isDownloading: boolean;
  progress: number;
  status: 'idle' | 'fetching' | 'downloading' | 'completed' | 'error';
  error?: string;
  filename?: string;
}
