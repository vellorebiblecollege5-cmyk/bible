import React, { useEffect, useRef, useState } from 'react';
import { useLiquidCooling, CoolantPreset } from '../context/LiquidCoolingContext';
import { useTheme } from '../context/ThemeContext';
import {
  Droplets,
  Zap,
  Power,
  Sliders,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Thermometer,
  RotateCcw,
  Gauge
} from 'lucide-react';

interface Bubble {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  speedX: number;
  opacity: number;
  oscillationSpeed: number;
  oscillationAmplitude: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
}

export const LiquidCoolingEffect: React.FC = () => {
  const {
    isEnabled,
    toggleEnabled,
    preset,
    setPreset,
    flowSpeed,
    setFlowSpeed,
    temperature,
    flowRate,
    pumpRpm,
    triggerChillBurst,
    isBursting
  } = useLiquidCooling();
  const { isDark } = useTheme();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showControls, setShowControls] = useState(false);
  const mousePos = useRef<{ x: number; y: number }>({ x: -100, y: -100 });
  const ripples = useRef<Ripple[]>([]);
  const bubbles = useRef<Bubble[]>([]);

  // Color schemes based on preset
  const getColorConfig = (p: CoolantPreset) => {
    switch (p) {
      case 'cyan':
        return {
          primary: 'rgba(6, 182, 212, 0.45)', // cyan-500
          secondary: 'rgba(2, 132, 199, 0.25)', // sky-600
          glow: 'rgba(34, 211, 238, 0.8)',
          bubbleColor: 'rgba(165, 243, 252, 0.6)',
          waveTop: 'rgba(6, 182, 212, 0.08)',
          accent: '#06b6d4'
        };
      case 'living-water':
        return {
          primary: 'rgba(56, 189, 248, 0.45)', // sky-400
          secondary: 'rgba(29, 78, 216, 0.25)', // blue-700
          glow: 'rgba(96, 165, 250, 0.8)',
          bubbleColor: 'rgba(224, 242, 254, 0.65)',
          waveTop: 'rgba(56, 189, 248, 0.09)',
          accent: '#38bdf8'
        };
      case 'emerald':
        return {
          primary: 'rgba(16, 185, 129, 0.45)', // emerald-500
          secondary: 'rgba(5, 150, 105, 0.25)', // emerald-600
          glow: 'rgba(52, 211, 153, 0.8)',
          bubbleColor: 'rgba(209, 250, 229, 0.6)',
          waveTop: 'rgba(16, 185, 129, 0.08)',
          accent: '#10b981'
        };
      case 'gold':
        return {
          primary: 'rgba(245, 158, 11, 0.45)', // amber-500
          secondary: 'rgba(217, 119, 6, 0.25)', // amber-600
          glow: 'rgba(251, 191, 36, 0.8)',
          bubbleColor: 'rgba(254, 243, 199, 0.6)',
          waveTop: 'rgba(245, 158, 11, 0.08)',
          accent: '#f59e0b'
        };
    }
  };

  useEffect(() => {
    if (!isEnabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let step = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initBubbles();
    };

    const initBubbles = () => {
      const count = Math.floor(window.innerWidth / 35);
      bubbles.current = [];
      for (let i = 0; i < count; i++) {
        bubbles.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: 1.5 + Math.random() * 3.5,
          speedY: 0.6 + Math.random() * 1.4,
          speedX: (Math.random() - 0.5) * 0.4,
          opacity: 0.2 + Math.random() * 0.6,
          oscillationSpeed: 0.02 + Math.random() * 0.03,
          oscillationAmplitude: 1 + Math.random() * 2
        });
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      // Spawn occasional interactive ripple
      if (Math.random() > 0.65) {
        ripples.current.push({
          x: e.clientX,
          y: e.clientY,
          radius: 4,
          maxRadius: 40 + Math.random() * 30,
          opacity: 0.4
        });
      }
    };

    const handleClick = (e: MouseEvent) => {
      // Spawn burst ripple
      ripples.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 5,
        maxRadius: 90,
        opacity: 0.7
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    // Animation Loop
    const render = () => {
      step += flowSpeed === 'turbo' ? 0.045 : flowSpeed === 'calm' ? 0.012 : 0.022;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const colors = getColorConfig(preset);

      // 1. Draw Subtle Top & Bottom Flowing Coolant Waves
      const waveHeight = canvas.height * 0.07;
      ctx.fillStyle = colors.waveTop;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      for (let x = 0; x <= canvas.width; x += 30) {
        const y = Math.sin(x * 0.008 + step) * 8 + Math.cos(x * 0.004 + step * 0.7) * 5 + 10;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(canvas.width, 0);
      ctx.closePath();
      ctx.fill();

      // Bottom fluid coolant reservoir shimmer
      const bottomY = canvas.height - 18;
      ctx.fillStyle = colors.waveTop;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      for (let x = 0; x <= canvas.width; x += 30) {
        const y = bottomY + Math.sin(x * 0.006 - step * 1.2) * 6;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.closePath();
      ctx.fill();

      // 2. Rising Convection Bubbles
      bubbles.current.forEach(bubble => {
        bubble.y -= bubble.speedY * (flowSpeed === 'turbo' ? 2.2 : 1);
        bubble.x += Math.sin(step * bubble.oscillationSpeed * 10) * bubble.oscillationAmplitude;

        if (bubble.y < -10) {
          bubble.y = canvas.height + 10;
          bubble.x = Math.random() * canvas.width;
        }

        // Draw bubble with fluid inner sheen
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fillStyle = colors.bubbleColor;
        ctx.shadowColor = colors.glow;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Bubble highlight reflection dot
        ctx.beginPath();
        ctx.arc(bubble.x - bubble.radius * 0.35, bubble.y - bubble.radius * 0.35, bubble.radius * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.fill();
      });

      // 3. Interactive Ripples
      for (let i = ripples.current.length - 1; i >= 0; i--) {
        const r = ripples.current[i];
        r.radius += flowSpeed === 'turbo' ? 2.5 : 1.4;
        r.opacity -= 0.015;

        if (r.opacity <= 0 || r.radius >= r.maxRadius) {
          ripples.current.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = colors.primary.replace('0.45', `${r.opacity}`);
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, [isEnabled, preset, flowSpeed]);

  const activeColor = getColorConfig(preset);

  return (
    <>
      {/* Liquid Canvas Overlay (non-blocking) */}
      {isEnabled && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none z-30 transition-opacity duration-700"
          style={{
            opacity: isBursting ? 1 : 0.85,
            filter: isBursting ? 'contrast(120%)' : 'none'
          }}
        />
      )}

      {/* Floating Liquid Cooling HUD Controller (Bottom Left) */}
      <div className="fixed bottom-5 left-5 z-40 font-sans select-none">
        <div className="relative">
          {/* Main Floating Pill */}
          <div className={`flex items-center space-x-1 p-1.5 rounded-full backdrop-blur-md shadow-2xl transition-all border ${
            isDark
              ? 'bg-slate-950/85 text-white border-slate-700/60 hover:border-slate-500/80'
              : 'bg-white/95 text-slate-800 border-slate-200 hover:border-slate-300 shadow-xl'
          }`}>
            {/* Pulsing Liquid Indicator Bulb */}
            <button
              onClick={toggleEnabled}
              title={isEnabled ? 'Click to pause liquid cooling' : 'Click to activate liquid cooling'}
              className="relative p-2 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
              style={{
                backgroundColor: isEnabled ? `${activeColor.accent}20` : (isDark ? '#334155' : '#e2e8f0')
              }}
            >
              <Droplets
                className={`w-4 h-4 transition-colors ${
                  isEnabled ? 'animate-bounce' : isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
                style={{
                  color: isEnabled ? activeColor.accent : undefined
                }}
              />
              {isEnabled && (
                <span
                  className="absolute inset-0 rounded-full animate-ping opacity-35"
                  style={{ backgroundColor: activeColor.accent }}
                />
              )}
            </button>

            {/* Live Metrics readout */}
            <div
              onClick={() => setShowControls(prev => !prev)}
              className="cursor-pointer px-2.5 py-1 text-left flex items-center space-x-2"
            >
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] uppercase font-extrabold tracking-wider" style={{ color: activeColor.accent }}>
                    {isEnabled ? (isBursting ? 'CHILL SURGE' : 'LIQUID COOLING') : 'COOLING OFF'}
                  </span>
                  <span className={`text-[9px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {isEnabled ? `${temperature}°C` : 'STANDBY'}
                  </span>
                </div>
                <div className={`text-[9px] font-semibold flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  <span>{isEnabled ? `${flowRate} L/min • ${pumpRpm} RPM` : 'Click to Configure'}</span>
                </div>
              </div>

              {showControls ? (
                <ChevronDown className={`w-3.5 h-3.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
              ) : (
                <ChevronUp className={`w-3.5 h-3.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
              )}
            </div>

            {/* Quick Burst Button */}
            {isEnabled && (
              <button
                onClick={triggerChillBurst}
                disabled={isBursting}
                title="Trigger Instant Cold Surge"
                className={`p-1.5 rounded-full transition-colors disabled:opacity-50 ${
                  isDark
                    ? 'bg-white/10 hover:bg-white/20 text-cyan-300'
                    : 'bg-slate-100 hover:bg-slate-200 text-cyan-600'
                }`}
              >
                <Zap className={`w-3.5 h-3.5 ${isBursting ? 'animate-spin text-amber-500' : ''}`} />
              </button>
            )}
          </div>

          {/* Expandable Control Deck */}
          {showControls && (
            <div className={`absolute bottom-14 left-0 w-80 p-5 rounded-3xl backdrop-blur-xl shadow-2xl space-y-4 animate-in slide-in-from-bottom-3 duration-200 border ${
              isDark
                ? 'bg-slate-950/95 border-slate-800 text-white'
                : 'bg-white/98 border-slate-200 text-slate-900 ring-1 ring-black/5 shadow-2xl'
            }`}>
              <div className={`flex items-center justify-between border-b pb-3 ${
                isDark ? 'border-slate-800' : 'border-slate-100'
              }`}>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-7 h-7 rounded-xl flex items-center justify-center font-bold"
                    style={{ backgroundColor: `${activeColor.accent}25`, color: activeColor.accent }}
                  >
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className={`font-cinzel text-xs font-bold tracking-wide ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      Liquid Cooling Controls
                    </h5>
                    <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Fluid Physics & Circulation</span>
                  </div>
                </div>

                <button
                  onClick={toggleEnabled}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-colors flex items-center space-x-1 ${
                    isEnabled
                      ? 'bg-emerald-500/20 text-emerald-500 dark:text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-500 dark:text-rose-300 border border-rose-500/40'
                  }`}
                >
                  <Power className="w-3 h-3 mr-1" />
                  <span>{isEnabled ? 'Active' : 'Muted'}</span>
                </button>
              </div>

              {/* Coolant Preset Selector */}
              <div className="space-y-1.5 text-xs">
                <label className={`text-[10px] uppercase font-bold tracking-wider ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  Coolant Fluid Chemistry:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPreset('cyan')}
                    className={`p-2 rounded-xl text-left border transition-all ${
                      preset === 'cyan'
                        ? isDark
                          ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-sm'
                          : 'bg-cyan-50 border-cyan-500 text-cyan-950 shadow-sm font-semibold'
                        : isDark
                          ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="font-bold text-[11px] flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block shadow-sm" />
                      <span>Cryo Cyan</span>
                    </div>
                    <span className={`text-[9px] block mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>High-Tech Chill</span>
                  </button>

                  <button
                    onClick={() => setPreset('living-water')}
                    className={`p-2 rounded-xl text-left border transition-all ${
                      preset === 'living-water'
                        ? isDark
                          ? 'bg-sky-950/80 border-sky-400 text-sky-200 shadow-sm'
                          : 'bg-sky-50 border-sky-500 text-sky-950 shadow-sm font-semibold'
                        : isDark
                          ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="font-bold text-[11px] flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block shadow-sm" />
                      <span>Living Water</span>
                    </div>
                    <span className={`text-[9px] block mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Biblical Stream</span>
                  </button>

                  <button
                    onClick={() => setPreset('emerald')}
                    className={`p-2 rounded-xl text-left border transition-all ${
                      preset === 'emerald'
                        ? isDark
                          ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200 shadow-sm'
                          : 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-sm font-semibold'
                        : isDark
                          ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="font-bold text-[11px] flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block shadow-sm" />
                      <span>Emerald Reactor</span>
                    </div>
                    <span className={`text-[9px] block mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Supabase Green</span>
                  </button>

                  <button
                    onClick={() => setPreset('gold')}
                    className={`p-2 rounded-xl text-left border transition-all ${
                      preset === 'gold'
                        ? isDark
                          ? 'bg-amber-950/80 border-amber-400 text-amber-200 shadow-sm'
                          : 'bg-amber-50 border-amber-500 text-amber-950 shadow-sm font-semibold'
                        : isDark
                          ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="font-bold text-[11px] flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block shadow-sm" />
                      <span>Golden Anointing</span>
                    </div>
                    <span className={`text-[9px] block mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Royal Gold Sheen</span>
                  </button>
                </div>
              </div>

              {/* Circulation Speed */}
              <div className="space-y-1.5 text-xs">
                <label className={`text-[10px] uppercase font-bold tracking-wider ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  Pump Circulation Speed:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['calm', 'normal', 'turbo'] as const).map(spd => (
                    <button
                      key={spd}
                      onClick={() => setFlowSpeed(spd)}
                      className={`py-1.5 rounded-xl font-bold uppercase text-[10px] tracking-wider transition-all ${
                        flowSpeed === spd
                          ? 'bg-cyan-500 text-slate-950 shadow-md font-extrabold'
                          : isDark
                            ? 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                            : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                      }`}
                    >
                      {spd}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Telemetry Display */}
              <div className={`rounded-2xl p-3 border space-y-2 text-[11px] ${
                isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    <Thermometer className="w-3.5 h-3.5 text-cyan-500" />
                    <span>Core Temp</span>
                  </span>
                  <span className={`font-mono font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{temperature}°C (Chilled)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    <Gauge className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Fluid Flow Rate</span>
                  </span>
                  <span className={`font-mono font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{flowRate} L/min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
                    <span>Pump RPM</span>
                  </span>
                  <span className={`font-mono font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{pumpRpm} RPM</span>
                </div>
              </div>

              {/* Chill Surge Trigger Button */}
              <button
                onClick={triggerChillBurst}
                disabled={isBursting}
                className="w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center space-x-2"
                style={{
                  backgroundColor: activeColor.accent,
                  color: '#090d16'
                }}
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>{isBursting ? 'Surge In Progress...' : 'Trigger Liquid Chill Surge'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
