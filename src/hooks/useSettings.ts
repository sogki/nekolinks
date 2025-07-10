import { useLocalStorage } from './useLocalStorage';
import { Settings, Theme } from '../types';
import { useMemo } from 'react';

const defaultThemes: Theme[] = [
  {
    name: 'Midnight Neko',
    colors: {
      primary: '#8B5CF6',
      secondary: '#A78BFA',
      accent: '#F472B6',
      background: '#0F0F23',
      surface: '#1A1A2E',
      text: '#E5E7EB',
      textSecondary: '#9CA3AF',
    },
  },
  {
    name: 'Purple Dream',
    colors: {
      primary: '#9333EA',
      secondary: '#A855F7',
      accent: '#EC4899',
      background: '#1E1B4B',
      surface: '#312E81',
      text: '#F3F4F6',
      textSecondary: '#D1D5DB',
    },
  },
  {
    name: 'Sakura Night',
    colors: {
      primary: '#EC4899',
      secondary: '#F472B6',
      accent: '#8B5CF6',
      background: '#0F0F0F',
      surface: '#262626',
      text: '#FAFAFA',
      textSecondary: '#A3A3A3',
    },
  },
];

const defaultSettings: Settings = {
  theme: 'Midnight Neko',
  accentColor: '#F472B6',
  animations: true,
  compactMode: false,
};

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<Settings>('nekolinks-settings', defaultSettings);
  
  // Create current theme with custom accent color applied using useMemo for proper reactivity
  const currentTheme = useMemo(() => {
    const baseTheme = defaultThemes.find(t => t.name === settings.theme) || defaultThemes[0];
    
    // Create a new theme object with the custom accent color
    const updatedTheme: Theme = {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        accent: settings.accentColor,
        // Apply custom colors if they exist
        ...(settings.customColors || {}),
      },
    };
    
    return updatedTheme;
  }, [settings.theme, settings.accentColor, settings.customColors]);
  
  const updateSettings = (updates: Partial<Settings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
  };

  return {
    settings,
    currentTheme,
    defaultThemes,
    updateSettings,
  };
}