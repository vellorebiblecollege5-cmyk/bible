import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppTheme, ThemeConfig } from '../types';

export const THEME_CONFIGS: Record<AppTheme, ThemeConfig> = {
  'pure-light': {
    id: 'pure-light',
    name: 'Pure Collegiate Light',
    subtitle: 'Luminous crisp academic white with royal sapphire & gold',
    isDark: false,
    accentColor: '#2563eb',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-900',
    previewBg: '#ffffff',
    previewBorder: '#2563eb',
    description: 'Crisp, modern, high-contrast daylight aesthetic with brilliant white surfaces, crystal sapphire accents, and effortless readability.'
  },
  'heritage-light': {
    id: 'heritage-light',
    name: 'Heritage Ivory & Gold',
    subtitle: 'Crisp academic parchment with collegiate blue & warm gold',
    isDark: false,
    accentColor: '#d97706',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-800',
    previewBg: '#faf8f5',
    previewBorder: '#d97706',
    description: 'Classical, illuminated parchment aesthetic for bright daylight reading.'
  },
  'midnight-regal': {
    id: 'midnight-regal',
    name: 'Midnight & Gold',
    subtitle: 'Cosmic royal navy with luminescent gold accents',
    isDark: true,
    accentColor: '#f59e0b',
    badgeBg: 'bg-amber-500/20',
    badgeText: 'text-amber-400',
    previewBg: '#0b132b',
    previewBorder: '#f59e0b',
    description: 'Dignified deep navy academic ambience with polished amber gold highlights.'
  },
  'cryo-cyan': {
    id: 'cryo-cyan',
    name: 'Cryo Liquid Coolant',
    subtitle: 'Deep oceanic blue with fluorescent cyan stream reflections',
    isDark: true,
    accentColor: '#06b6d4',
    badgeBg: 'bg-cyan-500/20',
    badgeText: 'text-cyan-400',
    previewBg: '#06101e',
    previewBorder: '#06b6d4',
    description: 'Harmonizes perfectly with the active liquid cooling engine and living water fluid caustics.'
  },
  'emerald-eden': {
    id: 'emerald-eden',
    name: 'Sacred Emerald Eden',
    subtitle: 'Deep botanical obsidian with radiant mint & emerald glow',
    isDark: true,
    accentColor: '#10b981',
    badgeBg: 'bg-emerald-500/20',
    badgeText: 'text-emerald-400',
    previewBg: '#051910',
    previewBorder: '#10b981',
    description: 'Serene biblical garden aesthetic evoking vitality, growth, and living streams.'
  },
  'crimson-theology': {
    id: 'crimson-theology',
    name: 'Imperial Crimson Seminary',
    subtitle: 'Velvet cardinal burgundy with burnished bronze & rose radiance',
    isDark: true,
    accentColor: '#f43f5e',
    badgeBg: 'bg-rose-500/20',
    badgeText: 'text-rose-400',
    previewBg: '#18090e',
    previewBorder: '#f43f5e',
    description: 'Solemn and historic theological aesthetic honoring martyrdom and redemptive history.'
  }
};

interface ThemeContextType {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  config: ThemeConfig;
  isDark: boolean;
  cycleTheme: () => void;
  toggleDarkLight: () => void;
  allThemes: ThemeConfig[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_ORDER: AppTheme[] = [
  'pure-light',
  'heritage-light',
  'midnight-regal',
  'cryo-cyan',
  'emerald-eden',
  'crimson-theology'
];

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to Pure Collegiate Light for bright, crisp, high-contrast reading
  const [theme, setThemeState] = useState<AppTheme>(() => {
    const saved = localStorage.getItem('icbc_app_theme_v2') as AppTheme;
    if (saved && THEME_CONFIGS[saved]) {
      return saved;
    }
    return 'pure-light';
  });

  const config = THEME_CONFIGS[theme] || THEME_CONFIGS['pure-light'];
  const isDark = config.isDark;

  const setTheme = (newTheme: AppTheme) => {
    if (THEME_CONFIGS[newTheme]) {
      setThemeState(newTheme);
      localStorage.setItem('icbc_app_theme_v2', newTheme);
      localStorage.setItem('icbc_app_theme', newTheme);
    }
  };

  const cycleTheme = () => {
    const currentIndex = THEME_ORDER.indexOf(theme);
    const nextIndex = (currentIndex + 1) % THEME_ORDER.length;
    setTheme(THEME_ORDER[nextIndex]);
  };

  const toggleDarkLight = () => {
    if (isDark) {
      setTheme('pure-light');
    } else {
      setTheme('midnight-regal');
    }
  };

  // Sync with HTML root data-theme attribute and dark class
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme, isDark]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        config,
        isDark,
        cycleTheme,
        toggleDarkLight,
        allThemes: Object.values(THEME_CONFIGS)
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
