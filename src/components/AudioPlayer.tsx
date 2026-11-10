import React, { useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Download,
  Share2,
  FastForward,
  Rewind,
  Music,
  Check,
  Disc,
  Clock,
  Sparkles
} from 'lucide-react';
import { AudioTake } from '../types/tts';

interface AudioPlayerProps {
  currentTake: AudioTake | null;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ currentTake }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [copied, setCopied] = useState(false);

  // Initialize or reload audio when currentTake changes
  useEffect(() => {
    if (!currentTake?.audioBase64) return;

    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setCurrentTime(0);
      audioRef.current.src = `data:audio/wav;base64,${currentTake.audioBase64}`;
      audioRef.current.load();
    }
  }, [currentTake?.id, currentTake?.audioBase64]);

  // Audio event listeners
  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const onEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  const seek = (seconds: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, Math.min(duration, seconds));
    setCurrentTime(audioRef.current.currentTime);
  };

  const changeRate = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const changeVolume = (val: number) => {
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      if (val === 0) {
        setIsMuted(true);
      } else if (isMuted) {
        setIsMuted(false);
      }
    }
  };

  // Download WAV file
  const downloadWav = () => {
    if (!currentTake) return;
    const link = document.createElement('a');
    link.href = `data:audio/wav;base64,${currentTake.audioBase64}`;
    const cleanTitle = (currentTake.title || 'voxstudio-narration')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .slice(0, 30);
    link.download = `${cleanTitle}-${Date.now()}.wav`;
    link.click();
  };

  const copyBase64 = () => {
    if (!currentTake) return;
    navigator.clipboard.writeText(`data:audio/wav;base64,${currentTake.audioBase64}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Canvas waveform visualizer animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const barCount = 48;
      const barWidth = width / barCount - 2;

      for (let i = 0; i < barCount; i++) {
        const progress = duration > 0 ? currentTime / duration : 0;
        const isPassed = i / barCount <= progress;

        // Dynamic wave calculation
        let barHeight = 8;
        if (isPlaying) {
          const t = Date.now() / 200;
          const wave = Math.sin(i * 0.4 + t) * Math.cos(i * 0.2 + t * 0.8);
          barHeight = 10 + Math.abs(wave) * (height - 18);
        } else {
          // Static visual waveform shape
          const shape = Math.sin((i / barCount) * Math.PI) * (height - 20) * 0.6;
          barHeight = 8 + Math.abs(shape);
        }

        const x = i * (barWidth + 2);
        const y = (height - barHeight) / 2;

        ctx.fillStyle = isPassed
          ? isPlaying
            ? '#06b6d4'
            : '#0ea5e9'
          : '#334155';

        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isPlaying, currentTime, duration]);

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const mins = Math.floor(secs / 60);
    const remaining = Math.floor(secs % 60);
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  if (!currentTake) {
    return (
      <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-8 text-center text-slate-500">
        <Disc className="h-8 w-8 mx-auto mb-2 text-slate-600 animate-spin" style={{ animationDuration: '6s' }} />
        <p className="text-sm font-medium text-slate-400">Master Audio Deck</p>
        <p className="text-xs text-slate-500 mt-1">
          Select or write a narration script above and click "Generate Natural Audio" to produce a 24kHz master track.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-500/30 rounded-2xl p-5 shadow-2xl shadow-cyan-950/40 space-y-4">
      {/* Hidden native audio tag */}
      <audio
        ref={audioRef}
        onLoadedMetadata={onLoadedMetadata}
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
      />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Music className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              {currentTake.title}
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                24kHz WAV
              </span>
            </h4>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span>{currentTake.mode === 'dialogue' ? 'Dual-Speaker Dialogue' : `Voice: ${currentTake.voiceName}`}</span>
              <span>•</span>
              <span className="font-mono text-slate-300">{currentTake.model}</span>
              {currentTake.genre && (
                <>
                  <span>•</span>
                  <span className="capitalize text-amber-400">{currentTake.genre}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action icons: Download, Copy Base64 */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={copyBase64}
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Copy Audio Data URI"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied' : 'Share'}</span>
          </button>

          <button
            onClick={downloadWav}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20 transition-all"
            title="Download 24kHz Master WAV"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download .WAV</span>
          </button>
        </div>
      </div>

      {/* Waveform Canvas */}
      <div className="relative bg-slate-950 rounded-xl p-3 border border-slate-800/80">
        <canvas
          ref={canvasRef}
          width={600}
          height={64}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const ratio = clickX / rect.width;
            seek(ratio * duration);
          }}
          className="w-full h-16 cursor-pointer"
        />

        {/* Interactive Scrubber Slider */}
        <input
          type="range"
          min={0}
          max={duration || 100}
          step={0.01}
          value={currentTime}
          onChange={(e) => seek(parseFloat(e.target.value))}
          aria-label="Audio scrubber slider"
          className="w-full h-1 bg-transparent accent-cyan-400 cursor-pointer absolute bottom-2 left-0 right-0 px-3 opacity-80 hover:opacity-100 transition-opacity"
        />
      </div>

      {/* Deck Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Playback Transport */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => seek(currentTime - 5)}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Rewind 5s"
          >
            <Rewind className="h-4 w-4" />
          </button>

          <button
            onClick={togglePlay}
            className="h-12 w-12 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/30 transition-transform active:scale-95"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 fill-slate-950" />
            ) : (
              <Play className="h-5 w-5 fill-slate-950 ml-0.5" />
            )}
          </button>

          <button
            onClick={() => seek(currentTime + 5)}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Fast Forward 5s"
          >
            <FastForward className="h-4 w-4" />
          </button>

          <button
            onClick={() => seek(0)}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Restart"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          {/* Time Display */}
          <div className="text-xs font-mono text-slate-300 ml-1">
            <span className="text-cyan-400 font-bold">{formatTime(currentTime)}</span>
            <span className="text-slate-600 mx-1">/</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Speed Controls & Volume */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          {/* Speed Chips */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px] font-mono">
            {[0.75, 1.0, 1.25, 1.5].map((rate) => (
              <button
                key={rate}
                onClick={() => changeRate(rate)}
                className={`px-2 py-0.5 rounded transition-colors ${
                  playbackRate === rate
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>

          {/* Volume */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="text-slate-400 hover:text-slate-200"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-4 w-4 text-rose-400" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={(e) => changeVolume(parseFloat(e.target.value))}
              aria-label="Volume level slider"
              className="w-16 h-1 bg-slate-800 accent-cyan-400 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
