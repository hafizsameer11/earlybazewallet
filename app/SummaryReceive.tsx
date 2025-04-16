import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { images } from '@/constants';
import { useNavigation } from '@react-navigation/native';
import Header from '@/components/Header';
import useLoadFonts from '@/hooks/useLoadFonts'; // Import font loader

const SummaryReceive: React.FC = () => {
    const backgroundColor = useThemeColor({ light: '#25AE7A', dark: '#000000' }, 'background');
    const cardBackgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#FFFFFF' }, 'card');
    const textColor = useThemeColor({ light: '#222222', dark: '#222222' }, 'text');
    const navigation = useNavigation();
    const fontsLoaded = useLoadFonts(); // Load custom fonts


    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
            <Header />



            {/* Summary Card */}
            <View style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
                <Text style={[styles.title, { color: textColor,}]}>EarlyBaze</Text>

                {/* QR Code */}
                <Image source={images.qrcode} style={styles.qrCode} />

                {/* Deposit Section */}
                <View style={styles.depositContainer}>
                    <View style={styles.chainIconWrapper}>
                        <Image source={images.solana} style={styles.chainIcon} />
                    </View>
                    {/* Transaction Details */}
                    <View style={styles.transactionDetails}>
                        <Text style={styles.depositText}>ETH Deposit</Text>

                        <TransactionDetail label="Chain type" value="Ethereum" />
                        <TransactionDetail label="Date" value="23rd Dec, 2024" />
                        <TransactionDetail label="Time" value="11:58 PM" />
                    </View>
                </View>


            </View>
        </ScrollView>
    );
};

const TransactionDetail: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingVertical: 20,
        marginTop: 25,
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 2,
    },
    card: {
        justifyContent: 'space-between',
        width: '90%',
        borderRadius: 15,
        padding: 7,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        alignSelf: 'center',
        marginTop: 20,
        height: '67%',
    },
    title: {
        marginTop: 20,
        fontSize: 32,
        fontFamily: 'Caprasimo'

    },
    qrCode: {
        width: 234,
        height: 234,
        marginBottom: 15,
    },
    depositContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#25AE7A',
        paddingVertical: 10,
        width: '100%',
        borderRadius: 10,
        marginTop: -15, // To overlap the card slightly
    },
    chainIconWrapper: {
        position: 'absolute',
        top: -25,
        left: '46%',
        transform: [{ translateX: -15 }],
        padding: 5,
        borderRadius: 50,
    },
    chainIcon: {
        width: 45,
        height: 45,
    },
    depositText: {
        flex: 1,
        textAlign: 'center',
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    transactionDetails: {
        marginTop: 15,
        width: '100%',
        paddingHorizontal: 10,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
    },
    detailLabel: {
        fontSize: 14,
        color: '#FFFFFF',
    },
    detailValue: {
        fontSize: 14,
        color: '#FFFFFF',

        fontWeight: 'bold',
    },
});

export default SummaryReceive;
