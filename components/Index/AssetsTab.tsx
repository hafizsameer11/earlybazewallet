import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import AssetItem from './AssetItem';
import { assetsData, myAssetsData, transactionsData } from '@/constants/assetsData';
import { useThemeColor } from '@/hooks/useThemeColor';

const TABS = ['Assets', 'Recent Transactions'];

//Code realted to the Integration
import { useQuery } from '@tanstack/react-query';
import { getAssestnTrans } from "@/utils/queries/appQueries"
import { getFromStorage } from "@/utils/storage";




const AssetsTab: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState('Assets');
  const backgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#000000' }, 'background');
  const textColor = useThemeColor({ light: '#8A8A8A', dark: '#FFFFFF' }, 'text');
  const activeTabColor = useThemeColor({ light: '#25AE7A', dark: '#007C57' }, 'background');
  const tabBackgroundColor = useThemeColor({ light: '#F2F2F2', dark: '#1A1A1A' }, 'tabBackground');

  const getData = () => {
    switch (selectedTab) {
      case 'Recent Transactions':
        return data?.data?.transactions || []; // ✅ Use API transactions data
      default:
        return data?.data?.assets || []; // ✅ Use API assets data
    }
  };

  // Fetch the token and user data when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      const fetchedToken = await getFromStorage("authToken");
      setToken(fetchedToken);
      console.log("🔹 Retrieved Token:", fetchedToken);
    };

    fetchUserData();
  }, []);

  // UseQuery with enabled based on token
  const { isLoading, error, data } = useQuery({
    queryKey: ["assets"],
    queryFn: () => getAssestnTrans({ token }),
    enabled: !!token,  // Only run the query when token is available
  });

  console.log("🔹 Datawsss:", data);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Tabs */}
      <View style={[styles.tabsContainer, { backgroundColor: tabBackgroundColor }]}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              selectedTab === tab && styles.activeTab,
              { backgroundColor: selectedTab === tab ? activeTabColor : 'transparent' },
            ]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab && styles.activeTabText,
                { color: selectedTab === tab ? '#fff' : textColor },
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      `{/* List of Assets */}
      <FlatList
        data={getData()}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <AssetItem
            item={{
              ...item,
              icon: item.symbol ? `https://earlybaze.hmstech.xyz/storage/${item.symbol}` : null,
            }}
            isAssetTab={selectedTab === 'Assets'} // 🔸 New prop
            customIconSize={selectedTab === 'Assets' ? 30 : 16} // 🔸 New prop
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContainer}
        scrollEnabled={false}
      />



    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    paddingHorizontal: 16,
    marginTop: 15,
    flex: 1, // Ensures the container takes up all available space
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 10,
    marginBottom: 10,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 0,
  },
  activeTab: {
    backgroundColor: '#25AE7A',
    borderRadius: 8,
    shadowColor: 'rgba(162, 162, 162, 0.25)',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
  tabText: {
    fontSize: 11,
    color: '#8A8A8A',
  },
  activeTabText: {
    color: 'white',
    fontWeight: 'bold',
  },
  flatListContainer: {
    paddingBottom: 16, // Optional: Adds extra space at the bottom if content is small
  },
});

export default AssetsTab;
