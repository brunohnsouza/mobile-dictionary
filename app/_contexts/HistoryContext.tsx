import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';

import type { Word } from '../../types/Word';

type HistoryContextType = {
  history: Word[];
  addToHistory: (word: Word, userId: string) => void;
  isAccessed: (word: Word) => boolean;
  loadHistory: (userId: string) => Promise<void>;
};

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const useHistory = (): HistoryContextType => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
};

const getHistoryStorageKey = (userId: string) => `@word_history_${userId}`;

const HistoryProvider = ({ children }: { children: ReactNode }) => {
  const [history, setHistory] = useState<Word[]>([]);

  const loadHistory = async (userId: string) => {
    try {
      const storageKey = getHistoryStorageKey(userId);
      const storedHistory = await AsyncStorage.getItem(storageKey);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      } else {
        setHistory([]);
      }
    } catch (error) {
      console.error('Failed to load history from storage:', error);
    }
  };

  const addToHistory = async (word: Word, userId: string) => {
    setHistory((prevHistory) => {
      if (!prevHistory.some((item) => item.word === word.word)) {
        const updatedHistory = [...prevHistory, word];
        const storageKey = getHistoryStorageKey(userId);
        AsyncStorage.setItem(storageKey, JSON.stringify(updatedHistory)).catch((error) =>
          console.error('Failed to save history to storage:', error)
        );
        return updatedHistory;
      }
      return prevHistory;
    });
  };

  const isAccessed = (word: Word) => {
    return history.some((item) => item.word === word.word);
  };

  return (
    <HistoryContext.Provider value={{ history, addToHistory, isAccessed, loadHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};

export default HistoryProvider;
