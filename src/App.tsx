import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from './components/Layout';
import { LinkCollector } from './components/LinkCollector';
import { AnimeTracker } from './components/AnimeTracker';
import { Settings } from './components/Settings';
import { useSettings } from './hooks/useSettings';
import { Tab } from './types';

function App() {
  const { currentTheme, settings } = useSettings();
  const [activeTab, setActiveTab] = useState<Tab>('links');
  const [searchQuery, setSearchQuery] = useState('');

  const renderContent = () => {
    switch (activeTab) {
      case 'links':
        return <LinkCollector theme={currentTheme} searchQuery={searchQuery} />;
      case 'anime':
        return <AnimeTracker theme={currentTheme} searchQuery={searchQuery} />;
      case 'settings':
        return <Settings theme={currentTheme} />;
      default:
        return <LinkCollector theme={currentTheme} searchQuery={searchQuery} />;
    }
  };

  return (
    <div 
      className="min-h-screen transition-all duration-500 ease-in-out"
      style={{ 
        backgroundColor: currentTheme.colors.background,
        color: currentTheme.colors.text,
      }}
    >
      <Layout
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        theme={currentTheme}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </Layout>
    </div>
  );
}

export default App;