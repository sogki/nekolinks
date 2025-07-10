import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Zap, Layout, Save } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

interface SettingsProps {
  theme: any;
}

export function Settings({ theme }: SettingsProps) {
  const { settings, currentTheme, defaultThemes, updateSettings } = useSettings();

  const accentColors = [
    '#F472B6', '#EC4899', '#DB2777', '#BE185D',
    '#8B5CF6', '#7C3AED', '#6D28D9', '#5B21B6',
    '#3B82F6', '#2563EB', '#1D4ED8', '#1E40AF',
    '#10B981', '#059669', '#047857', '#065F46',
    '#F59E0B', '#D97706', '#B45309', '#92400E',
    '#EF4444', '#DC2626', '#B91C1C', '#991B1B',
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold mb-2" style={{ color: theme.colors.text }}>
          Settings
        </h2>
        <p className="text-lg" style={{ color: theme.colors.textSecondary }}>
          Customize your NekoLinks experience
        </p>
      </div>

      {/* Theme Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-lg"
        style={{ backgroundColor: theme.colors.surface }}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${theme.colors.primary}33` }}
          >
            <Palette size={20} style={{ color: theme.colors.primary }} />
          </div>
          <div>
            <h3 className="text-xl font-semibold" style={{ color: theme.colors.text }}>
              Theme
            </h3>
            <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
              Choose your preferred color scheme
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {defaultThemes.map((themeOption) => (
            <motion.div
              key={themeOption.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => updateSettings({ theme: themeOption.name })}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                settings.theme === themeOption.name 
                  ? 'border-opacity-100 shadow-lg' 
                  : 'border-opacity-30 hover:border-opacity-60'
              }`}
              style={{ 
                backgroundColor: themeOption.colors.surface,
                borderColor: themeOption.colors.primary,
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold" style={{ color: themeOption.colors.text }}>
                  {themeOption.name}
                </h4>
                {settings.theme === themeOption.name && (
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: themeOption.colors.primary }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-3 h-3 rounded-full bg-white"
                    />
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: themeOption.colors.primary }}
                />
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: themeOption.colors.secondary }}
                />
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: themeOption.colors.accent }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Accent Color */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 rounded-lg"
        style={{ backgroundColor: theme.colors.surface }}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${theme.colors.accent}33` }}
          >
            <Zap size={20} style={{ color: theme.colors.accent }} />
          </div>
          <div>
            <h3 className="text-xl font-semibold" style={{ color: theme.colors.text }}>
              Accent Color
            </h3>
            <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
              Pick your favorite accent color
            </p>
          </div>
        </div>

        <div className="grid grid-cols-6 md:grid-cols-12 gap-3">
          {accentColors.map((color) => (
            <motion.button
              key={color}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => updateSettings({ accentColor: color })}
              className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 relative ${
                settings.accentColor === color 
                  ? 'border-white shadow-lg scale-110' 
                  : 'border-transparent hover:border-white hover:border-opacity-30'
              }`}
              style={{ backgroundColor: color }}
            >
              {settings.accentColor === color && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-lg" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* App Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 rounded-lg"
        style={{ backgroundColor: theme.colors.surface }}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${theme.colors.secondary}33` }}
          >
            <Layout size={20} style={{ color: theme.colors.secondary }} />
          </div>
          <div>
            <h3 className="text-xl font-semibold" style={{ color: theme.colors.text }}>
              App Preferences
            </h3>
            <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
              Customize your app experience
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium" style={{ color: theme.colors.text }}>
                Animations
              </h4>
              <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                Enable smooth animations and transitions
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => updateSettings({ animations: !settings.animations })}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                settings.animations ? 'bg-opacity-100' : 'bg-opacity-30'
              }`}
              style={{ backgroundColor: theme.colors.primary }}
            >
              <motion.div
                animate={{ x: settings.animations ? 24 : 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full"
              />
            </motion.button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium" style={{ color: theme.colors.text }}>
                Compact Mode
              </h4>
              <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                Use a more compact layout to fit more content
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => updateSettings({ compactMode: !settings.compactMode })}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                settings.compactMode ? 'bg-opacity-100' : 'bg-opacity-30'
              }`}
              style={{ backgroundColor: theme.colors.primary }}
            >
              <motion.div
                animate={{ x: settings.compactMode ? 24 : 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full"
              />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Storage Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-lg"
        style={{ backgroundColor: theme.colors.surface }}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${theme.colors.primary}33` }}
          >
            <Save size={20} style={{ color: theme.colors.primary }} />
          </div>
          <div>
            <h3 className="text-xl font-semibold" style={{ color: theme.colors.text }}>
              Storage
            </h3>
            <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
              Your data is stored locally in your browser
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span style={{ color: theme.colors.text }}>Storage Type</span>
            <span 
              className="px-3 py-1 rounded-full text-sm"
              style={{ 
                backgroundColor: `${theme.colors.primary}33`,
                color: theme.colors.primary,
              }}
            >
              Local Storage
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span style={{ color: theme.colors.text }}>Sync Status</span>
            <span 
              className="px-3 py-1 rounded-full text-sm"
              style={{ 
                backgroundColor: `${theme.colors.secondary}33`,
                color: theme.colors.secondary,
              }}
            >
              Offline Only
            </span>
          </div>
          
          <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: theme.colors.background }}>
            <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
              💡 <strong>Coming Soon:</strong> Sync your data across devices with Database integration. 
              Stay tuned for cloud backup and multi-device sync features!
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}