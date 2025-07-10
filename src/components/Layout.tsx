import React from "react";
import { motion } from "framer-motion";
import { Link2, Play, Settings, Search } from "lucide-react";
import { Tab } from "../types";
import { CatSilhouette, PawIcon } from "./CatSilhouette";

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
  theme,
}: LayoutProps) {
  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "links", label: "Links", icon: <PawIcon size={20} /> },
    { id: "anime", label: "Anime", icon: <PawIcon size={20} /> },
    { id: "settings", label: "Settings", icon: <Settings size={20} /> },
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
          borderColor: `${theme.colors.primary}33`,
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
                style={{
                  backgroundColor: theme.colors.primary,
                  boxShadow: `0 0 20px ${theme.colors.primary}33`,
                }}
              >
                <PawIcon size={20} color="white" />
              </div>
              <h1
                className="text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent relative"
                style={{
                  backgroundImage: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.accent})`,
                }}
              >
                NekoLinks
                <span className="text-xs absolute -top-1 -right-2 opacity-60">
                  にゃ
                </span>
              </h1>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 max-w-md mx-8 relative"
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
                {/* Floating Paw Icon */}
                <div className="absolute -top-2 -right-2 opacity-30">
                  <PawIcon size={12} color={theme.colors.accent} />
                </div>
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
                      ? "text-white shadow-lg transform scale-105"
                      : "text-gray-400 hover:text-white"
                  }`}
                  style={{
                    backgroundColor:
                      activeTab === tab.id
                        ? theme.colors.primary
                        : "transparent",
                    boxShadow:
                      activeTab === tab.id
                        ? `0 0 20px ${theme.colors.primary}33`
                        : "none",
                  }}
                >
                  {tab.icon}
                  <span className="font-medium">{tab.label}</span>
                  {activeTab === tab.id && (
                    <PawIcon size={12} color="white" className="opacity-60" />
                  )}
                </motion.button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">

        {/* 🌿 Animated Page Transition */}
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

      {/* Footer with Japanese text */}
      <footer
        className="text-center py-6 border-t"
        style={{ borderColor: `${theme.colors.primary}20` }}
      >
        <div className="flex items-center justify-center space-x-4">
          <PawIcon size={16} color={theme.colors.textSecondary} />
          <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
            Made with <span style={{ color: theme.colors.accent }}>♡</span> for
            all the cat and anime lovers
            <span className="ml-2 text-xs opacity-60">猫が大好き</span>
          </p>
          <PawIcon size={16} color={theme.colors.textSecondary} />
        </div>
      </footer>
    </div>
  );
}
