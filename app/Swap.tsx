import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import PrimaryButton from '@/components/Buy/PrimaryButton';
import Header from '@/components/Header';
import BuyHead from '@/components/BuyHead';
import SwapAssetSection from '@/components/Swap/SwapAssetSection';
import ExchangeRate from '@/components/Swap/ExchangeRate';
import { useRouter, router } from 'expo-router';
import NoteSwapBox from '@/components/Swap/NoteSwapBox';
import NetworkSelectionModal from '@/components/Receive/NetworkSelectionModal'; // ✅ Import modal
import { images } from '@/constants';
import networkOptions from '@/constants/networkOptions.json';



//Code Related to the integration
import { getFromStorage } from "@/utils/storage";
import { useMutation, useQuery } from '@tanstack/react-query';
import { createSwap } from "@/utils/mutations/accountMutations";
import { calculateExchangeRate } from '@/utils/mutations/accountMutations';
import Toast from "react-native-toast-message"; // ✅ Import Toast
import { getNgNExchangeRate } from '@/utils/queries/appQueries';

const Swap: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const backgroundColor = useThemeColor({ light: '#EFFEF9', dark: '#000000' }, 'background');
  const arrowBorderColor = useThemeColor({ light: '#E5E5E5', dark: '#095D3F' }, 'arrowBorder');
  const doublearrow = useThemeColor({ light: images.double_arrow_white, dark: images.double_arrow_black }, 'doublearrow');
  const containerBackgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#0D0D0D' }, 'card');

  // ✅ Manage state for the modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'asset' | 'network'>('asset');

  // ✅ State for selected asset and network
  const [selectedAsset, setSelectedAsset] = useState<{ id: string; name: string; icon: any, balance: string }>({
    id: "",
    name: "Select Asset",
    icon: images.dummy,
    balance: "0",
  });

  const [selectedNetwork, setSelectedNetwork] = useState<{ id: string; name: string; icon: any }>({
    id: "",
    name: "Select Network",
    icon: images.dummy,
  });

  // ✅ State for amount inputs
  const [enteredAmount, setEnteredAmount] = useState<string>("");
  const [convertedAmount, setConvertedAmount] = useState<string>("0.00");  // USD amount
  const [ngnAmount, setNgnAmount] = useState<string>("0.00"); // NGN amount

  // ✅ Fetch the token when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      const fetchedToken = await getFromStorage("authToken");
      if (fetchedToken) {
        setToken(fetchedToken);
        console.log("🔹 Retrieved Token:", fetchedToken);
      }
    };
    fetchUserData();
  }, []);

  // ✅ Mutation Functions

  const convertedAmountRef = useRef<string>("0.00");
  const ngnAmountRef = useRef<string>("0.00");

  const { mutate: getExchangeRate } = useMutation({

    mutationFn: ({
      data,
      token,
    }: {
      data: { currency: string; amount: string };
      token: string;
    }) => calculateExchangeRate({ data, token }),

    onSuccess: (response: { data: { amount_usd: string | null; amount_naira: string | null }; message: string; status: string }) => {
      console.log("✅ Exchange Rate Fetched:", response);

      // Safely destructure and provide fallback values in case of undefined or null
      const { amount_usd, amount_naira } = response.data;

      // Default to "0.00" if either value is undefined or null
      const usdAmount = amount_usd ?? "0.00";
      const ngnAmount = amount_naira ?? "0.00";

      console.log("The data", ngnAmount);

      // ✅ Store exchange rate values in refs to persist them
      convertedAmountRef.current = usdAmount;
      ngnAmountRef.current = ngnAmount;

      // ✅ Update state only if values have changed
      setConvertedAmount(usdAmount);
      console.log("The converted usd amount", convertedAmount);
      setNgnAmount(ngnAmount);
    },

    onError: (error: any) => {
      console.error('❌ Error fetching exchange rate:', error);
    },
  });
  const { data: exchangeRateNaira } = useQuery({
    queryKey: ['exchangeRateNaira'],
    queryFn: () => getNgNExchangeRate(token as string), // Ensure token is a string
    enabled: !!token, // Only run the query when token is available
  });

  console.log("Exchange Rate Naira:", exchangeRateNaira?.data);

  const parsedRate = parseFloat(exchangeRateNaira?.data?.rate ?? "1");


  const { mutate: requestSwap, isPending } = useMutation({
    mutationFn: ({ data, token }: { data: { currency: string; network: string; amount: string; exchange_rate: string }; token: string }) =>
      createSwap({ data, token }),

    onSuccess: (data) => {
      console.log("✅ Swap Request Created:", data);

      // Extract the transaction data
      const {
        transaction_id,
        currency,
        network,
        amount,
        exchange_rate,
        amount_usd,
        amount_naira,
        fee_naira,
        fee,
        status,
        user_id,
        reference,
        updated_at,
        created_at,
        id
      } = data.data;

      console.log("Swap Id", transaction_id);

      // Redirect to SwapSummary with all relevant data as params
      router.push({
        pathname: '/SwapSummary',
        params: { // Use query instead of params to pass data via URL
          id: transaction_id,
          currency,
          network,
          amount,
          exchange_rate,
          amount_usd,
          amount_naira,
          fee_naira,
          fee,
          status,
          user_id,
          reference,
          updated_at,
          created_at,
          transaction_id: id, // id is the transaction ID from the response data,
          icon: selectedAsset.icon.uri || selectedAsset.icon // Ensure it's a string
        },
      }); // ✅ Redirect after success
    },


    onError: (error) => {
      console.log("The Amount", enteredAmount);
      console.error("❌ Swap Failed:", error);
      
      

      // ✅ Show error toast
      Toast.show({
        type: "error",
        text1: "Swap Failed ❌",
        text2: error.message || "Please try again.",
        visibilityTime: 3000, // 3 seconds
      });
    },
  });

  // ✅ Get asset ID
  const assetId = selectedAsset?.id ? selectedAsset.id : null;

  // ✅ Effect to trigger exchange rate API when asset is selected and amount is entered
  useEffect(() => {
    if (selectedAsset.name !== "Select Asset" && enteredAmount.trim() !== "" && token) {
      console.log("🔹 Fetching exchange rate...");
      getExchangeRate({
        data: { currency: selectedAsset.name, amount: enteredAmount },
        token,
      });
    }
  }, [selectedAsset, enteredAmount, token]); // ✅ Runs when asset, amount, or token changes

  // ✅ Function to handle amount change and trigger API
  const handleAmountChange = (text: string) => {
    const numericValue = text.replace(/[^0-9.]/g, ''); // Allow only numbers & decimal
    setEnteredAmount(numericValue);
  };

  // Function to handle form validation and API request
  const handleProceed = () => {
    // Validate required fields
    if (!enteredAmount.trim() || parseFloat(enteredAmount) <= 0) {
      Toast.show({ type: "error", text1: "Please enter a valid amount." });
      return;
    }

    if (!selectedAsset?.name || selectedAsset.name === "Select Asset") {
      Toast.show({ type: "error", text1: "Please select an asset." });
      return;
    }

    if (!selectedNetwork?.name || selectedNetwork.name === "Select Network") {
      Toast.show({ type: "error", text1: "Please select a network." });
      return;
    }

    if (!token) {
      Toast.show({ type: "error", text1: "Authentication Error", text2: "User authentication failed. Please log in again." });
      return;
    }

    console.log("🚀 Proceeding with:", {
      currency: selectedAsset.name,
      network: selectedNetwork.name,
      amount: enteredAmount,
      exchange_rate: convertedAmount,
    });

    // Call the API mutation
    requestSwap({
      data: {
        currency: selectedAsset.name,
        network: selectedNetwork.name,
        amount: enteredAmount,
        exchange_rate: convertedAmount,
      },
      token,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Header />
      <BuyHead buttonText="Swap Crypto" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.swapContainer, { backgroundColor: containerBackgroundColor }]}>

          {/* ✅ Asset Selection */}
          <SwapAssetSection
            title="You Send"
            asset={selectedAsset.name}
            assetImage={selectedAsset.icon}
            network={selectedNetwork.name}
            networkImage={selectedNetwork.icon}
            amount={enteredAmount}
            converted={convertedAmount}
            conversionRate={parsedRate} // ✅ Pass actual exchange rate here
            onAmountChange={setEnteredAmount} // ✅ Pass amount to Swap component
            onConvertedChange={setConvertedAmount} // ✅ Pass converted amount to Swap component
            onPressAsset={() => {
              setModalType('asset');
              setModalVisible(true);
            }}
            onPressNetwork={assetId ? () => {
              setModalType('network');
              setModalVisible(true);
            } : undefined}
            disabled={!assetId}
            style={!assetId ? { opacity: 0.5 } : undefined}
            balance={selectedAsset.balance} // ✅ Pass balance as prop

          />

          {/* ✅ Swap Button */}
          {/* <TouchableOpacity style={[styles.swapButton, { borderColor: arrowBorderColor }]}>
            <Image source={doublearrow} style={styles.swapIcon} />
          </TouchableOpacity> */}

          {/* ✅ Receive Section (Amount in NGN) */}
          <SwapAssetSection
            title="You Receive"
            asset="Naira"
            assetImage={images.naira}
            amount={`NGN ${parseFloat(ngnAmount).toFixed(2)}`}
          />

        </View>

        {/* ✅ Exchange Rate Display (Amount in USD) */}
        <View style={styles.exchangeRate}>
          <ExchangeRate rate={`$1 = ${parseFloat(exchangeRateNaira?.data?.rate).toFixed(2)} NGN`} />
        </View>
        <NoteSwapBox />

        {/* ✅ Proceed Button to Call Swap API */}
        <View style={styles.fixedButtonContainer}>
          <PrimaryButton
            title={isPending ? "Processing..." : "Proceed"} // Change title when loading
            onPress={handleProceed} // Calls the function instead of inline logic
            disabled={isPending} // Disable button while request is being sent
            loading={isPending} // Show loading spinner when request is in progress
          />

        </View>

      </ScrollView>


      {/* ✅ Show Modal */}
      <NetworkSelectionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelectNetwork={(item) => {
          if (modalType === 'asset') {
            // 🧠 Check for 0 balance
            console.log("Selected Asset:", item);
            if (parseFloat(item.balance ?? "0") == 0) {
              alert("You don't have balance in this asset. Please buy it first.");
              return;
            }
            setSelectedAsset(item);
            setSelectedNetwork({ id: "", name: "Select Network", icon: images.dummy }); // Reset network when asset changes
          } else {
            setSelectedNetwork(item);
          }
          setModalVisible(false);
        }}
        selectedNetwork={modalType === 'asset' ? selectedAsset : selectedNetwork}
        networks={networkOptions}
        isBuy={false} // Set to false for swap
        modelType={modalType === 'asset' ? 'coin' : 'network'}
        coinId={selectedAsset.id}
      />
      <Toast /> {/* ✅ Add Toast Component to Render */}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 25,
    paddingTop: 10,
  },
  scrollContent: {
    paddingBottom: 0,
  },
  swapContainer: {
    paddingHorizontal: 16,
    marginHorizontal: 18,
    borderRadius: 20,
    marginTop: 80,
  },
  fixedButtonContainer: {
    width: '90%',
    marginTop: 20,
    marginHorizontal: 18
  },
  swapButton: {
    padding: 11,
    borderRadius: 50,
    marginHorizontal: 8,
    borderWidth: 2,
    position: 'absolute',
    zIndex: 10,
    top: '50.5%',
    right: '45%',
  },
  swapIcon: {
    width: 24,
    height: 24,
  },
  exchangeRate: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
});


export default Swap;
