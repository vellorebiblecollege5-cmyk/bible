import React from 'react';
import { useLiquidCooling } from '../context/LiquidCoolingContext';
import { useCollege } from '../context/CollegeContext';
import {
  Droplets,
  Activity,
  Zap,
  Server,
  Database,
  Thermometer,
  ShieldCheck,
  RefreshCw,
  Gauge
} from 'lucide-react';

export const LiquidCooledServerWidget: React.FC = () => {
  const {
    isEnabled,
    preset,
    temperature,
    flowRate,
    pumpRpm,
    triggerChillBurst,
    isBursting
  } = useLiquidCooling();

  const { supabaseStatus, syncWithSupabase } = useCollege();

  const getThemeColors = () => {
    switch (preset) {
      case 'cyan':
        return {
          tubeGrad: 'from-cyan-500/40 via-sky-600/30 to-blue-900/40',
          fluid: '#06b6d4',
          bubbleBg: 'bg-cyan-300',
          glowBorder: 'border-cyan-500/50 shadow-cyan-500/20'
        };
      case 'living-water':
        return {
          tubeGrad: 'from-sky-400/40 via-blue-600/30 to-indigo-900/40',
          fluid: '#38bdf8',
          bubbleBg: 'bg-sky-200',
          glowBorder: 'border-sky-400/50 shadow-sky-400/20'
        };
      case 'emerald':
        return {
          tubeGrad: 'from-emerald-500/40 via-teal-600/30 to-emerald-950/40',
          fluid: '#10b981',
          bubbleBg: 'bg-emerald-300',
          glowBorder: 'border-emerald-500/50 shadow-emerald-500/20'
        };
      case 'gold':
        return {
          tubeGrad: 'from-amber-400/40 via-amber-600/30 to-yellow-950/40',
          fluid: '#f59e0b',
          bubbleBg: 'bg-amber-200',
          glowBorder: 'border-amber-400/50 shadow-amber-400/20'
        };
    }
  };

  const theme = getThemeColors();

  return (
    <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden font-sans space-y-6">
      {/* Background coolant fluid glow */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-700"
        style={{ backgroundColor: theme.fluid }}
      />

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 relative z-10">
        <div className="flex items-center space-x-3.5">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-lg transition-transform hover:scale-105"
            style={{ backgroundColor: `${theme.fluid}25`, color: theme.fluid }}
          >
            <Droplets className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                Active Cryogenic Architecture
              </span>
              <span
                className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider"
                style={{ backgroundColor: `${theme.fluid}20`, color: theme.fluid }}
              >
                {isEnabled ? 'Liquid Cooled' : 'Air Cooled'}
              </span>
            </div>
            <h3 className="font-cinzel text-xl font-bold text-white">
              Supabase DB Engine Liquid Cooling System
            </h3>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={triggerChillBurst}
            disabled={isBursting}
            className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 shadow"
            style={{
              backgroundColor: theme.fluid,
              color: '#020617'
            }}
          >
            <Zap className={`w-3.5 h-3.5 ${isBursting ? 'animate-spin' : ''}`} />
            <span>{isBursting ? 'Surging Coolant...' : 'Boost Chill Surge'}</span>
          </button>

          <button
            onClick={() => syncWithSupabase()}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center space-x-1 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Flush Sync</span>
          </button>
        </div>
      </div>

      {/* Visual Liquid Coolant Tubes Simulation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center relative z-10">
        {/* Left: Coolant Reservoir Tube 1 */}
        <div className="relative bg-slate-900/90 rounded-3xl p-5 border border-slate-800 space-y-3 shadow-inner">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">
              Primary Intake Manifold
            </span>
            <span className="font-mono text-xs font-bold text-emerald-400">OPTIMAL</span>
          </div>

          {/* Transparent Acrylic Liquid Tube with Rising Bubbles */}
          <div className={`h-24 rounded-2xl bg-gradient-to-b ${theme.tubeGrad} relative overflow-hidden border ${theme.glowBorder} shadow-lg`}>
            {/* Dynamic liquid fluid wave surface */}
            <div
              className="absolute inset-0 opacity-40 animate-pulse"
              style={{
                backgroundImage: `radial-gradient(circle at 50% 50%, ${theme.fluid} 20%, transparent 80%)`
              }}
            />

            {/* Rising Bubbles inside tube */}
            <div className="absolute inset-0 flex justify-around items-end overflow-hidden pb-1">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${theme.bubbleBg} opacity-75 animate-bounce`}
                  style={{
                    animationDuration: `${1.2 + (i % 3) * 0.4}s`,
                    animationDelay: `${i * 0.2}s`,
                    boxShadow: `0 0 8px ${theme.fluid}`
                  }}
                />
              ))}
            </div>

            {/* Fluid level indicator line */}
            <div
              className="absolute top-2 left-0 right-0 h-0.5 opacity-60"
              style={{ backgroundColor: theme.fluid }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Core Temperature</span>
            <span className="font-mono font-bold text-white flex items-center gap-1">
              <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
              <span>{temperature}°C</span>
            </span>
          </div>
        </div>

        {/* Center: Pump Engine Core */}
        <div className="relative bg-slate-900/90 rounded-3xl p-5 border border-slate-800 text-center space-y-3 shadow-inner">
          <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center relative shadow-xl"
            style={{
              backgroundColor: `${theme.fluid}20`,
              boxShadow: `0 0 25px ${theme.fluid}40`
            }}
          >
            {/* Rotating pump impeller */}
            <div
              className="w-10 h-10 rounded-full border-2 border-dashed flex items-center justify-center animate-spin"
              style={{
                borderColor: theme.fluid,
                animationDuration: isBursting ? '0.8s' : '3.5s'
              }}
            >
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.fluid }} />
            </div>
          </div>

          <div>
            <div className="font-cinzel text-sm font-bold text-white">Mag-Drive Coolant Pump</div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              Speed: <strong className="text-white">{pumpRpm} RPM</strong> • Active Circulation
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex justify-between text-[11px] text-slate-400">
            <span>Throughput Rate</span>
            <span className="font-mono font-bold text-emerald-400">{flowRate} L/min</span>
          </div>
        </div>

        {/* Right: Coolant Return Radiator */}
        <div className="relative bg-slate-900/90 rounded-3xl p-5 border border-slate-800 space-y-3 shadow-inner">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">
              Radiator Return Loop
            </span>
            <span className="font-mono text-xs font-bold text-cyan-400">CHILLED</span>
          </div>

          {/* Secondary Liquid Radiator Coil with Shimmer */}
          <div className={`h-24 rounded-2xl bg-gradient-to-t ${theme.tubeGrad} relative overflow-hidden border ${theme.glowBorder} shadow-lg`}>
            {/* Horizontal cooling ribs */}
            <div className="absolute inset-0 flex flex-col justify-between py-2 opacity-25">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-0.5 w-full bg-white" />
              ))}
            </div>

            {/* Glowing return fluid line */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-slate-950/80 backdrop-blur-sm"
                style={{ color: theme.fluid }}
              >
                Zero Thermal Throttling
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>DB Latency Status</span>
            <span className="font-mono font-bold text-white flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>18 ms (Sub-second)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Telemetry Status Bar */}
      <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300 relative z-10">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>
            Database State:{' '}
            <strong className="text-white">
              {supabaseStatus.connected ? 'Cloud Cluster Online & Synchronized' : 'Local Memory Cache Running'}
            </strong>
          </span>
        </div>

        <div className="flex items-center space-x-4 text-[11px] text-slate-400">
          <span>Coolant Fluid: <strong className="text-white capitalize">{preset.replace('-', ' ')}</strong></span>
          <span>Cooling Health: <strong className="text-emerald-400">100% Peak Efficiency</strong></span>
        </div>
      </div>
    </div>
  );
};
