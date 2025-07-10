export interface Link {
  id: string;
  url: string;
  title: string;
  favicon?: string;
  imageUrl?: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}

export interface Anime {
  id: string;
  title: string;
  currentEpisode: number;
  totalEpisodes?: number;
  status: 'watching' | 'completed' | 'plan-to-watch' | 'on-hold' | 'dropped';
  rating?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  imageUrl?: string;
}

export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
}

export interface Settings {
  theme: string;
  accentColor: string;
  customColors?: Partial<Theme['colors']>;
  animations: boolean;
  compactMode: boolean;
  _lastUpdated?: number; // Internal field to force re-renders
}

export type Tab = 'links' | 'anime' | 'settings';