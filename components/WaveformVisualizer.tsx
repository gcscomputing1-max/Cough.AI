
import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WaveformVisualizerProps {
  isAnalyzing: boolean;
}

const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({ isAnalyzing }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState(0);
  const [viewMode, setViewMode] = useState<'waveform' | 'spectrogram' | 'both'>('waveform');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const render = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      // Background Grid
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i < width; i += 40 / zoom) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }

      if (viewMode === 'waveform' || viewMode === 'both') {
        renderWaveform(ctx, width, height);
      }
      
      if (viewMode === 'spectrogram' || viewMode === 'both') {
        renderSpectrogram(ctx, width, height);
      }

      if (isAnalyzing) {
        renderScanLine(ctx, width, height);
      }

      animationId = requestAnimationFrame(render);
    };

    const renderWaveform = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      const centerY = viewMode === 'both' ? h * 0.25 : h * 0.5;
      const amplitude = viewMode === 'both' ? h * 0.2 : h * 0.4;
      
      ctx.beginPath();
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 2;
      ctx.lineJoin = 'round';
      
      const step = 2;
      for (let x = 0; x < w; x += step) {
        const time = (x / w) * (1 / zoom) + (offset / 100);
        const y = centerY + Math.sin(time * 20 + Date.now() * 0.005) * amplitude * 0.5 * Math.sin(time * 5);
        
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      
      ctx.shadowBlur = 15;
      ctx.shadowColor = 'rgba(99, 102, 241, 0.5)';
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    const renderSpectrogram = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      const startY = viewMode === 'both' ? h * 0.5 : 0;
      const spectroHeight = viewMode === 'both' ? h * 0.5 : h;
      
      const columns = 60;
      const rows = 12;
      const colWidth = w / columns;
      const rowHeight = spectroHeight / rows;

      for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
          const time = (i / columns) * (1 / zoom) + (offset / 100);
          const noise = Math.sin(time * 10 + j * 0.5 + Date.now() * 0.002);
          const intensity = Math.max(0, 0.2 + noise * 0.8);
          
          ctx.fillStyle = `rgba(168, 85, 247, ${intensity * 0.4})`;
          ctx.fillRect(i * colWidth, startY + (rows - j - 1) * rowHeight, colWidth - 1, rowHeight - 1);
        }
      }
    };

    const renderScanLine = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      const scanX = (Date.now() % 2000) / 2000 * w;
      const gradient = ctx.createLinearGradient(scanX - 50, 0, scanX, 0);
      gradient.addColorStop(0, 'rgba(99, 102, 241, 0)');
      gradient.addColorStop(1, 'rgba(99, 102, 241, 0.4)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(scanX - 50, 0, 50, h);
      
      ctx.beginPath();
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 1;
      ctx.moveTo(scanX, 0);
      ctx.lineTo(scanX, h);
      ctx.stroke();
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [isAnalyzing, zoom, offset, viewMode]);

  return (
    <div className="relative w-full h-full bg-slate-950 rounded-[2.5rem] overflow-hidden border border-white/5 shadow-inner">
      <canvas 
        ref={canvasRef} 
        width={600} 
        height={400} 
        className="w-full h-full object-cover opacity-80"
      />

      {/* Mode Overlay */}
      <div className="absolute top-6 left-6 flex gap-2">
        {(['waveform', 'spectrogram', 'both'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
              viewMode === mode 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white/5 text-slate-500 hover:bg-white/10'
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* Control Panel */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] glass rounded-3xl p-4 flex flex-col gap-4 border border-white/10">
        <div className="flex items-center gap-6">
          <div className="flex-1 flex flex-col gap-1">
            <div className="flex justify-between items-center px-1">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Acoustic Zoom</span>
              <span className="text-[9px] font-bold text-indigo-400">{zoom.toFixed(1)}x</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="5" 
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          <AnimatePresence>
            {zoom > 1 && (
              <motion.div 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="flex-1 flex flex-col gap-1 overflow-hidden"
              >
                <div className="flex justify-between items-center px-1">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Time Window</span>
                  <span className="text-[9px] font-bold text-indigo-400">{offset}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max={100 - (100/zoom)} 
                  step="1"
                  value={offset}
                  onChange={(e) => setOffset(parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-purple-500"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute right-6 top-6 flex flex-col items-end gap-1 opacity-40">
        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Resonance Map V4.2</span>
        <span className="text-[8px] font-bold text-indigo-500 uppercase tracking-widest">Active Monitoring</span>
      </div>
    </div>
  );
};

export default WaveformVisualizer;
