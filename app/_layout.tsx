import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { ThemeProvider } from "@/contexts/themeContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import ScreenStacks from '../components/screenstacks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserBalanceProvider } from '../contexts/UserBalanceContext';
import Toast from 'react-native-toast-message'; // ✅ Import Toast

// Prevent splash screen auto-hide before loading
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Caprasimo: require('../assets/fonts/Caprasimo-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <UserBalanceProvider>
        <QueryClientProvider client={queryClient}>
          <ScreenStacks />
        </QueryClientProvider>
        <Toast /> {/* ✅ Add Toast Provider */}
        <StatusBar style="auto" />
      </UserBalanceProvider>
    </ThemeProvider>
  );
}
