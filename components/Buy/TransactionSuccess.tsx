import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import icons from '@/constants/icons';
import TransactionDetailItem from '@/components/Buy/TransactionDetailItem';

// Define the props interface
interface TransactionSuccessProps {
  title: string;
  amount: any | undefined;
  network: string | undefined;
  currency?: string | undefined;
  symbol?: string | undefined;
}

const TransactionSuccess: React.FC<TransactionSuccessProps> = ({ title, amount = 0, network = '0', currency, symbol = icons.bitCoin }) => {
  // Theme colors
  const backgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#1A1A1A' }, 'background');
  const textColor = useThemeColor({ light: '#000000', dark: '#FFFFFF' }, 'text');
  const borderColor = useThemeColor({ light: '#22A45D', dark: '#157347' }, 'border');
  const successTextColor = useThemeColor({ light: '#0C5E3F', dark: '#22A45D' }, 'successText');

  return (
    <View style={styles.successContainer}>
      {/* Success Badge with Checkmark */}
      <View style={styles.successBadgeContainer}>
        <View style={[styles.successBadge, { backgroundColor }]}>
          <Image source={icons.checkmark} style={styles.successIcon} />
        </View>
      </View>

      {/* Transaction Box */}
      <View style={[styles.successBox, { backgroundColor, borderColor }]}>
        <Text style={[styles.successTitle, { color: successTextColor }]}>{title}</Text>
        <Text style={[styles.successAmount, { color: textColor }]}>
          <Text style={styles.boldText}>{amount} {network}</Text> has been credited to your crypto wallet
        </Text>

        {/* Transaction Details */}
        <View style={styles.detailContainer}>
          <TransactionDetailItem label="Crypto bought" value={currency} />
          <TransactionDetailItem label="Network" value="Bitcoin" />
          <TransactionDetailItem label="Amount Paid" value={amount} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  successContainer: {
    alignItems: 'center',
    marginBottom: 20,
    flex: 1,
  },
  successBadgeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -30, // Positioned above the success box
    zIndex: 2,
  },
  successBadge: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  successIcon: {
    width: 50,
    height: 50,
  },
  successBox: {
    width: '100%',
    borderRadius: 10,
    padding: 5,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    paddingTop: 40, // Space for badge overlap
  },
  successTitle: {
    fontSize: 16,
    marginTop: 13,
    textAlign: 'center',
    marginBottom: 5,
    fontFamily: 'Caprasimo'
  },
  successAmount: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 15,
  },
  boldText: {
    fontWeight: 'bold',
  },
  detailContainer: {
    width: '100%',
  },
});

export default TransactionSuccess;
