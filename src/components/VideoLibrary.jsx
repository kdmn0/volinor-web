import React, { useEffect, useState } from 'react';

export default function VideoLibrary() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        // public klasöründeki statik JSON dosyasını çekiyoruz
        const response = await fetch('/videolar.json');
        if (!response.ok) {
          throw new Error('Video verileri yüklenemedi.');
        }
        const data = await response.json();
        setVideos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white/100 rounded-full animate-spin"></div>
          <p className="text-white/60 text-sm tracking-wider font-medium uppercase">Kütüphane Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-xl backdrop-blur-md">
          <p className="font-medium flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Bir hata oluştu: {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full font-sans">
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {videos.map((video) => (
            <div 
              key={video.id}
              className="group relative flex flex-col text-left bg-white/[0.03] border border-white/[0.05] rounded-2xl overflow-hidden hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300 ease-out shadow-lg hover:shadow-2xl hover:shadow-white/5"
            >
              {/* Thumbnail / Player Area */}
              {playingVideo === video.id ? (
                <div className="relative aspect-video w-full bg-black">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`} 
                    title={video.title}
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen>
                  </iframe>
                </div>
              ) : (
                <button 
                  onClick={() => setPlayingVideo(video.id)}
                  className="relative aspect-video w-full overflow-hidden bg-black/40 outline-none block"
                >
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]">
                    <div className="bg-red-600 text-white rounded-full p-4 transform scale-90 group-hover:scale-100 transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.5)]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </button>
              )}

              {/* Content Area */}
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium px-2.5 py-1 bg-white/10 text-white/80 rounded-full">
                    {new Date(video.publishedAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-white/90 leading-snug mb-2 line-clamp-2 group-hover:text-white transition-colors">
                  {video.title}
                </h3>
                
                <p className="text-sm text-white/50 line-clamp-2 flex-grow">
                  {video.description || "Açıklama bulunmuyor."}
                </p>
              </div>
            </div>
          ))}
        </div>

        {videos.length === 0 && !loading && !error && (
          <div className="text-center py-20">
            <p className="text-white/40 text-lg">Henüz hiç video bulunmuyor.</p>
          </div>
        )}
      </div>
    </div>
  );
}
