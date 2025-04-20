import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { ThemeProvider } from "@/contexts/themeContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import ScreenStacks from '../components/screenstacks';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { UserBalanceProvider } from '../contexts/UserBalanceContext';
import Toast from 'react-native-toast-message'; // ✅ Import Toast
import { getFromStorage } from "@/utils/storage";
import { getUserDetails } from "@/utils/queries/appQueries";
import NotificationManager from "./NotificationManager";

// Prevent splash screen auto-hide before loading
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const [token, setToken] = useState<string | null>(null); // State to h
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
  }// Get token from storage
  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await getFromStorage('authToken');
      setToken(storedToken);
    };
    fetchToken();
  }, []);

  // Fetch user details only when token is available
  const { data: userDetails } = useQuery({
    queryKey: ['userDetails'],
    queryFn: () => getUserDetails({ token }),
    enabled: !!token,
  });

  return (
    <ThemeProvider>
      <UserBalanceProvider>
        <QueryClientProvider client={queryClient}>
          <ScreenStacks />
          {token && userDetails && (
            <NotificationManager token={token} user={userDetails?.data} />
          )}
        </QueryClientProvider>
        <Toast /> {/* ✅ Add Toast Provider */}
        <StatusBar style="auto" />
      </UserBalanceProvider>
    </ThemeProvider>
  );
}
