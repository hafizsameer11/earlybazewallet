import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import icons from '@/constants/icons';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter, router } from 'expo-router';

interface TransactionItemProps {
  type: string;
  amount: string;
  created_at: string;
  status: string;
  id: string,
}

const TransactionItem: React.FC<TransactionItemProps> = ({ type, amount, created_at, status, id }) => {
  const backgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#1A1A1A' }, 'background');
  const textColor = useThemeColor({ light: '#000000', dark: '#FFFFFF' }, 'text');

  const withdrawTransaction = type || undefined; // Ensure it's undefined if empty


  console.log("The data coming....", amount);

  // Define colors for different statuses
  const statusColors: Record<string, string> = {
    successful: '#139B15',
    pending: '#E0B711',
    failed: '#E51616',
  };
  console.log("Inside ", type);
  console.log("The Id", id);
  const statusColor = statusColors[status.toLowerCase()] || '#888';

  // Get icon based on transaction type
  const iconSource = (type === undefined || type === 'undefined') ? icons.withdraw : icons?.[type];
  const formattedDate = created_at.substring(0, 19); // This removes the `.000000Z` part


  // Define colors for different transaction types
  const transactionTypeColors: Record<string, string> = {
    send: '#C6FFC7', // Green for send
    receive: '#FFCAEE', // Pink for receive
    buy: '#E0D6FF', // Purple for buy
    swap: '#FFDFDF', // Red for swap
    withdrawTransaction: '#D9D9D9', // Gray for withdraw
  };

  const iconBackgroundColor = transactionTypeColors[type] || '#C6FFC7'; // Default to send color if no match

  return (
    <TouchableOpacity
      style={[styles.itemContainer, { backgroundColor }]}
      onPress={() => {
        if (type === 'send' || type === 'receive') {
          router.push(`/TransactionSummary?id=${id}&transType=${type}`);

        } else {
          router.push(`/TransactionPage?id=${id}&types=${type}`);
        }
      }}
    >
      <View style={styles.leftContainer}>
        {/* Transaction Type Icon */}
        <View style={[styles.iconWrapper, { backgroundColor: iconBackgroundColor }]}>
          <Image source={iconSource} style={styles.icon} />
        </View>

        {/* Transaction Details */}
        <View>
          <Text style={[styles.transactionType, { color: textColor }]}>USDT</Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.transactionStatus, { color: statusColor }]}>{status}</Text>
          </View>
        </View>
      </View>

      {/* Amount & Date */}
      <View style={styles.rightContainer}>
        <Text style={[styles.amount, { color: textColor }]}>{parseFloat(amount).toFixed(4)}</Text>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>

      {/* Arrow Icon */}
      <Ionicons name="chevron-forward" size={20} color="#888" />
    </TouchableOpacity>
  );
};

export default TransactionItem;

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 15,
    marginHorizontal: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    backgroundColor: '#C6FFC7',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  icon: {
    width: 15,
    height: 15,
  },
  transactionType: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  transactionStatus: {
    fontSize: 12,
    fontWeight: '500',
  },
  rightContainer: {
    alignItems: 'flex-end',
    flexGrow: 1,
    marginRight: 10,
  },
  amount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 10,
    color: '#888',
  },
});
