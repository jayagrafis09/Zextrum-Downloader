import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

const unlinkAsync = promisify(fs.unlink);

// Set FFmpeg paths
const ffmpegPath = process.env.FFMPEG_PATH || 'ffmpeg';
const ffprobePath = process.env.FFPROBE_PATH || 'ffprobe';

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

/**
 * Get audio duration in seconds
 */
export const getAudioDuration = (inputPath: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(inputPath, (err, metadata) => {
      if (err) {
        reject(new Error(`Failed to get audio duration: ${err.message}`));
      } else {
        const duration = metadata.format.duration || 0;
        resolve(Math.floor(duration));
      }
    });
  });
};

/**
 * Convert audio to MP3 with quality settings
 */
export const convertToMp3 = (
  inputPath: string,
  outputPath: string,
  quality: 'low' | 'medium' | 'high' = 'high'
): Promise<{ outputPath: string; duration: number }> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Quality settings for MP3
      const qualitySettings = {
        low: 64,      // 64 kbps
        medium: 128,  // 128 kbps
        high: 192     // 192 kbps
      };

      const bitrate = qualitySettings[quality];
      let duration = 0;

      ffmpeg(inputPath)
        .audioBitrate(bitrate)
        .audioChannels(2)
        .audioFrequency(44100)
        .format('mp3')
        .on('progress', (progress) => {
          console.log(`MP3 conversion progress: ${progress.percent}%`);
        })
        .on('error', (err) => {
          reject(new Error(`FFmpeg error: ${err.message}`));
        })
        .on('end', async () => {
          try {
            // Get duration of output file
            duration = await getAudioDuration(outputPath);
            resolve({ outputPath, duration });
          } catch (err) {
            reject(err);
          }
        })
        .save(outputPath);
    } catch (error: any) {
      reject(new Error(`Failed to convert to MP3: ${error.message}`));
    }
  });
};

/**
 * Convert audio to M4A (AAC)
 */
export const convertToM4a = (
  inputPath: string,
  outputPath: string,
  quality: 'low' | 'medium' | 'high' = 'high'
): Promise<{ outputPath: string; duration: number }> => {
  return new Promise(async (resolve, reject) => {
    try {
      const qualitySettings = {
        low: 64,
        medium: 128,
        high: 192
      };

      const bitrate = qualitySettings[quality];
      let duration = 0;

      ffmpeg(inputPath)
        .audioBitrate(bitrate)
        .audioChannels(2)
        .audioFrequency(44100)
        .audioCodec('aac')
        .format('m4a')
        .on('progress', (progress) => {
          console.log(`M4A conversion progress: ${progress.percent}%`);
        })
        .on('error', (err) => {
          reject(new Error(`FFmpeg error: ${err.message}`));
        })
        .on('end', async () => {
          try {
            duration = await getAudioDuration(outputPath);
            resolve({ outputPath, duration });
          } catch (err) {
            reject(err);
          }
        })
        .save(outputPath);
    } catch (error: any) {
      reject(new Error(`Failed to convert to M4A: ${error.message}`));
    }
  });
};

/**
 * Convert audio to WAV
 */
export const convertToWav = (
  inputPath: string,
  outputPath: string
): Promise<{ outputPath: string; duration: number }> => {
  return new Promise(async (resolve, reject) => {
    try {
      let duration = 0;

      ffmpeg(inputPath)
        .audioChannels(2)
        .audioFrequency(44100)
        .audioCodec('pcm_s16le')
        .format('wav')
        .on('progress', (progress) => {
          console.log(`WAV conversion progress: ${progress.percent}%`);
        })
        .on('error', (err) => {
          reject(new Error(`FFmpeg error: ${err.message}`));
        })
        .on('end', async () => {
          try {
            duration = await getAudioDuration(outputPath);
            resolve({ outputPath, duration });
          } catch (err) {
            reject(err);
          }
        })
        .save(outputPath);
    } catch (error: any) {
      reject(new Error(`Failed to convert to WAV: ${error.message}`));
    }
  });
};

/**
 * Extract audio from video file
 */
export const extractAudio = (
  videoPath: string,
  outputPath: string
): Promise<{ outputPath: string; duration: number }> => {
  return new Promise(async (resolve, reject) => {
    try {
      let duration = 0;

      ffmpeg(videoPath)
        .noVideo()
        .audioCodec('libmp3lame')
        .audioBitrate('192')
        .format('mp3')
        .on('progress', (progress) => {
          console.log(`Audio extraction progress: ${progress.percent}%`);
        })
        .on('error', (err) => {
          reject(new Error(`FFmpeg error: ${err.message}`));
        })
        .on('end', async () => {
          try {
            duration = await getAudioDuration(outputPath);
            resolve({ outputPath, duration });
          } catch (err) {
            reject(err);
          }
        })
        .save(outputPath);
    } catch (error: any) {
      reject(new Error(`Failed to extract audio: ${error.message}`));
    }
  });
};

/**
 * Get audio file information
 */
export const getAudioInfo = (
  filePath: string
): Promise<{
  duration: number;
  bitrate: number;
  sampleRate: number;
  channels: number;
  codec: string;
}> => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        reject(new Error(`Failed to get audio info: ${err.message}`));
      } else {
        const audio = metadata.streams.find(s => s.codec_type === 'audio');
        if (!audio) {
          reject(new Error('No audio stream found'));
        } else {
          resolve({
            duration: Math.floor(metadata.format.duration || 0),
            bitrate: audio.bit_rate || 0,
            sampleRate: audio.sample_rate || 0,
            channels: audio.channels || 0,
            codec: audio.codec_name || 'unknown'
          });
        }
      }
    });
  });
};

/**
 * Verify FFmpeg installation
 */
export const verifyFFmpeg = (): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      ffmpeg.ffprobe('-version', (err, metadata) => {
        resolve(!err);
      });
    } catch (error) {
      resolve(false);
    }
  });
};
