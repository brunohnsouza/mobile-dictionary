import '../global.css';

import { Stack } from 'expo-router';

import { AuthProvider } from './_contexts/AuthContext';
import FavoritesProvider from './_contexts/FavoritesContext';
import HistoryProvider from './_contexts/HistoryContext';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <HistoryProvider>
        <FavoritesProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </FavoritesProvider>
      </HistoryProvider>
    </AuthProvider>
  );
}
