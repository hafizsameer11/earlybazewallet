import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { Header } from '@/components/Index/Header';
import { useThemeColor } from '@/hooks/useThemeColor';
import WalletCard from '@/components/Index/WalletCard';
import ServiceOptions from '@/components/Index/ServiceOptions';
import ImageSlider from '@/components/Index/ImageSlider';
import AssetsTab from '@/components/Index/AssetsTab';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getFromStorage } from "@/utils/storage";
import { getUserDetails } from "@/utils/queries/appQueries";

export default function HomeScreen() {
  const [token, setToken] = useState<string | null>(null); // State to hold the token
  const [isCrypto, setIsCrypto] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const backgroundColor = useThemeColor({ light: '#EFFEF9', dark: '#000000' }, 'background');
  const queryClient = useQueryClient();

  const toggleWallet = () => setIsCrypto(!isCrypto);

  // Fetch the token on mount
  useEffect(() => {
    const fetchUserData = async () => {
      const fetchedToken = await getFromStorage("authToken");
      setToken(fetchedToken);
      console.log("🔹 Retrieved Token:", fetchedToken);
    };

    fetchUserData();
  }, []);

  // React Query to fetch user details
  const { data: userDetails, error: userError, isLoading: userLoading } = useQuery({
    queryKey: ["userDetails"],
    queryFn: () => getUserDetails({ token }),
    enabled: !!token, // Only fetch if token is present
  });

  // Pull-to-refresh handler
  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await queryClient.invalidateQueries(); // Invalidate all queries to trigger refetch
    } catch (error) {
      console.error("Error during refresh:", error);
    } finally {
      setRefreshing(false);
    }
  };

  console.log("🔹 User Details:", userDetails);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor }]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Header username={userDetails?.data.name} greeting="Good Morning" />
      <WalletCard isCrypto={isCrypto} onToggle={toggleWallet} />
      <ServiceOptions />
      <ImageSlider />
      <AssetsTab />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});
