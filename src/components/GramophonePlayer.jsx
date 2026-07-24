import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Disc, Music, Volume2, VolumeX, Sparkles } from 'lucide-react';

const PLAYLIST = [
  {
    title: 'Getaran Jiwa',
    artist: 'P. Ramlee (Klasik Instrumental)',
    year: '1960',
    // High-quality public domain / vintage jazz instrumental sound stream
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

export default function GramophonePlayer({ autoPlay = false }) {
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
    <div className="relative bg-[#1A130E]/90 border-2 border-[#D4AF37]/60 rounded-2xl p-4 md:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md flex flex-col md:flex-row items-center gap-6 max-w-xl mx-auto overflow-hidden">
      {/* Background Vintage Film Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/5 via-transparent to-[#8C1C1C]/10 pointer-events-none" />

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onEnded={nextTrack}
      />

      {/* Gramophone Vinyl Record Visual */}
      <div className="relative flex-shrink-0 group cursor-pointer" onClick={togglePlay}>
        {/* Outer Brass Horn Graphic Accent */}
        <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full border-2 border-[#D4AF37]/40 animate-ping pointer-events-none opacity-20" />

        {/* Vinyl Disc Container */}
        <div className={`relative w-28 h-28 md:w-32 md:h-32 rounded-full bg-[#111] border-4 border-[#2A231C] shadow-2xl flex items-center justify-center transition-transform duration-700 ${isPlaying ? 'spinning-vinyl' : 'spinning-vinyl-paused'}`}>
          {/* Vinyl Grooves */}
          <div className="absolute inset-1 rounded-full border border-white/5" />
          <div className="absolute inset-3 rounded-full border border-white/5" />
          <div className="absolute inset-5 rounded-full border border-white/10" />
          
          {/* Center Label (Sepia Gold Center) */}
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-tr from-[#B38728] via-[#FBF5B7] to-[#AA771C] p-0.5 shadow-inner flex items-center justify-center text-center">
            <div className="w-full h-full rounded-full bg-[#2B1D0C] flex items-center justify-center">
              <Disc className="w-5 h-5 text-[#D4AF37]" />
            </div>
          </div>
        </div>

        {/* Gramophone Tonearm Needle */}
        <div 
          className={`absolute top-0 right-0 w-12 h-16 origin-top-right transition-transform duration-500 pointer-events-none ${isPlaying ? 'rotate-12' : '-rotate-45'}`}
        >
          <div className="w-1 h-12 bg-gradient-to-b from-[#D4AF37] to-[#8C1C1C] rounded-full shadow-md" />
          <div className="w-3 h-3 bg-[#D4AF37] rounded-full -ml-1 -mt-1 shadow" />
        </div>
      </div>

      {/* Track Info & Controls */}
      <div className="flex-1 text-center md:text-left z-10">
        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
          <Music className="w-4 h-4 text-[#D4AF37] animate-bounce" />
          <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-typewriter">Gramofon P. Ramlee Edition</span>
        </div>

        <h4 className="text-lg md:text-xl font-bold font-heading text-[#F5E6CA] line-clamp-1">
          {currentTrack.title}
        </h4>
        <p className="text-xs text-[#A39274] font-sans mb-3">
          {currentTrack.artist} • <span className="text-[#D4AF37]">{currentTrack.year}</span>
        </p>

        {/* Buttons */}
        <div className="flex items-center justify-center md:justify-start gap-3">
          <button
            onClick={togglePlay}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#BF953F] to-[#AA771C] hover:from-[#FCF6BA] hover:to-[#B38728] text-[#1A130E] font-bold text-sm shadow-lg transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" /> Pause Lagu
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" /> Putar Lagu
              </>
            )}
          </button>

          <button
            onClick={nextTrack}
            className="p-2 rounded-full border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors"
            title="Lagu Seterusnya"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          <button
            onClick={toggleMute}
            className="p-2 rounded-full border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
