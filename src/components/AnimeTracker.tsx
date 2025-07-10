import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Star, Play, Check, Clock, Pause, X, Edit2, Trash2, Filter, Upload, Image } from 'lucide-react';
import { Anime } from '../types';
import { useAnime } from '../hooks/useLocalStorage';

interface AnimeTrackerProps {
  theme: any;
  searchQuery: string;
}

const statusConfig = {
  'watching': { label: 'Watching', icon: Play, color: '#10B981' },
  'completed': { label: 'Completed', icon: Check, color: '#8B5CF6' },
  'plan-to-watch': { label: 'Plan to Watch', icon: Clock, color: '#F59E0B' },
  'on-hold': { label: 'On Hold', icon: Pause, color: '#EF4444' },
  'dropped': { label: 'Dropped', icon: X, color: '#6B7280' },
};

export function AnimeTracker({ theme, searchQuery }: AnimeTrackerProps) {
  const { anime, addAnime, updateAnime, deleteAnime, incrementEpisode } = useAnime();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAnime, setEditingAnime] = useState<Anime | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'rating' | 'status'>('date');
  const [newAnime, setNewAnime] = useState({
    title: '',
    currentEpisode: 0,
    totalEpisodes: '',
    status: 'plan-to-watch' as Anime['status'],
    rating: '',
    notes: '',
    imageUrl: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Filter and sort anime
  const filteredAnime = anime
    .filter(item => {
      const matchesSearch = !searchQuery || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.notes?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = !filterStatus || item.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'date':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

  const handleAddAnime = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnime.title.trim()) return;

    addAnime({
      title: newAnime.title,
      currentEpisode: newAnime.currentEpisode,
      totalEpisodes: newAnime.totalEpisodes ? parseInt(newAnime.totalEpisodes) : undefined,
      status: newAnime.status,
      rating: newAnime.rating ? parseInt(newAnime.rating) : undefined,
      notes: newAnime.notes,
      imageUrl: imagePreview || newAnime.imageUrl,
    });

    setNewAnime({
      title: '',
      currentEpisode: 0,
      totalEpisodes: '',
      status: 'plan-to-watch',
      rating: '',
      notes: '',
      imageUrl: '',
    });
    setShowAddForm(false);
    setImageFile(null);
    setImagePreview('');
  };

  const handleUpdateAnime = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAnime || !newAnime.title.trim()) return;

    updateAnime(editingAnime.id, {
      title: newAnime.title,
      currentEpisode: newAnime.currentEpisode,
      totalEpisodes: newAnime.totalEpisodes ? parseInt(newAnime.totalEpisodes) : undefined,
      status: newAnime.status,
      rating: newAnime.rating ? parseInt(newAnime.rating) : undefined,
      notes: newAnime.notes,
      imageUrl: imagePreview || newAnime.imageUrl,
    });

    setEditingAnime(null);
    setNewAnime({
      title: '',
      currentEpisode: 0,
      totalEpisodes: '',
      status: 'plan-to-watch',
      rating: '',
      notes: '',
      imageUrl: '',
    });
    setImageFile(null);
    setImagePreview('');
  };

  const startEditing = (item: Anime) => {
    setEditingAnime(item);
    setNewAnime({
      title: item.title,
      currentEpisode: item.currentEpisode,
      totalEpisodes: item.totalEpisodes?.toString() || '',
      status: item.status,
      rating: item.rating?.toString() || '',
      notes: item.notes || '',
      imageUrl: item.imageUrl || '',
    });
    setImagePreview(item.imageUrl || '');
  };

  const getStatusStats = () => {
    const stats = Object.keys(statusConfig).map(status => ({
      status: status as Anime['status'],
      count: anime.filter(item => item.status === status).length,
      ...statusConfig[status as keyof typeof statusConfig],
    }));
    return stats;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setNewAnime({ ...newAnime, imageUrl: result });
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    }
  };

  const handleImageUrlChange = (url: string) => {
    setNewAnime({ ...newAnime, imageUrl: url });
    if (url) {
      setImagePreview(url);
      setImageFile(null); // Clear file if URL is being used
    }
  };

  const clearImage = () => {
    setImagePreview('');
    setImageFile(null);
    setNewAnime({ ...newAnime, imageUrl: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold" style={{ color: theme.colors.text }}>
            Anime Tracker アニメ
          </h2>
          <p className="text-lg" style={{ color: theme.colors.textSecondary }}>
            {anime.length} anime in your collection
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Filter by status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-lg border transition-colors duration-200"
            style={{
              backgroundColor: theme.colors.surface,
              borderColor: `${theme.colors.primary}33`,
              color: theme.colors.text,
            }}
          >
            <option value="">All Status</option>
            {Object.entries(statusConfig).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>

          {/* Sort options */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-lg border transition-colors duration-200"
            style={{
              backgroundColor: theme.colors.surface,
              borderColor: `${theme.colors.primary}33`,
              color: theme.colors.text,
            }}
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="rating">Sort by Rating</option>
            <option value="status">Sort by Status</option>
          </select>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 rounded-lg text-white font-medium flex items-center space-x-2 shadow-lg"
            style={{ backgroundColor: theme.colors.primary }}
          >
            <Plus size={20} />
            <span>Add Anime</span>
          </motion.button>
        </div>
      </div>

      {/* Status Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {getStatusStats().map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.status}
              whileHover={{ scale: 1.02 }}
              className="p-4 rounded-lg text-center"
              style={{ backgroundColor: theme.colors.surface }}
            >
              <div className="flex items-center justify-center mb-2">
                <Icon size={24} style={{ color: stat.color }} />
              </div>
              <p className="font-semibold text-lg" style={{ color: theme.colors.text }}>
                {stat.count}
              </p>
              <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                {stat.label}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {(showAddForm || editingAnime) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form 
              onSubmit={editingAnime ? handleUpdateAnime : handleAddAnime}
              className="p-6 rounded-lg space-y-4"
              style={{ backgroundColor: theme.colors.surface }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text }}>
                    Title
                  </label>
                  <input
                    type="text"
                    value={newAnime.title}
                    onChange={(e) => setNewAnime({ ...newAnime, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border transition-colors duration-200"
                    style={{
                      backgroundColor: theme.colors.background,
                      borderColor: `${theme.colors.primary}33`,
                      color: theme.colors.text,
                    }}
                    placeholder="Anime title"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text }}>
                    Status
                  </label>
                  <select
                    value={newAnime.status}
                    onChange={(e) => setNewAnime({ ...newAnime, status: e.target.value as Anime['status'] })}
                    className="w-full px-3 py-2 rounded-lg border transition-colors duration-200"
                    style={{
                      backgroundColor: theme.colors.background,
                      borderColor: `${theme.colors.primary}33`,
                      color: theme.colors.text,
                    }}
                  >
                    {Object.entries(statusConfig).map(([key, config]) => (
                      <option key={key} value={key}>{config.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text }}>
                    Current Episode
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newAnime.currentEpisode}
                    onChange={(e) => setNewAnime({ ...newAnime, currentEpisode: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-lg border transition-colors duration-200"
                    style={{
                      backgroundColor: theme.colors.background,
                      borderColor: `${theme.colors.primary}33`,
                      color: theme.colors.text,
                    }}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text }}>
                    Total Episodes (optional)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newAnime.totalEpisodes}
                    onChange={(e) => setNewAnime({ ...newAnime, totalEpisodes: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border transition-colors duration-200"
                    style={{
                      backgroundColor: theme.colors.background,
                      borderColor: `${theme.colors.primary}33`,
                      color: theme.colors.text,
                    }}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text }}>
                    Rating (1-10)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newAnime.rating}
                    onChange={(e) => setNewAnime({ ...newAnime, rating: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border transition-colors duration-200"
                    style={{
                      backgroundColor: theme.colors.background,
                      borderColor: `${theme.colors.primary}33`,
                      color: theme.colors.text,
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text }}>
                  Image
                </label>
                <div className="space-y-3">
                  <input
                    type="url"
                    value={newAnime.imageUrl}
                    onChange={(e) => handleImageUrlChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border transition-colors duration-200"
                    style={{
                      backgroundColor: theme.colors.background,
                      borderColor: `${theme.colors.primary}33`,
                      color: theme.colors.text,
                    }}
                    placeholder="Image URL (optional)"
                  />
                  <div className="flex items-center space-x-2">
                    <span className="text-sm" style={{ color: theme.colors.textSecondary }}>or</span>
                    <label 
                      className="px-3 py-2 rounded-lg border cursor-pointer transition-colors duration-200 text-sm"
                      style={{
                        backgroundColor: theme.colors.surface,
                        borderColor: `${theme.colors.primary}33`,
                        color: theme.colors.text,
                      }}
                    >
                      Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {imagePreview && (
                    <div className="relative w-full h-32 rounded-lg overflow-hidden">
                      <img 
                        src={imagePreview} 
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={clearImage}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black bg-opacity-50 text-white flex items-center justify-center text-sm hover:bg-opacity-70"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text }}>
                  Notes (optional)
                </label>
                <textarea
                  value={newAnime.notes}
                  onChange={(e) => setNewAnime({ ...newAnime, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border transition-colors duration-200 h-20"
                  style={{
                    backgroundColor: theme.colors.background,
                    borderColor: `${theme.colors.primary}33`,
                    color: theme.colors.text,
                  }}
                  placeholder="Your thoughts, quotes, etc..."
                />
              </div>

              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="px-6 py-2 rounded-lg text-white font-medium"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  {editingAnime ? 'Update Anime' : 'Add Anime'}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingAnime(null);
                    setNewAnime({
                      title: '',
                      currentEpisode: 0,
                      totalEpisodes: '',
                      status: 'plan-to-watch',
                      rating: '',
                      notes: '',
                      imageUrl: '',
                    });
                    setImageFile(null);
                    setImagePreview('');
                  }}
                  className="px-6 py-2 rounded-lg border font-medium"
                  style={{ 
                    borderColor: theme.colors.primary,
                    color: theme.colors.primary,
                  }}
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Anime Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredAnime.map((item) => {
            const statusInfo = statusConfig[item.status];
            const StatusIcon = statusInfo.icon;
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -5 }}
                className="rounded-lg border transition-all duration-300 hover:shadow-lg overflow-hidden"
                style={{
                  backgroundColor: theme.colors.surface,
                  borderColor: `${theme.colors.primary}33`,
                }}
              >
                {/* Image */}
                {item.imageUrl && (
                  <div className="w-full h-48 relative">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                )}

                <div className="p-4 space-y-3">
                  {/* Title and Status */}
                  <div className="flex items-start justify-between">
                    <h3 
                      className="font-semibold text-lg leading-tight flex-1"
                      style={{ color: theme.colors.text }}
                    >
                      {item.title}
                    </h3>
                    <div className="flex items-center space-x-1 ml-2">
                      <StatusIcon size={16} style={{ color: statusInfo.color }} />
                      <span className="text-sm" style={{ color: statusInfo.color }}>
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>

                  {/* Episodes and Rating */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm" style={{ color: theme.colors.textSecondary }}>
                        Ep: {item.currentEpisode}
                        {item.totalEpisodes && `/${item.totalEpisodes}`}
                      </span>
                      {item.rating && (
                        <div className="flex items-center space-x-1">
                          <Star size={14} style={{ color: theme.colors.accent }} />
                          <span className="text-sm" style={{ color: theme.colors.text }}>
                            {item.rating}/10
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Episode increment */}
                    {item.status === 'watching' && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => incrementEpisode(item.id)}
                        className="px-2 py-1 rounded text-xs font-medium"
                        style={{
                          backgroundColor: theme.colors.primary,
                          color: 'white',
                        }}
                      >
                        +1 Ep
                      </motion.button>
                    )}
                  </div>

                  {/* Progress Bar */}
                  {item.totalEpisodes && (
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min((item.currentEpisode / item.totalEpisodes) * 100, 100)}%`,
                          backgroundColor: theme.colors.primary,
                        }}
                      />
                    </div>
                  )}

                  {/* Notes */}
                  {item.notes && (
                    <p 
                      className="text-sm line-clamp-2"
                      style={{ color: theme.colors.textSecondary }}
                    >
                      {item.notes}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-end space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => startEditing(item)}
                      className="p-2 rounded-lg hover:bg-opacity-80 transition-colors"
                      style={{ backgroundColor: `${theme.colors.secondary}33` }}
                    >
                      <Edit2 size={16} style={{ color: theme.colors.secondary }} />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteAnime(item.id)}
                      className="p-2 rounded-lg hover:bg-opacity-80 transition-colors"
                      style={{ backgroundColor: `${theme.colors.accent}33` }}
                    >
                      <Trash2 size={16} style={{ color: theme.colors.accent }} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredAnime.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
               style={{ backgroundColor: `${theme.colors.primary}20` }}>
            <Play size={32} style={{ color: theme.colors.primary }} />
          </div>
          <h3 className="text-xl font-semibold mb-2" style={{ color: theme.colors.text }}>
            {searchQuery || filterStatus ? 'No anime found' : 'No anime yet にゃ~'}
          </h3>
          <p className="text-lg mb-6" style={{ color: theme.colors.textSecondary }}>
            {searchQuery || filterStatus 
              ? 'Try adjusting your search or filter criteria' 
              : 'Start tracking your anime journey by adding your first anime'}
          </p>
          {!searchQuery && !filterStatus && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 rounded-lg text-white font-medium"
              style={{ backgroundColor: theme.colors.primary }}
            >
              Add Your First Anime
            </motion.button>
          )}
        </motion.div>
      )}
    </div>
  );
}