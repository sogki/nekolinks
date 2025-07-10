import React from 'react';
import { motion } from 'framer-motion';
import { Link2, Play, Settings, Search, Heart } from 'lucide-react';
import { Tab } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  theme: any;
}

export function Layout({ 
  children, 
  activeTab, 
  onTabChange, 
  searchQuery, 
  onSearchChange, 
  theme 
}: LayoutProps) {
  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'links', label: 'Links', icon: <Link2 size={20} /> },
    { id: 'anime', label: 'Anime', icon: <Play size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <div 
      className="min-h-screen transition-colors duration-500 ease-in-out"
      style={{ backgroundColor: theme.colors.background }}
    >
      {/* Header */}
      <header 
        className="sticky top-0 z-50 backdrop-blur-sm border-b transition-colors duration-500 ease-in-out"
        style={{ 
          backgroundColor: `${theme.colors.surface}CC`,
          borderColor: `${theme.colors.primary}33`
        }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: theme.colors.primary }}
              >
                <Heart size={16} className="text-white" />
              </div>
              <h1 
                className="text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent"
                style={{ 
                  backgroundImage: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.accent})`
                }}
              >
                NekoLinks
              </h1>
            </motion.div>

            {/* Search Bar */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 max-w-md mx-8"
            >
              <div className="relative">
                <Search 
                  size={20} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search links and anime..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: theme.colors.surface,
                    borderColor: `${theme.colors.primary}33`,
                    color: theme.colors.text,
                    focusRingColor: `${theme.colors.primary}66`,
                  }}
                />
              </div>
            </motion.div>

            {/* Navigation */}
            <nav className="flex space-x-1">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onTabChange(tab.id)}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  style={{
                    backgroundColor: activeTab === tab.id ? theme.colors.primary : 'transparent',
                  }}
                >
                  {tab.icon}
                  <span className="font-medium">{tab.label}</span>
                </motion.button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}