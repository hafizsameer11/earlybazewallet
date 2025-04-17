import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import TransactionItem from '@/components/Transactions/TransactionItem';

interface TransactionListProps {
  transactions: {
    id: string;
    type: string;
    amount: string;
    created_at: string;
    status: string;
    currency: string;
  }[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  return (
    <View style={styles.listContainer}>
      <FlatList
        data={transactions}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <TransactionItem {...item} />}
      />
    </View>
  );
};

export default TransactionList;

const styles = StyleSheet.create({
  listContainer: {
    marginTop: 10,

  },
});
