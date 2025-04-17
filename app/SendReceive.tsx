import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import SearchBar from '@/components/SearchBar';
import Tabs from '@/components/Tabs';
import AssetList from '@/components/AssetList';
import Header from '@/components/Header';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from 'expo-router';



const SendReceive: React.FC = () => {
  const backgroundColor = useThemeColor({ light: '#EFFEF9', dark: '#000000' }, 'background');
  const subBackgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#000000' }, 'background');
  // Retrieve the passed parameter
  const { type } = useLocalSearchParams();

  const {fromMarket} = useLocalSearchParams();

  console.log("The Data from the Market", fromMarket);
  // Log the received parameter
  console.log('Received type from navigation:', type);

  // State to track the selected tab
  const [selectedTab, setSelectedTab] = useState<'All Assets' | 'My Assets'>('All Assets');

  // State for search query
  const [searchQuery, setSearchQuery] = useState('');

  const [showPrice, setShowPrice] = useState(true);


  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Custom Header */}
      <Header
        title="Assets"
    
      />
      {/* Search Bar */}
      <View style={styles.horPadding}>
        <SearchBar placeholder="Search Crypto" value={searchQuery} onChangeText={setSearchQuery} />
    </View>
      <View style={[styles.subcontainer, { backgroundColor: subBackgroundColor }]}>
        {/* Tabs */}
        <View style={styles.horPadding}>
          <Tabs selectedTab={selectedTab} onTabSelect={setSelectedTab} />
        </View>

        {/* Asset List */}

        <AssetList selectedTab={selectedTab} searchQuery={searchQuery} type={type}  showPrice={showPrice} fromMarket={fromMarket} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 25,
  },
  horPadding: {
    paddingHorizontal: 16,
  },
  subcontainer: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 20,
  },
});

export default SendReceive;
