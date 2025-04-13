import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Header from '@/components/Header';
import BuyHead from '@/components/BuyHead';
import { useThemeColor } from '@/hooks/useThemeColor';
import BuyCard from '@/components/BuyCard';
import NoteBox from '@/components/Buy/NoteBox';
import PrimaryButton from '@/components/Buy/PrimaryButton';
import { router, useRouter } from "expo-router";

// Import related to the integration
import { getFromStorage } from "@/utils/storage";
import { createBuy } from "@/utils/mutations/accountMutations";
import { useMutation } from '@tanstack/react-query';
import Toast from "react-native-toast-message"; // ✅ Import Toast
import { getNgNExchangeRate } from '@/utils/queries/appQueries';
import { useQuery } from '@tanstack/react-query';

const Buy: React.FC = () => {
  const backgroundColor = useThemeColor({ light: '#EFFEF9', dark: '#000000' }, 'background');
  const [token, setToken] = useState<string | null>(null); // State to hold the token
  const [selectedData, setSelectedData] = useState<any | null>(null); // State to store selected coin and network data
  const [exchangeRate, setExchangeRate] = useState<string | null>(null); // State to store exchange rate
  // Fetch the token when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      const fetchedToken = await getFromStorage("authToken");
      setToken(fetchedToken);
      console.log("🔹 Retrieved Token:", fetchedToken);
    };

    fetchUserData();
  }, []);
  const { data: exchangeRateNaira } = useQuery({
    queryKey: ['exchangeRateNaira'],
    queryFn: () => getNgNExchangeRate(token as string), // Ensure token is a string
    enabled: !!token, // Only run the query when token is available
  });

  console.log("inside the Buy Section.", exchangeRateNaira);

  // ✅ Mutation for Buy
  const { isPending: isPendingBuy, mutate: mutateBuy } = useMutation({
    mutationFn: (data: {
      currency: string;
      network: string;
      amount_coin: string;
      amount_usd: string;
      amount_naira: string;
      bank_account_id: string;
    }) => createBuy({ data, token }),
    onSuccess: async (response) => {
      try {
        console.log("✅ Buy Successful:", response);
        // Navigate to PaymentSummary with transaction details
        router.push({
          pathname: '/PaymentSummary',
          params: {
            id: response.data.id,
            coin: response.data.currency,
            network: response.data.network,
            amount_usd: response.data.amount_usd,
            amount_coin: response.data.amount_coin,
            amount_naira: response.data.amount_naira,
            transaction_id: response.data.transaction_id,
            transaction_reference: response.data.transaction.reference,
            transaction_date: response.data.transaction.created_at,
            bank_name: response.data.bank_account.bank_name,
            account_number: response.data.bank_account.account_number,
            account_name: response.data.bank_account.account_name,
            status: response.data.status
          }
        });

      } catch (error) {
        console.error("❌ Error navigating:", error);
      }
    },
    onError: (error) => {
      console.error("❌ Error buying:", error);
    }
  });

  // Handle Proceed button press
  const handleProceed = () => {
    // Check for missing fields
    console.log("🚀 Proceeding with:", selectedData);
    if (!selectedData?.selectedCoin?.name) {
      Toast.show({ type: "error", text1: "Please select a coin." });
      return;
    }

    if (!selectedData?.selectedNetwork?.name) {
      Toast.show({ type: "error", text1: "Please select a network." });
      return;
    }

    if (!selectedData?.amount_coin || parseFloat(selectedData.amount_coin) <= 0) {
      Toast.show({ type: "error", text1: "Please enter a valid coin amount." });
      return;
    }

    if (!selectedData?.amount_usd || parseFloat(selectedData.amount_usd) <= 0) {
      Toast.show({ type: "error", text1: "Please enter a valid USD amount." });
      return;
    }

    if (!selectedData?.amount_naira || parseFloat(selectedData.amount_naira) <= 0) {
      Toast.show({ type: "error", text1: "Please enter a valid Naira amount." });
      return;
    }

    if (!selectedData?.selectedPaymentMethodId?.id) {
      Toast.show({ type: "error", text1: "Please select a bank account." });
      return;
    }

    console.log("🚀 Proceeding with:", selectedData);

    // Extract and prepare data for mutation
    const buyData = {
      currency: selectedData.selectedCoin.name.toLowerCase(),
      network: selectedData.selectedNetwork.name.toLowerCase(),
      amount_coin: selectedData.amount_coin,
      amount_usd: selectedData.amount_usd,
      amount_naira: selectedData.amount_naira,
      bank_account_id: selectedData.selectedPaymentMethodId.id.toString(),
    };

    // Call the mutation to create a buy transaction
    mutateBuy(buyData);
  };

  const showToastMessage = (message: string) => {
    Toast.show({ type: "error", text1: message });
  };
  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
      <View style={styles.horPadding}>
        <Header />
      </View>
      <View style={styles.content}>
        <BuyHead
          buttonText="Buy Crypto"
          topLabel="Exchange Rate"
          exchangeRate={exchangeRateNaira ? `$1 = NGN${exchangeRateNaira?.data?.rate}` : 'Loading...'}
        />

        {/* BuyCard will update selected data in the parent state */}
        <BuyCard setSelectedData={setSelectedData} showToast={showToastMessage} />

        <NoteBox />
      </View>

      {/* Proceed button to initiate transaction */}
      <View style={styles.buttonContainer}>
        <PrimaryButton
          title={isPendingBuy ? "Processing..." : "Proceed"}
          onPress={handleProceed}
          disabled={isPendingBuy} // Disable button while processing
        />
      </View>
      <Toast /> {/* ✅ Add Toast Component to Render */}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 16,
  },
  horPadding: {
    marginTop: 10,
    paddingHorizontal: 16,
  },
  content: {
    paddingBottom: 16,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
});

export default Buy;
