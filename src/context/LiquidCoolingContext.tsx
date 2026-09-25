import React, { createContext, useContext, useState, useEffect } from 'react';

export type CoolantPreset = 'cyan' | 'living-water' | 'emerald' | 'gold';
export type FlowSpeed = 'calm' | 'normal' | 'turbo';

interface LiquidCoolingContextType {
  isEnabled: boolean;
  toggleEnabled: () => void;
  setIsEnabled: (enabled: boolean) => void;
  preset: CoolantPreset;
  setPreset: (preset: CoolantPreset) => void;
  flowSpeed: FlowSpeed;
  setFlowSpeed: (speed: FlowSpeed) => void;
  temperature: number;
  flowRate: number;
  pumpRpm: number;
  triggerChillBurst: () => void;
  isBursting: boolean;
}

const defaultContextValue: LiquidCoolingContextType = {
  isEnabled: false,
  toggleEnabled: () => {},
  setIsEnabled: () => {},
  preset: 'cyan',
  setPreset: () => {},
  flowSpeed: 'normal',
  setFlowSpeed: () => {},
  temperature: 21.4,
  flowRate: 4.2,
  pumpRpm: 3150,
  triggerChillBurst: () => {},
  isBursting: false
};

const LiquidCoolingContext = createContext<LiquidCoolingContextType>(defaultContextValue);

export const LiquidCoolingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isEnabled, setIsEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('icbc_liquid_cooling_enabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [preset, setPreset] = useState<CoolantPreset>(() => {
    return (localStorage.getItem('icbc_liquid_cooling_preset') as CoolantPreset) || 'cyan';
  });

  const [flowSpeed, setFlowSpeed] = useState<FlowSpeed>('normal');
  const [temperature, setTemperature] = useState<number>(21.4);
  const [flowRate, setFlowRate] = useState<number>(4.2);
  const [pumpRpm, setPumpRpm] = useState<number>(3150);
  const [isBursting, setIsBursting] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('icbc_liquid_cooling_enabled', JSON.stringify(isEnabled));
  }, [isEnabled]);

  useEffect(() => {
    localStorage.setItem('icbc_liquid_cooling_preset', preset);
  }, [preset]);

  // Subtle real-time oscillation of temperature and coolant flow
  useEffect(() => {
    if (!isEnabled) return;
    const interval = setInterval(() => {
      setTemperature(prev => {
        const delta = (Math.random() - 0.5) * 0.4;
        const target = flowSpeed === 'turbo' ? 18.2 : flowSpeed === 'calm' ? 24.1 : 21.4;
        return Number((prev * 0.85 + target * 0.15 + delta).toFixed(1));
      });

      setFlowRate(prev => {
        const target = flowSpeed === 'turbo' ? 6.8 : flowSpeed === 'calm' ? 2.5 : 4.2;
        const delta = (Math.random() - 0.5) * 0.2;
        return Number((prev * 0.9 + target * 0.1 + delta).toFixed(2));
      });

      setPumpRpm(prev => {
        const target = flowSpeed === 'turbo' ? 4500 : flowSpeed === 'calm' ? 1800 : 3150;
        const delta = Math.floor((Math.random() - 0.5) * 80);
        return Math.floor(prev * 0.85 + target * 0.15 + delta);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isEnabled, flowSpeed]);

  const toggleEnabled = () => {
    setIsEnabled(prev => !prev);
  };

  const triggerChillBurst = () => {
    setIsBursting(true);
    setFlowSpeed('turbo');
    setTemperature(16.5);
    setPumpRpm(4800);
    setFlowRate(7.4);

    setTimeout(() => {
      setIsBursting(false);
      setFlowSpeed('normal');
    }, 4000);
  };

  return (
    <LiquidCoolingContext.Provider
      value={{
        isEnabled,
        toggleEnabled,
        setIsEnabled,
        preset,
        setPreset,
        flowSpeed,
        setFlowSpeed,
        temperature,
        flowRate,
        pumpRpm,
        triggerChillBurst,
        isBursting
      }}
    >
      {children}
    </LiquidCoolingContext.Provider>
  );
};

export const useLiquidCooling = (): LiquidCoolingContextType => {
  const context = useContext(LiquidCoolingContext);
  return context || defaultContextValue;
};
