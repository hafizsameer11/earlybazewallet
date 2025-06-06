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
  type?: string | undefined;
  amountPaid?: any | undefined;
}

const TransactionSuccess: React.FC<TransactionSuccessProps> = ({ title, amount = 0, amountPaid, network = '0', currency, symbol = icons.bitCoin, type }) => {
  // Theme colors
  const backgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#1A1A1A' }, 'background');
  const textColor = useThemeColor({ light: '#000000', dark: '#FFFFFF' }, 'text');
  const borderColor = useThemeColor({ light: '#22A45D', dark: '#157347' }, 'border');
  const successTextColor = useThemeColor({ light: '#0C5E3F', dark: '#22A45D' }, 'successText');

  console.log("TransactionSuccess Props:", { title, amount, network, currency, symbol, type, amountPaid });


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
          <Text style={styles.boldText}>
            {type === 'withdraw' ? amount : amountPaid} {type === 'withdraw' ? 'has been sent to your bank account' : 'has been credited to your naira wallet'}
          </Text>

        </Text>

        {/* Transaction Details */}
        <View style={styles.detailContainer}>
          <TransactionDetailItem
            label={type === 'withdraw' ? 'Amount Withdrawn' : 'Crypto Swaped'}
            value={type === 'withdraw' ? `₦${amount.toLocaleString()}` : `${currency} ${amount}`}
          />
          {type !== 'withdraw' && (
            <TransactionDetailItem
              label="Network"
              value={network}
            />
          )}
          {/* {Number(amountPaid).toLocaleString(undefined, { maximumFractionDigits: 0 })} */}
          <TransactionDetailItem
            label={type === 'withdraw' ? 'Amount Paid' : 'Amount Received'}
            value={
              type === 'withdraw'
                ? `₦${amount.toLocaleString()}`
                : Number(amountPaid).toLocaleString(undefined, { maximumFractionDigits: 0 })
                  ? ` ${amountPaid}`
                  : `${currency}  ${amount}`
            }
          />

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
