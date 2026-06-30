import React, { useState } from 'react';
import { Download, Music, FileText, Info } from 'lucide-react';
import { downloadVideo, downloadAudio, downloadSubtitles, getVideoInfo } from './services/api';

function App() {
  const [url, setUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'video' | 'audio' | 'subtitle' | 'info'>('video');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleDownload = async (type: 'video' | 'audio' | 'subtitle') => {
    if (!url.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let response;
      switch (type) {
        case 'video':
          response = await downloadVideo(url, 'highest');
          break;
        case 'audio':
          response = await downloadAudio(url, 'mp3');
          break;
        case 'subtitle':
          response = await downloadSubtitles(url, 'en');
          break;
      }
      setSuccess(`${type.charAt(0).toUpperCase() + type.slice(1)} download started!`);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGetInfo = async () => {
    if (!url.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const info = await getVideoInfo(url);
      setSuccess('Video info fetched successfully!');
      console.log('Video Info:', info);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch video info');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-2">🎬 Zextrum Downloader</h1>
          <p className="text-xl text-slate-300">Download YouTube videos, audio & subtitles in original quality</p>
        </div>

        {/* Main Card */}
        <div className="max-w-2xl mx-auto bg-slate-800 rounded-lg shadow-2xl p-8">
          {/* URL Input */}
          <div className="mb-8">
            <label className="block text-white font-semibold mb-2">YouTube URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste YouTube URL here..."
              className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-8 border-b border-slate-700">
            {[
              { id: 'video', label: 'Video', icon: Download },
              { id: 'audio', label: 'Audio', icon: Music },
              { id: 'subtitle', label: 'Subtitle', icon: FileText },
              { id: 'info', label: 'Info', icon: Info }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-400 border-b-2 border-blue-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Download Buttons */}
          <div className="mb-8">
            {activeTab === 'info' ? (
              <button
                onClick={handleGetInfo}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-3 rounded-lg transition-colors"
              >
                {loading ? 'Fetching...' : 'Get Video Info'}
              </button>
            ) : (
              <button
                onClick={() => handleDownload(activeTab)}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-3 rounded-lg transition-colors"
              >
                {loading ? 'Processing...' : `Download ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
              </button>
            )}
          </div>

          {/* Messages */}
          {error && (
            <div className="p-4 bg-red-900 text-red-100 rounded-lg mb-4">
              ❌ {error}
            </div>
          )}
          {success && (
            <div className="p-4 bg-green-900 text-green-100 rounded-lg mb-4">
              ✅ {success}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-slate-400">
          <p>Made with ❤️ by Jaya Grafis | v1.0.0</p>
        </div>
      </div>
    </div>
  );
}

export default App;
