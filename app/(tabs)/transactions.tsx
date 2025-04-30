import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Image, Text } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import Header from '@/components/Header';
import TransactionTabs from '@/components/Transactions/TransactionTabs';
import TransactionsGraph from '@/components/Transactions/TransactionsGraph';
import TransactionList from '@/components/Transactions/TransactionList';
import FilterModal from '@/components/Transactions/FilterModal';
import transactionsData from '@/constants/transactionsData.json';
import { useThemeColor } from '@/hooks/useThemeColor';
import icons from '@/constants/icons';


//Code related to the integration:
import LoadingIndicator from '@/components/LoadingIndicator';
import { useQuery } from '@tanstack/react-query';
import { getFromStorage } from "@/utils/storage";
import {
  getTransactionAll, getAllWithDrawal
} from "@/utils/queries/appQueries";


const Transactions: React.FC = () => {
  const [token, setToken] = useState<string | null>(null); // State to hold the token
  const backgroundColor = useThemeColor({ light: '#EFFEF9', dark: '#000000' }, 'background');
  const subBackgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#1A1A1A' }, 'background');
  const [activeTab, setActiveTab] = useState<string>('All');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const textColor = useThemeColor({ light: '#000000', dark: '#FFFFFF' }, 'text');
  const filterBackgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#1A1A1A' }, 'background');
  // Convert "Processing" to check for "Pending" transactions
  const filterKey = selectedFilter === 'Processing' ? 'Pending' : selectedFilter;

  const bar = useThemeColor({ light: icons.bar, dark: icons.bar_black }, 'icon');
  const arrow = useThemeColor({ light: icons.arrow, dark: icons.arrow_black }, 'icon');
  // Fetch the token and user data when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      const fetchedToken = await getFromStorage("authToken");
      setToken(fetchedToken);
      console.log("🔹 Retrieved Token:", fetchedToken);
    };

    fetchUserData();
  }, []);


  const { data: transactionsResponse, error: transactionsError, isLoading: transactionsLoading } = useQuery<TransactionsResponse | AllWithdrawalResponse>(
    {
      queryKey: ["transactions", activeTab], // Include activeTab in queryKey to refetch when it changes
      queryFn: () => activeTab === "Withdraw" ? getAllWithDrawal({ token }) : getTransactionAll({ token }),
      enabled: !!token, // Only run the query when the token is available
    }
  );
  console.log("🔹 Transactions Response:", transactionsResponse?.data);


  const transactions = activeTab === "Withdraw"
    ? (transactionsResponse?.data as AllWithdrawalResponse["data"]) || []
    : (transactionsResponse?.data?.transactions || []);

  const graphicalData = activeTab !== "Withdraw"
    ? (transactionsResponse?.data?.graphicalData || [])
    : [];

  const filteredTransactions = transactions.length > 0
    ? transactions.filter(tx => {
      // Check for tab match
      const tabMatch =
        activeTab === 'All' ||
        (activeTab === 'Withdraw'
          ? !!tx.bank_account // Check if it's a withdrawal transaction based on structure
          : tx.type?.toLowerCase() === activeTab.toLowerCase());


      // Check for status match
      const statusMatch = filterKey === 'All' || tx.status.toLowerCase() === filterKey.toLowerCase();

      return tabMatch && statusMatch;
    })
    : [];

  console.log("🔹 Full Transactions Response:", transactionsResponse);
  console.log("🔹 Extracted Transactions:", transactions);
  console.log("🔹 Active Tab:", activeTab);
  console.log("🔹 Filter Key:", filterKey);
  console.log("🔹 Filtered Transactions:", filteredTransactions);



  console.log("🔹 Transactions:", transactions);

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <Header title="Transactions" />

      {/* Transactions Tabs */}
      <View style={[styles.subContainer, { backgroundColor: subBackgroundColor }]}>
        <TransactionTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Show Filter Button When NOT on "All" Tab */}
        {activeTab !== 'All' && (
          <TouchableOpacity
            style={[styles.filterButton, { backgroundColor: filterBackgroundColor }, { width: 60 + selectedFilter.length * 7 }]} // Dynamic Width Based on Text Length
            onPress={() => setFilterModalVisible(true)}
          >
            <Image source={bar} style={styles.filterIcon} />
            <Text style={[styles.filterText, { color: textColor }]}>{selectedFilter}</Text>
            <Image source={arrow} style={styles.filterArrow} />
          </TouchableOpacity>
        )}

        <ScrollView contentContainerStyle={styles.contentContainer}>
          {/* Show Graph ONLY when "All" Tab is Active */}
          {activeTab === 'All' && graphicalData.length > 0 && (
            <TransactionsGraph graphicalData={graphicalData} />
          )}


          {/* Transaction List */}
          {transactionsLoading ? (
            <LoadingIndicator message="Fetching transactions..." />
          ) : filteredTransactions.length === 0 ? (
            <Text style={{ textAlign: 'center', marginTop: 20, color: textColor }}>No Transaction found...</Text>
          ) : (
            <TransactionList transactions={filteredTransactions} />
          )}


        </ScrollView>
      </View>

      {/* Filter Modal */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
      />
    </ThemedView>
  );
};

export default Transactions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,

  },
  subContainer: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 10,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#B0B0B0',
    height: 40,
    marginTop: 10,
  },
  filterIcon: {
    width: 18,
    height: 18,
    marginRight: 5,
  },
  filterText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000000',
    marginRight: 5,
  },
  filterArrow: {
    width: 12,
    height: 12,
    marginTop: 2,
    marginRight: 10,
  },
});
