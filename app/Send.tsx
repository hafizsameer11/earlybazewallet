import React, { useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Header from '@/components/Header';
import BuyHead from '@/components/BuyHead';
import { useThemeColor } from '@/hooks/useThemeColor';
import NoteBox from '@/components/Buy/NoteBox';
import PrimaryButton from '@/components/Buy/PrimaryButton';
import { useNavigation } from '@react-navigation/native';
import { router, useRouter } from "expo-router";
import { useState } from 'react';
import SendCryptoForm from '@/components/Send/SendCryptoForm';
import Toast from "react-native-toast-message"; // ✅ Import Toast
import { useRoute } from '@react-navigation/native';
import { getFromStorage } from '@/utils/storage';


const Send: React.FC = () => {
    const networkOptions = [{ id: "1" }];
    const [selectedTab, setSelectedTab] = useState<'Crypto Address' | 'Internal Transfer'>('Internal Transfer');
        const [token, setToken] = useState<string | null>(null);
     useEffect(() => {
            const fetchUserData = async () => {
                const fetchedToken = await getFromStorage('authToken');
                setToken(fetchedToken);
                console.log('🔹 Retrieved Token:', fetchedToken);
            };
    
            fetchUserData();
        }, []);
    
    const route = useRoute();
    const { assestId, icon, assetName, fullName, balance } = route.params as { assestId: string, icon: string, assetName: string, fullName: string, balance: string }; // ✅ Destructure the params

    console.log("Received values:", { assestId, icon, assetName });
    const assetData = { assestId, icon, assetName, balance };
    const [convertedAmount, setConvertedAmount] = useState<string>("0.00");
    const [feeSummary, setFeeSummary] = useState({
        platform_fee_usd: "0.00",
        blockchain_fee_usd: "0.00",
        total_fee_usd: "0.00",
        amount_after_fee: "0.00"
    });

    const backgroundColor = useThemeColor({ light: '#EFFEF9', dark: '#000000' }, 'background');

    // ✅ Get state from SendCryptoForm
    const [selectedCoin, setSelectedCoin] = useState<any>(networkOptions[0] || {}); // ✅ Set default to an empty object if no initial value
    const [selectedNetwork, setSelectedNetwork] = useState<any>(networkOptions[0] || {}); // ✅ Prevents null errors

    const [usdAmount, setUsdAmount] = useState<string>("0");
    const [scannedAddress, setScannedAddress] = useState<string>("");

    // ✅ Extracted function for validation and navigation
    const handleProceed = async() => {
        // Check for missing fields
        if (!selectedCoin?.name) {
            Toast.show({ type: "error", text1: "Please select a coin." });
            return;
        }

        if (!selectedNetwork?.name) {
            Toast.show({ type: "error", text1: "Please select a network." });
            return;
        }

        if (!usdAmount || parseFloat(usdAmount) <= 0) {
            Toast.show({ type: "error", text1: "Please enter a valid amount." });
            return;
        }

        if (!scannedAddress) {
            const missingField = selectedTab === "Internal Transfer" ? "Email" : "Crypto Address";
            Toast.show({ type: "error", text1: `Please enter a valid ${missingField}.` });
            return;
        }
        console.log("Selected Image", selectedCoin.icon);

        // Proceed if all fields are filled
        const requestData = {
            currency: selectedCoin.name.toLowerCase(),
            network: selectedNetwork.name.toLowerCase(),
            amount: convertedAmount,
            // amount_usd:
            email: selectedTab === "Internal Transfer" ? scannedAddress : undefined,
            address: selectedTab === "Crypto Address" ? scannedAddress : undefined,
            image: selectedCoin?.icon?.uri || "",
            temp: "temp",
            // 🔥 Add fee values
            converted: usdAmount,
            platform_fee_usd: feeSummary.platform_fee_usd,
            network_fee_usd: feeSummary.blockchain_fee_usd,
            total_fee_usd: feeSummary.total_fee_usd,
            amount_after_fee: feeSummary.amount_after_fee,
        };

        console.log("🔹 Request Data:", requestData);
        if (selectedTab === "Internal Transfer") {
            // 🛠 Validate Email API call
            const response = await fetch('https://earlybaze.hmstech.xyz/api/validate-email', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({ email: scannedAddress }),
            });
      
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Invalid email address');
            }
      
            const result = await response.json();
            console.log('✅ Email validated successfully:', result);
      
            // Add username to requestData
            requestData.name = result.data?.name || '';
            console.log('🔹 Username:', requestData.name);
            // Now navigate
            router.push({
              pathname: '/TransactionSummary',
              params: { type: 'send', ...requestData },
            });
      
          } else {
            // No email validation needed
            router.push({
              pathname: '/TransactionSummary',
              params: { type: 'send', ...requestData },
            });
          }
    };

    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
            <View style={styles.horPadding}>
                <Header />
            </View>
            <View style={styles.content}>
                <BuyHead
                    buttonText="Send Crypto"
                    topLabel="Balance"
                    exchangeRate={`${parseFloat(balance).toFixed(5)} ${assetName}`}
                />
                {/* ✅ Pass State Handlers to SendCryptoForm */}
                <SendCryptoForm
                    selectedTab={selectedTab}
                    setSelectedTab={setSelectedTab}
                    selectedCoin={selectedCoin}
                    setSelectedCoin={setSelectedCoin}
                    selectedNetwork={selectedNetwork}
                    setSelectedNetwork={setSelectedNetwork}
                    usdAmount={usdAmount}
                    setUsdAmount={setUsdAmount}
                    scannedAddress={scannedAddress}
                    setScannedAddress={setScannedAddress}
                    assetData={assetData}  // Passing the object as a prop
                    onFeeChange={setFeeSummary}
                    converted={convertedAmount}
                    setConverted={setConvertedAmount}

                />

                <NoteBox />
            </View>

            {/* ✅ Navigate to Payment Summary on Click */}
            <View style={styles.buttonContainer}>
                <PrimaryButton title="Proceed" onPress={handleProceed} />
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
        position: 'fixed',
        bottom: 0,
        width: '100%',
        alignSelf: 'center',
    },

});

export default Send;
