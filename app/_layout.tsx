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
import Toast from 'react-native-toast-message';
import { getFromStorage } from "@/utils/storage";
import { getUserDetails } from "@/utils/queries/appQueries";
import NotificationManager from "./NotificationManager";

// Prevent splash screen auto-hide before loading
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

// ✅ Separate the inner logic into a component
function AppContent() {
  const colorScheme = useColorScheme();
  const [token, setToken] = useState<string | null>(null);

  const [fontsLoaded] = useFonts({
    Caprasimo: require('../assets/fonts/Caprasimo-Regular.ttf'),
  });

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await getFromStorage('authToken');
      setToken(storedToken);
    };
    fetchToken();
  }, []);

  const { data: userDetails } = useQuery({
    queryKey: ['userDetails'],
    queryFn: () => getUserDetails({ token }),
    enabled: !!token,
  });
  console.log("🔹 User Details:", userDetails, "token", token);
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider>
      <UserBalanceProvider>
        <ScreenStacks />
        {token && userDetails && (
          <NotificationManager token={token} user={userDetails?.data} />
        )}
        <Toast />
        <StatusBar style="auto" />
      </UserBalanceProvider>
    </ThemeProvider>
  );
}

// ✅ Wrap everything with QueryClientProvider at the outermost level
export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
