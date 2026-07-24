import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Disc, Music, Volume2, VolumeX, Sparkles } from 'lucide-react';

const PLAYLIST = [
  {
    title: 'Getaran Jiwa',
    artist: 'P. Ramlee (Klasik Instrumental)',
    year: '1960',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=vintage-jazz-smooth-relaxation-113549.mp3'
  },
  {
    title: 'Malam Bulan Di Pagar Bintang',
    artist: 'P. Ramlee & Saloma (Nostalgia)',
    year: '1962',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a81699.mp3?filename=vintage-acoustic-nostalgia-10654.mp3'
  },
  {
    title: 'Engkau Laksana Bulan',
    artist: 'P. Ramlee (Piring Hitam Vintaj)',
    year: '1955',
    url: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_8844fa0e23.mp3?filename=classic-sepia-piano-ballad-2244.mp3'
  }
];

export default function GramophonePlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  const currentTrack = PLAYLIST[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
    }
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn('Audio playback prevented:', err);
      });
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const nextTrack = () => {
    const nextIdx = (currentTrackIndex + 1) % PLAYLIST.length;
    setCurrentTrackIndex(nextIdx);
    setIsPlaying(false);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }, 100);
  };

  return (
    <div className="relative bg-[#241A13] border-2 border-[#D4AF37]/60 rounded-2xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md flex items-center gap-5 max-w-lg">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onEnded={nextTrack}
      />

      {/* Vinyl Disc Container */}
      <div className="relative flex-shrink-0 cursor-pointer group" onClick={togglePlay}>
        <div className={`relative w-20 h-20 rounded-full bg-[#110C08] border-2 border-[#D4AF37] flex items-center justify-center shadow-xl ${isPlaying ? 'spinning-vinyl' : 'spinning-vinyl-paused'}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#B8860B] to-[#D4AF37] p-0.5 flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-[#241A13] flex items-center justify-center">
              <Disc className="w-4 h-4 text-[#D4AF37]" />
            </div>
          </div>
        </div>

        {/* Tonearm */}
        <div className={`absolute top-0 right-0 w-8 h-10 origin-top-right transition-transform duration-500 pointer-events-none ${isPlaying ? 'rotate-12' : '-rotate-45'}`}>
          <div className="w-0.5 h-8 bg-[#D4AF37]" />
        </div>
      </div>

      {/* Details & Controls */}
      <div className="flex-1 text-left">
        <div className="flex items-center gap-2 mb-0.5">
          <Music className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-typewriter">PIRING HITAM P. RAMLEE</span>
        </div>

        <h4 className="text-sm md:text-base font-bold font-heading text-[#FAF0D7] line-clamp-1">
          {currentTrack.title}
        </h4>
        <p className="text-[11px] text-[#A89578] font-sans mb-2">
          {currentTrack.artist} ({currentTrack.year})
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-black font-bold text-xs uppercase transition-transform active:scale-95 cursor-pointer font-typewriter"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            {isPlaying ? 'Pause' : 'Putar'}
          </button>

          <button
            onClick={nextTrack}
            className="p-1.5 rounded-lg border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/10"
            title="Lagu Seterusnya"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={toggleMute}
            className="p-1.5 rounded-lg border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/10"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
