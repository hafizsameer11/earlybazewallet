import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '@/components/Header';
import AddressTabs from '../components/Receive/AddressTabs';
import QRCodeCard from '../components/Receive/QRCodeCard';
import NetworkSelection from '../components/Receive/NetworkSelection';
import useLoadFonts from '@/hooks/useLoadFonts'; // Import font loader


//Code related to the integration

const Receive: React.FC = () => {
    const backgroundColor = useThemeColor({ light: '#22A45D', dark: '#000000' }, 'background');
    const cardBackgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#1A1A1A' }, 'card');
    const qrBackgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#FFFFFF' }, 'card');
    const fontsLoaded = useLoadFonts(); // Load custom fonts

    const textColor = useThemeColor({ light: '#222222', dark: '#FFFFFF' }, 'text');
    const navigation = useNavigation();
    const route = useRoute();
    const { assestId, icon, assetName, fullName } = route.params as { assestId: string, icon: string, assetName: string, fullName: string };

    console.log("Received values For the receive: ", { assestId, icon, assetName });
    const assetData = { assestId, icon, assetName };

    const [selectedTab, setSelectedTab] = useState<'Crypto Address' | 'Email Address'>('Crypto Address');

    const [selectedNetworkName, setSelectedNetworkName] = useState<any>(null);
    const [selectedCoinName, setSelectedCoinName] = useState<any>(null);

    console.log("The value for the netwrok", selectedNetworkName);
    console.log("The Value for the coin name", selectedCoinName);

    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
            <View style={styles.assetNameContainer}>
                <Header />

                <Text style={[styles.assetName, { fontFamily: fontsLoaded ? 'Caprasimo-Regular' : undefined }]}>Receive {assetName}</Text>
            </View>

            {/* Address Tabs */}
            <AddressTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

            {/* QR Code Card */}
            <QRCodeCard cardBackgroundColor={qrBackgroundColor} selectedTab={selectedTab} selectedNetworkName={selectedNetworkName} selectedCoinName={selectedCoinName} />

            {/* Network Selection */}
            <NetworkSelection
                cardBackgroundColor={cardBackgroundColor}
                textColor={textColor}
                assetData={assetData}
                setSelectedNetworkName={setSelectedNetworkName}
                setSelectedCoinName={setSelectedCoinName}
            />        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingTop: 20,
    },
    assetNameContainer: {
        paddingVertical: 10,
        borderRadius: 10,
        marginBottom: 10,
        marginHorizontal: 8,
    },
    assetName: {
        fontSize: 24,
        color: 'white',
        marginHorizontal: 13,
        fontFamily: 'Caprasimo'

    },
});

export default Receive;
