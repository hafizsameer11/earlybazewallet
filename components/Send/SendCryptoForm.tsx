import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    Modal
} from 'react-native';
// import { BarCodeScanner } from 'expo-barcode-scanner';
import { useThemeColor } from '@/hooks/useThemeColor';
import { images } from '@/constants';

interface SendCryptoFormProps {
    selectedTab: 'Crypto Address' | 'Internal Transfer';
    setSelectedTab: (tab: 'Crypto Address' | 'Internal Transfer') => void;
}

const SendCryptoForm: React.FC<SendCryptoFormProps> = ({ selectedTab, setSelectedTab }) => {
    // Theme-based colors
    const cardBackgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#1A1A1A' }, 'card');
    const textColor = useThemeColor({ light: '#222222', dark: '#FFFFFF' }, 'text');
    const borderColor = useThemeColor({ light: '#E5E5E5', dark: '#333333' }, 'border');

    // QR Scanner State
    const [scannedAddress, setScannedAddress] = useState('');
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [isScannerOpen, setIsScannerOpen] = useState(false);

    // Request Camera Permission
    useEffect(() => {
        (async () => {
            // const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    // Handle QR Code Scanning
    const handleBarCodeScanned = ({ data }: { data: string }) => {
        setScannedAddress(data);
        setIsScannerOpen(false);
    };

    return (
        <View>
            {/* Tab Switcher */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tabButton, selectedTab === 'Crypto Address' && styles.activeTab]}
                    onPress={() => setSelectedTab('Crypto Address')}>
                    <Text style={[styles.tabText, selectedTab === 'Crypto Address' && styles.activeTabText]}>
                        Crypto Address
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, selectedTab === 'Internal Transfer' && styles.activeTab]}
                    onPress={() => setSelectedTab('Internal Transfer')}>
                    <Text style={[styles.tabText, selectedTab === 'Internal Transfer' && styles.activeTabText]}>
                        Internal Transfer
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Main Card Container */}
            <View style={[styles.mainContainer, { backgroundColor: cardBackgroundColor, borderColor }]}>
                {/* Input Address Field */}
                <View style={[styles.inputContainer, { borderColor }]}>
                    <TextInput
                        placeholder="Input Address"
                        placeholderTextColor="#A1A1A1"
                        style={[styles.inputField, { color: textColor }]}
                        value={scannedAddress}
                        onChangeText={setScannedAddress}
                    />
                    <TouchableOpacity onPress={() => setIsScannerOpen(true)}>
                        <Image source={images.scan} style={styles.scanIcon} />
                    </TouchableOpacity>
                </View>

                {/* Amount and Currency Selection */}
                <View style={styles.amountContainer}>
                    <View style={[styles.amountBox, { borderColor }]}>
                        <Text style={styles.amountLabel}>BTC</Text>
                        <Text style={styles.amountValue}>0.000234</Text>
                        <Text style={styles.maxText}>Max</Text>
                    </View>
                    <TouchableOpacity style={styles.swapButton}>
                        <Image source={images.solana} style={styles.swapIcon} />
                    </TouchableOpacity>
                    <View style={[styles.selectionBox, { borderColor }]}>
                        <Text style={styles.selectionLabel}>Coin</Text>
                        <View style={styles.coinWrapper}>
                            <Text style={styles.coinText}>Bitcoin</Text>
                            <Image source={images.solana} style={styles.coinIcon} />
                        </View>
                    </View>
                </View>

                {/* Coin & Network Selection */}
                <View style={styles.selectionContainer}>
                    <View style={[styles.amountBox, { borderColor }]}>
                        <Text style={styles.amountLabel}>USD</Text>
                        <Text style={styles.amountValue}>2,345</Text>
                        <Text style={styles.maxText}>Max</Text>
                    </View>
                    <View style={[styles.selectionBox, { borderColor }]}>
                        <Text style={styles.selectionLabel}>Network</Text>
                        <View style={styles.coinWrapper}>
                            <Text style={styles.coinText}>Bitcoin</Text>
                            <Image source={images.solana} style={styles.coinIcon} />
                        </View>
                    </View>
                </View>
            </View>

            {/* QR Scanner Modal */}
            <Modal visible={isScannerOpen} animationType="slide">
                <View style={styles.scannerContainer}>
                    <Text style={styles.scannerText}>Scan the QR Code or Choose an Image</Text>
                    {/* <BarCodeScanner
                        onBarCodeScanned={isScannerOpen ? handleBarCodeScanned : undefined}
                        style={styles.qrScanner}
                    /> */}
                    <TouchableOpacity onPress={() => setIsScannerOpen(false)} style={styles.closeScannerButton}>
                        <Text style={styles.closeScannerText}>Close Scanner</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#F6F6F6',
        borderRadius: 12,
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 4,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 10,
    },
    activeTab: {
        backgroundColor: '#25AE7A',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#999',
    },
    activeTabText: {
        color: '#FFFFFF',
    },
    mainContainer: {
        borderRadius: 12,
        marginHorizontal: 16,
        paddingVertical: 16,
        marginBottom: 16,
        borderWidth: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 14,
        borderRadius: 10,
        marginHorizontal: 12,
        borderWidth: 1,
    },
    inputField: {
        fontSize: 16,
        flex: 1,
    },
    scanIcon: {
        width: 22,
        height: 22,
    },
    scannerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
    },
    scannerText: {
        color: '#FFFFFF',
        fontSize: 16,
        marginBottom: 10,
    },
    qrScanner: {
        width: '80%',
        height: '50%',
    },
    closeScannerButton: {
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderRadius: 8,
        marginTop: 20,
    },
    closeScannerText: {
        fontSize: 14,
        color: '#000',
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
    },
    amountBox: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 10,
        // alignItems: 'center',
        borderWidth: 1,
    },
    amountLabel: {
        fontSize: 12,
        color: '#999',
        alignSelf: 'flex-start',
    },
    amountValue: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 4,
    },
    maxText: {
        fontSize: 12,
        color: '#25AE7A',
        position: 'absolute',
        right: 2,
        top: 17,
        
    },
    swapButton: {
        padding: 14,
        borderRadius: 50,
        marginHorizontal: 8,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        position: 'absolute',
        zIndex: 1,
        top: '70%', 
    },

    swapIcon: {
        width: 28,
        height: 28,
    },
    selectionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 12,
        marginTop: 16,
    },
    selectionBox: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 10,
        marginHorizontal: 6,
        borderWidth: 1,
    },
    selectionLabel: {
        fontSize: 12,
        color: '#999',
        marginBottom: 4,
    },
    coinWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    coinText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    coinIcon: {
        width: 28,
        height: 28,
    },
});

export default SendCryptoForm;
