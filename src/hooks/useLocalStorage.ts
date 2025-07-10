import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (!item || item === 'undefined') {
        // Remove corrupted "undefined" value if present
        window.localStorage.removeItem(key);
        return initialValue;
      }
      return JSON.parse(item);
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      window.localStorage.removeItem(key); // Clean corrupted value
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

export function useLinks() {
  const [links, setLinks] = useLocalStorage<import('../types').Link[]>('nekolinks-links', []);
  
  const addLink = (link: Omit<import('../types').Link, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newLink: import('../types').Link = {
      ...link,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setLinks([...links, newLink]);
    return newLink;
  };

  const updateLink = (id: string, updates: Partial<import('../types').Link>) => {
    setLinks(links.map(link => 
      link.id === id 
        ? { ...link, ...updates, updatedAt: new Date() }
        : link
    ));
  };

  const deleteLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
  };

  const toggleFavorite = (id: string) => {
    updateLink(id, { isFavorite: !links.find(l => l.id === id)?.isFavorite });
  };

  return {
    links,
    addLink,
    updateLink,
    deleteLink,
    toggleFavorite,
  };
}

export function useAnime() {
  const [anime, setAnime] = useLocalStorage<import('../types').Anime[]>('nekolinks-anime', []);
  
  const addAnime = (animeData: Omit<import('../types').Anime, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAnime: import('../types').Anime = {
      ...animeData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setAnime([...anime, newAnime]);
    return newAnime;
  };

  const updateAnime = (id: string, updates: Partial<import('../types').Anime>) => {
    setAnime(anime.map(item => 
      item.id === id 
        ? { ...item, ...updates, updatedAt: new Date() }
        : item
    ));
  };

  const deleteAnime = (id: string) => {
    setAnime(anime.filter(item => item.id !== id));
  };

  const incrementEpisode = (id: string) => {
    const item = anime.find(a => a.id === id);
    if (item && (!item.totalEpisodes || item.currentEpisode < item.totalEpisodes)) {
      const newEpisode = item.currentEpisode + 1;
      const newStatus = item.totalEpisodes && newEpisode >= item.totalEpisodes 
        ? 'completed' 
        : item.status;
      updateAnime(id, { currentEpisode: newEpisode, status: newStatus });
    }
  };

  return {
    anime,
    addAnime,
    updateAnime,
    deleteAnime,
    incrementEpisode,
  };
}
