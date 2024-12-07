import { useState, useEffect, useCallback, useRef } from 'react';
import { FlatList, View, Text, Alert } from 'react-native';

import WordItem from './WordItem';
import WordModal from './WordModal';
import type { Word, WordMeaning } from '../types/Word';

const PAGE_SIZE = 20;

type WordListProps = {
  wordDictionary?: Record<string, number>;
  favorites?: Word[];
  history?: Word[];
};

export default function WordList({ wordDictionary, favorites, history }: WordListProps) {
  const [words, setWords] = useState<Word[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [currentMeaningIndex, setCurrentMeaningIndex] = useState(0);

  const cache = useRef<Map<string, Word>>(new Map());

  const fetchWords = useCallback(() => {
    if (!wordDictionary) return;
    setLoading(true);

    const wordsList = Object.keys(wordDictionary);
    const startIndex = (page - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;

    const newWords = wordsList.slice(startIndex, endIndex).map((word, index) => ({
      id: startIndex + index + 1,
      word,
    }));

    setWords((prevWords) => [...prevWords, ...newWords]);
    setLoading(false);
  }, [page, wordDictionary]);

  useEffect(() => {
    if (favorites) {
      setWords(favorites);
    } else if (history) {
      setWords(history);
    } else if (wordDictionary) {
      fetchWords();
    }
  }, [fetchWords, favorites, history, wordDictionary]);

  const fetchWordDetails = async (word: string) => {
    if (cache.current.has(word)) {
      setSelectedWord(cache.current.get(word) || null);
      setCurrentMeaningIndex(0);
      return;
    }

    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      const data = await response.json();

      if (data && data.length > 0) {
        const wordDetails = {
          id: cache.current.size + 1,
          word: data[0].word,
          phonetic: data[0].phonetic || '',
          meanings:
            data[0].meanings?.map((m: WordMeaning) => ({
              partOfSpeech: m.partOfSpeech,
              definitions: m.definitions,
            })) || [],
          audio: data[0].phonetics?.[0]?.audio || '',
        };

        cache.current.set(word, wordDetails);
        setSelectedWord(wordDetails);
        setCurrentMeaningIndex(0);
      } else {
        Alert.alert('Error', 'Word details not found.');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not fetch word details. Please try again later.');
      console.error(error);
    }
  };

  const handleLoadMore = () => {
    if (!loading && !favorites && !history) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={{ paddingVertical: 16 }}>
        <Text style={{ textAlign: 'center', color: '#6b7280' }}>Loading more words...</Text>
      </View>
    );
  };

  const openWordModal = (word: Word) => {
    setSelectedWord(word);
    fetchWordDetails(word.word);
  };

  const closeWordModal = () => {
    setSelectedWord(null);
    setCurrentMeaningIndex(0);
  };

  const handleNextMeaning = () => {
    if (selectedWord?.meanings) {
      setCurrentMeaningIndex((prevIndex) =>
        Math.min(prevIndex + 1, (selectedWord.meanings?.length ?? 1) - 1)
      );
    }
  };

  const handlePreviousMeaning = () => {
    if (selectedWord?.meanings) {
      setCurrentMeaningIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={words}
        renderItem={({ item }) => <WordItem word={item} onPress={() => openWordModal(item)} />}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: 'center',
          gap: 16,
          marginTop: 16,
          marginHorizontal: 24,
        }}
      />
      {selectedWord && (
        <WordModal
          word={{
            ...selectedWord,
            meanings: selectedWord.meanings
              ? [
                  {
                    partOfSpeech: selectedWord.meanings[currentMeaningIndex]?.partOfSpeech || '',
                    definitions: selectedWord.meanings[currentMeaningIndex]?.definitions || [],
                  },
                ]
              : [],
          }}
          onClose={closeWordModal}
          onNext={handleNextMeaning}
          onPrevious={handlePreviousMeaning}
          hasPrevious={currentMeaningIndex > 0}
          hasNext={
            selectedWord.meanings ? currentMeaningIndex < selectedWord.meanings.length - 1 : false
          }
        />
      )}
    </View>
  );
}
