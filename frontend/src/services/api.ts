import axios from 'axios';
import { VideoInfo, DownloadStatus } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const downloadVideo = async (url: string, quality: string) => {
  const response = await api.post('/download/video', { url, quality });
  return response.data;
};

export const downloadAudio = async (url: string, format: string) => {
  const response = await api.post('/download/audio', { url, format });
  return response.data;
};

export const downloadSubtitles = async (url: string, language: string) => {
  const response = await api.post('/download/subtitles', { url, language });
  return response.data;
};

export const getVideoInfo = async (url: string): Promise<VideoInfo> => {
  const response = await api.get('/info', { params: { url } });
  return response.data;
};

export default api;
