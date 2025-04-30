import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { images } from '@/constants';
import PrimaryButton from '@/components/Buy/PrimaryButton';
import NetworkSelectionModal from './NetworkSelectionModal';
import networkOptions from '@/constants/networkOptions.json';
import { useRouter, router } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';


//Code related to the integration

import { useQuery } from '@tanstack/react-query';
import { getAllWalletCurrency, getWalletCurrency } from '@/utils/queries/appQueries';
import { getFromStorage } from "@/utils/storage";


interface NetworkSelectionProps {
    cardBackgroundColor: string;
    textColor: string;
    assetData: {
        assestId: string;
        icon: string;
        assetName: string;
    };
    setSelectedNetworkName: (network: any) => void; // ✅ Function to update parent state
    setSelectedCoinName: (network: any) => void;
}
const NetworkSelection: React.FC<NetworkSelectionProps> = ({
    cardBackgroundColor,
    textColor,
    assetData,
    setSelectedCoinName,
    setSelectedNetworkName
}) => {
    const [token, setToken] = useState<string | null>(null); // State to hold the token

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedNetwork, setSelectedNetwork] = useState(networkOptions[0]); // Default to Bitcoin

    const backgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#161616' }, 'background');

    console.log("the data I receive", assetData);

    // Fetch the token and user data when the component mounts
    useEffect(() => {
        const fetchUserData = async () => {
            const fetchedToken = await getFromStorage("authToken");
            setToken(fetchedToken);
            console.log("🔹 Retrieved Token:", fetchedToken);
        };

        fetchUserData();
    }, []);

    const { data: walletCurrency, error: walletCurrencyError, isLoading: walletCurrencyLoading } = useQuery(
        {
            queryKey: ["walletCurrency"],
            queryFn: () => getAllWalletCurrency({ token }),
            enabled: !!token
        }
    );

    console.log("🔹 Wallet Currency for the receive. :", walletCurrency);



    // Ensure coinId is available before allowing network selection
    const coin = walletCurrency?.data?.find(
        (item) => item.currency.currency.toLowerCase() === assetData?.assetName.toLowerCase()
    );

    // Check if we found the currency object
    const coinId = coin?.currency.id || undefined;
    const selectedCurrency = coin?.currency.currency; // Use the selected currency object


    const handleSelectNetwork = (network: any) => {
        setSelectedNetwork(network);
        setModalVisible(false);
        setSelectedCoinName(selectedCurrency);
        setSelectedNetworkName(network.name);

    };
    return (
        <View style={[styles.networkContainer, { backgroundColor: cardBackgroundColor }]}>
            <Text style={[styles.label, { color: textColor }]}>Select Network</Text>

            {/* Dropdown - Only enabled if coinId is available */}
            <TouchableOpacity
                style={[
                    styles.dropdown,
                    { backgroundColor, opacity: coinId ? 1 : 0.5 } // Dim the button if no coin is selected
                ]}
                onPress={() => coinId && setModalVisible(true)}
                disabled={!coinId} // Prevent clicking when no coin is selected
            >
                <View style={styles.networkInfo}>
                    <Image
                        source={selectedNetwork?.icon ? selectedNetwork.icon : { uri: assetData?.icon }}
                        style={styles.networkIcon}
                    />
                    <Text style={[styles.networkText, { color: textColor }]}>
                        {selectedNetwork?.name && selectedNetwork?.name !== networkOptions[0].name
                            ? selectedNetwork.name
                            : assetData?.assetName}
                    </Text>
                </View>

                <Ionicons name="chevron-down-outline" size={20} color="black" />
            </TouchableOpacity>

            <View style={styles.hintContainer}>
                <Text style={[styles.networkHint, { color: textColor }]}>
                    Make sure to choose the right network to avoid loss of funds
                </Text>
            </View>

            {/* <View style={styles.proceedButton}>
                <PrimaryButton title="Proceed" onPress={() => router.push('/SummaryReceive')} />
            </View> */}

            {/* Show Modal only if a coin is selected */}
            {coinId && (
                <NetworkSelectionModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    onSelectNetwork={handleSelectNetwork}
                    selectedNetwork={selectedNetwork}
                    networks={networkOptions}
                    modelType="network"
                    coinId={coinId}
                    assetName={assetData?.assetName}
                />
            )}
        </View>
    );
};


const styles = StyleSheet.create({
    networkContainer: {
        flex: 1,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 30,
        paddingHorizontal: 25,
    },
    label: {
        fontSize: 14,
        marginBottom: 8,
        fontFamily: 'Caprasimo'

    },
    dropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        justifyContent: 'space-between',
    },
    networkInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    networkIcon: {
        width: 24,
        height: 24,
        marginRight: 8,
    },
    networkText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    hintContainer: {
        borderWidth: 1,
        borderColor: '#0F9D58',
        borderRadius: 10,
        marginTop: 10,
        paddingVertical: 4,
        paddingHorizontal: 4,
        marginBottom: 20,
    },
    networkHint: {
        fontSize: 10,
        color: 'gray',
        marginLeft: 10,
    },
    proceedButton: {
        marginTop: 20,
    },
});

export default NetworkSelection;
