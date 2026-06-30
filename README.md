# Zextrum Downloader 🎬

A powerful and professional YouTube downloader with support for video, audio, and subtitle downloads in original quality.

## Features

✨ **Video Downloader** - Download YouTube videos in original quality
🎵 **Audio Downloader** - Extract audio from videos in MP3 format
📝 **Subtitle Downloader** - Download video subtitles in multiple languages

## Tech Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- TypeScript
- yt-dlp

## Prerequisites

- Node.js >= 16.0.0
- npm or yarn
- Python 3.7+ (for yt-dlp)
- FFmpeg (for audio conversion)

## Installation

### Clone Repository
```bash
git clone https://github.com/jayagrafis09/Zextrum-Downloader.git
cd Zextrum-Downloader
```

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## Project Structure

```
Zextrum-Downloader/
├── backend/              # Express backend
│   ├── src/
│   │   ├── controllers/  # Route controllers
│   │   ├── services/     # Business logic
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Custom middleware
│   │   ├── utils/        # Utility functions
│   │   ├── types/        # TypeScript interfaces
│   │   └── app.ts        # Express app setup
│   ├── .env.example
│   ├── tsconfig.json
│   └── package.json
│
├── frontend/             # React frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── hooks/        # Custom hooks
│   │   ├── types/        # TypeScript interfaces
│   │   └── App.tsx       # Main App component
│   ├── tsconfig.json
│   └── package.json
│
├── .gitignore
└── README.md
```

## API Endpoints

### Download Video
```
POST /api/download/video
Body: { url: string, quality: "highest" | "720p" | "480p" | "360p" }
```

### Download Audio
```
POST /api/download/audio
Body: { url: string, format: "mp3" | "m4a" | "wav" }
```

### Download Subtitles
```
POST /api/download/subtitles
Body: { url: string, language: string }
```

### Get Video Info
```
GET /api/info?url=<youtube_url>
```

## Environment Variables

See `.env.example` in backend directory for configuration.

## License

MIT

## Author

Jaya Grafis (@jayagrafis09)
