import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import icons from '@/constants/icons';
import TransactionDetailItem from '@/components/Buy/TransactionDetailItem';
import { images } from '@/constants';

interface SwapSummaryDetailsProps {
  currency: string;
  network: string;
  amount: string;
  exchange_rate: string;
  amount_usd: string;
  amount_naira: string;
  fee_naira: string;
  fee: string;
  status: string;
  transaction_id: string;
  reference: string;
  icon: any; // Add the icon prop here
}

const SwapSummaryDetails: React.FC<SwapSummaryDetailsProps> = ({
  currency,
  network,
  amount,
  exchange_rate,
  amount_usd,
  amount_naira,
  fee_naira,
  fee,
  status,
  transaction_id,
  reference,
  icon, // Destructure icon here

}) => {
  // Theme Colors
  const backgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#1A1A1A' }, 'background');
  const textColor = useThemeColor({ light: '#0C5E3F', dark: '#0C5E3F' }, 'text');
  const borderColor = useThemeColor({ light: '#22A45D', dark: '#157347' }, 'border');
  const highlightTextColor = useThemeColor({ light: '#0C5E3F', dark: '#22A45D' }, 'highlightText');
  const swapIcon = useThemeColor({ light: images.double_side_white, dark: images.double_side_black }, 'swapIcon');

  return (
    <>
      <View style={styles.swapHeader}>
        <View style={styles.assetContainer}>
          {/* Use dynamic icon from the URL */}
          <Image source={{ uri: icon }} style={styles.assetIcon} /> {/* Use dynamic icon here */}
          <Text style={[styles.amountText, { color: textColor }]}>{amount}</Text>
        </View>
        <Image source={swapIcon} style={[styles.swapIcon]} />
        <View style={styles.assetContainer}>
          {/* Use dynamic icon from the URL */}
          <Image source={images.naira} style={styles.assetIcon} /> {/* Use dynamic icon here */}
          <Text style={[styles.amountText, { color: textColor }]}>{amount_naira}</Text>
        </View>
      </View>

      <View style={[styles.summaryBox, { backgroundColor, borderColor }]}>
        {/* Transaction Details */}
        <View style={styles.transactionDetails}>
          {/* Use dynamic icon here */}
          <TransactionDetailItem label="Coin Sent" value={currency} icon={{ uri: icon }} />
          <TransactionDetailItem label="Network" value={network} icon={{ uri: icon }} />
          <TransactionDetailItem label="Asset Received" value="Naira" icon={images.naira} />
          <TransactionDetailItem label="Amount paid in USD" value={amount_usd} />
          <TransactionDetailItem label="Amount to receive in NGN" value={amount_naira} />
          <TransactionDetailItem label="Amount to receive in USD" value={amount_usd} />
          <TransactionDetailItem label="Exchange Rate" value={exchange_rate} />
          <TransactionDetailItem label="Transaction ID" value={transaction_id} />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  summaryBox: {
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 16,
    marginTop: 20,
    overflow: 'hidden',
    paddingTop: 50,
  },
  swapHeader: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    top: -20,
    width: '100%',
    paddingVertical: 10,
    marginBottom: 10,
    zIndex: 10,
    left: '20%',
  },
  assetContainer: {
    alignItems: 'center',
    marginHorizontal: 20,


  },
  assetIcon: {
    marginTop: 10,
    width: 40,
    height: 40,
    borderWidth: 1.5,              // Add light border
    borderColor: '#E5E5E5',        // Light grey as per your requirement
    borderRadius: 20,              // Make it circular
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  swapIcon: {
    position: 'absolute',
    width: 30,
    left: '24%',
    top: 22,
  },
  transactionDetails: {
    width: '100%',
    // paddingHorizontal: 10,
  },
});

export default SwapSummaryDetails;
