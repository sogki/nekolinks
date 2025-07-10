import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ExternalLink, Heart, Tag, Copy, Edit2, Trash2, Filter, Link2, Upload, Image } from 'lucide-react';
import { Link } from '../types';
import { useLinks } from '../hooks/useLocalStorage';
import { fetchLinkMetadata, isValidUrl } from '../utils/linkUtils';

interface LinkCollectorProps {
  theme: any;
  searchQuery: string;
}

export function LinkCollector({ theme, searchQuery }: LinkCollectorProps) {
  const { links, addLink, updateLink, deleteLink, toggleFavorite } = useLinks();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [filterTag, setFilterTag] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'favorites'>('date');
  const [newLink, setNewLink] = useState({ url: '', title: '', tags: '', notes: '', imageUrl: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Get all unique tags
  const allTags = Array.from(new Set(links.flatMap(link => link.tags)));

  // Filter and sort links
  const filteredLinks = links
    .filter(link => {
      const matchesSearch = !searchQuery || 
        link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesTag = !filterTag || link.tags.includes(filterTag);
      
      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'favorites':
          return b.isFavorite === a.isFavorite ? 0 : b.isFavorite ? 1 : -1;
        case 'date':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLink.url || !isValidUrl(newLink.url)) return;

    setIsLoading(true);
    try {
      const metadata = await fetchLinkMetadata(newLink.url);
      const tags = newLink.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      
      addLink({
        url: newLink.url,
        title: newLink.title || metadata.title,
        favicon: metadata.favicon,
        imageUrl: imagePreview || newLink.imageUrl,
        tags,
        notes: newLink.notes,
        isFavorite: false,
      });

      setNewLink({ url: '', title: '', tags: '', notes: '', imageUrl: '' });
      setShowAddForm(false);
      setImageFile(null);
      setImagePreview('');
    } catch (error) {
      console.error('Error adding link:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLink) return;

    const tags = newLink.tags.split(',').map(tag => tag.trim()).filter(Boolean);
    updateLink(editingLink.id, {
      title: newLink.title,
      imageUrl: imagePreview || newLink.imageUrl,
      tags,
      notes: newLink.notes,
    });

    setEditingLink(null);
    setNewLink({ url: '', title: '', tags: '', notes: '', imageUrl: '' });
    setImageFile(null);
    setImagePreview('');
  };

  const startEditing = (link: Link) => {
    setEditingLink(link);
    setNewLink({
      url: link.url,
      title: link.title,
      imageUrl: link.imageUrl || '',
      tags: link.tags.join(', '),
      notes: link.notes || '',
    });
    setImagePreview(link.imageUrl || '');
  };

  const copyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    // You could add a toast notification here
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (url: string) => {
    setNewLink({ ...newLink, imageUrl: url });
    if (url && !imageFile) {
      setImagePreview(url);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold" style={{ color: theme.colors.text }}>
            Link Collection
          </h2>
          <p className="text-lg" style={{ color: theme.colors.textSecondary }}>
            {links.length} links saved
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Filter by tag */}
          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="px-3 py-2 rounded-lg border transition-colors duration-200"
            style={{
              backgroundColor: theme.colors.surface,
              borderColor: `${theme.colors.primary}33`,
              color: theme.colors.text,
            }}
          >
            <option value="">All Tags</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
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
            <option value="favorites">Sort by Favorites</option>
          </select>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 rounded-lg text-white font-medium flex items-center space-x-2 shadow-lg"
            style={{ backgroundColor: theme.colors.primary }}
          >
            <Plus size={20} />
            <span>Add Link</span>
          </motion.button>
        </div>
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {(showAddForm || editingLink) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form 
              onSubmit={editingLink ? handleUpdateLink : handleAddLink}
              className="p-6 rounded-lg space-y-4"
              style={{ backgroundColor: theme.colors.surface }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text }}>
                    URL
                  </label>
                  <input
                    type="url"
                    value={newLink.url}
                    onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                    disabled={!!editingLink}
                    className="w-full px-3 py-2 rounded-lg border transition-colors duration-200"
                    style={{
                      backgroundColor: theme.colors.background,
                      borderColor: `${theme.colors.primary}33`,
                      color: theme.colors.text,
                    }}
                    placeholder="https://example.com"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text }}>
                    Title (optional)
                  </label>
                  <input
                    type="text"
                    value={newLink.title}
                    onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border transition-colors duration-200"
                    style={{
                      backgroundColor: theme.colors.background,
                      borderColor: `${theme.colors.primary}33`,
                      color: theme.colors.text,
                    }}
                    placeholder="Auto-fetched if empty"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text }}>
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={newLink.tags}
                  onChange={(e) => setNewLink({ ...newLink, tags: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border transition-colors duration-200"
                  style={{
                    backgroundColor: theme.colors.background,
                    borderColor: `${theme.colors.primary}33`,
                    color: theme.colors.text,
                  }}
                  placeholder="react, tutorial, coding"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text }}>
                  Image
                </label>
                <div className="space-y-3">
                  <input
                    type="url"
                    value={newLink.imageUrl}
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
                        onClick={() => {
                          setImagePreview('');
                          setImageFile(null);
                          setNewLink({ ...newLink, imageUrl: '' });
                        }}
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
                  value={newLink.notes}
                  onChange={(e) => setNewLink({ ...newLink, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border transition-colors duration-200 h-20"
                  style={{
                    backgroundColor: theme.colors.background,
                    borderColor: `${theme.colors.primary}33`,
                    color: theme.colors.text,
                  }}
                  placeholder="Additional notes..."
                />
              </div>

              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 rounded-lg text-white font-medium disabled:opacity-50"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  {isLoading ? 'Saving...' : editingLink ? 'Update Link' : 'Save Link'}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingLink(null);
                    setNewLink({ url: '', title: '', tags: '', notes: '', imageUrl: '' });
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

      {/* Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredLinks.map((link) => (
            <motion.div
              key={link.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ y: -5 }}
              className="p-4 rounded-lg border transition-all duration-300 hover:shadow-lg"
              style={{
                backgroundColor: theme.colors.surface,
                borderColor: `${theme.colors.primary}33`,
              }}
            >
              {/* Image */}
              {link.imageUrl && (
                <div className="w-full h-48 relative">
                  <img 
                    src={link.imageUrl} 
                    alt={link.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
              )}

              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {link.favicon && (
                    <img 
                      src={link.favicon} 
                      alt=""
                      className="w-6 h-6 rounded"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <div className="flex-1">
                    <h3 
                      className={`font-semibold leading-tight ${link.imageUrl ? 'text-base' : 'text-lg'}`}
                      style={{ color: theme.colors.text }}
                    >
                      {link.title}
                    </h3>
                    <p 
                      className="text-sm truncate"
                      style={{ color: theme.colors.textSecondary }}
                    >
                      {link.url}
                    </p>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleFavorite(link.id)}
                  className={`p-1 rounded ${link.isFavorite ? 'text-red-500' : 'text-gray-400'}`}
                >
                  <Heart size={16} fill={link.isFavorite ? 'currentColor' : 'none'} />
                </motion.button>
              </div>

              {/* Tags */}
              {link.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {link.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs rounded-full"
                      style={{
                        backgroundColor: `${theme.colors.primary}33`,
                        color: theme.colors.primary,
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Notes */}
              {link.notes && (
                <p 
                  className="text-sm mb-3 line-clamp-2"
                  style={{ color: theme.colors.textSecondary }}
                >
                  {link.notes}
                </p>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => window.open(link.url, '_blank')}
                    className="p-2 rounded-lg hover:bg-opacity-80 transition-colors"
                    style={{ backgroundColor: `${theme.colors.primary}33` }}
                  >
                    <ExternalLink size={16} style={{ color: theme.colors.primary }} />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => copyLink(link.url)}
                    className="p-2 rounded-lg hover:bg-opacity-80 transition-colors"
                    style={{ backgroundColor: `${theme.colors.accent}33` }}
                  >
                    <Copy size={16} style={{ color: theme.colors.accent }} />
                  </motion.button>
                </div>

                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => startEditing(link)}
                    className="p-2 rounded-lg hover:bg-opacity-80 transition-colors"
                    style={{ backgroundColor: `${theme.colors.secondary}33` }}
                  >
                    <Edit2 size={16} style={{ color: theme.colors.secondary }} />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => deleteLink(link.id)}
                    className="p-2 rounded-lg hover:bg-opacity-80 transition-colors"
                    style={{ backgroundColor: `${theme.colors.accent}33` }}
                  >
                    <Trash2 size={16} style={{ color: theme.colors.accent }} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredLinks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
               style={{ backgroundColor: `${theme.colors.primary}20` }}>
            <Link2 size={32} style={{ color: theme.colors.primary }} />
          </div>
          <h3 className="text-xl font-semibold mb-2" style={{ color: theme.colors.text }}>
            {searchQuery || filterTag ? 'No links found' : 'No links yet'}
          </h3>
          <p className="text-lg mb-6" style={{ color: theme.colors.textSecondary }}>
            {searchQuery || filterTag 
              ? 'Try adjusting your search or filter criteria' 
              : 'Start building your link collection by adding your first link'}
          </p>
          {!searchQuery && !filterTag && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 rounded-lg text-white font-medium"
              style={{ backgroundColor: theme.colors.primary }}
            >
              Add Your First Link
            </motion.button>
          )}
        </motion.div>
      )}
    </div>
  );
}