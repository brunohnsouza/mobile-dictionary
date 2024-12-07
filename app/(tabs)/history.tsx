import { useEffect, useState } from 'react';
import { SafeAreaView, ActivityIndicator, Text, View } from 'react-native';

import { useAuth } from '../_contexts/AuthContext';
import { useHistory } from '../_contexts/HistoryContext';

import WordList from '~/components/WordList';

export default function HistoryPage() {
  const { history, loadHistory } = useHistory();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasFetched, setHasFetched] = useState<boolean>(false);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user || hasFetched) return;
      setIsLoading(true);
      try {
        await loadHistory(user.uid);
        setHasFetched(true);
      } catch (error) {
        console.error('Error loading history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [user, hasFetched, loadHistory]);

  const renderLoading = () => (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" color="#000" />
      <Text className="mt-4 text-gray-500">Loading history...</Text>
    </View>
  );

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center">
      <Text className="text-gray-500">You haven't accessed any words yet.</Text>
    </View>
  );

  const renderHistory = () => (
    <SafeAreaView className="flex-1">
      <WordList history={history} />
    </SafeAreaView>
  );

  if (isLoading) {
    return renderLoading();
  }

  if (!history || history.length === 0) {
    return renderEmptyState();
  }

  return renderHistory();
}
