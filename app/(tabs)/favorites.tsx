import { useEffect, useState } from 'react';
import { SafeAreaView, ActivityIndicator, Text, View } from 'react-native';

import { useAuth } from '../_contexts/AuthContext';
import { useFavorites } from '../_contexts/FavoritesContext';

import WordList from '~/components/WordList';

export default function FavoritesPage() {
  const { favorites, loadFavorites } = useFavorites();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasFetched, setHasFetched] = useState<boolean>(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user || hasFetched) return;

      setIsLoading(true);
      try {
        await loadFavorites(user.uid);
        setHasFetched(true);
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [hasFetched, loadFavorites, user]);

  if (isAuthLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#000" />
        <Text className="mt-4 text-gray-500">Loading user information...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500">You need to be logged in to view your favorites.</Text>
      </View>
    );
  }

  const renderLoading = () => (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" color="#000" />
      <Text className="mt-4 text-gray-500">Loading favorites...</Text>
    </View>
  );

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center">
      <Text className="text-gray-500">You haven't added any favorites yet.</Text>
    </View>
  );

  const renderFavorites = () => (
    <SafeAreaView className="flex-1">
      <WordList favorites={favorites} />
    </SafeAreaView>
  );

  if (isLoading) {
    return renderLoading();
  }

  if (!favorites || favorites.length === 0) {
    return renderEmptyState();
  }

  return renderFavorites();
}
