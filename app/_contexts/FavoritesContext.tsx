import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';

import type { Word } from '../../types/Word';

type FavoritesContextType = {
  favorites: Word[];
  toggleFavorite: (word: Word, userId: string) => void;
  isFavorite: (word: Word) => boolean;
  loadFavorites: (userId: string) => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

const getFavoritesStorageKey = (userId: string) => `@favorites_${userId}`;

const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Word[]>([]);

  const loadFavorites = async (userId: string) => {
    try {
      const storageKey = getFavoritesStorageKey(userId);
      const storedFavorites = await AsyncStorage.getItem(storageKey);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error('Error loading favorites from AsyncStorage:', error);
    }
  };

  const saveFavorites = async (userId: string) => {
    try {
      const storageKey = getFavoritesStorageKey(userId);
      await AsyncStorage.setItem(storageKey, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites to AsyncStorage:', error);
    }
  };

  const toggleFavorite = (word: Word, userId: string) => {
    setFavorites((prevFavorites) => {
      const updatedFavorites = isFavorite(word)
        ? prevFavorites.filter((fav) => fav.word !== word.word)
        : [...prevFavorites, word];

      saveFavorites(userId);
      return updatedFavorites;
    });
  };

  const isFavorite = (word: Word) => {
    return favorites.some((fav) => fav.word === word.word);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, loadFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export default FavoritesProvider;
