import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import PrimaryButton from '@/components/Buy/PrimaryButton';
import Header from '@/components/Header';
import SwapSummaryDetails from '@/components/Swap/SwapSummaryDetails';
import { useLocalSearchParams, useRouter, router } from "expo-router";
const SwapSummary: React.FC = () => {
  // Theme Colors
  const backgroundColor = useThemeColor({ light: '#EFFEF9', dark: '#000000' }, 'background');
  const {
    id,
    currency,
    network,
    amount,
    exchange_rate,
    amount_usd,
    amount_naira,
    fee_naira,
    fee,
    status,
    user_id,
    reference,
    updated_at,
    created_at,
    transaction_id,
    icon
  } = useLocalSearchParams(); console.log("To Test", id);
  console.log("Can I see", icon);
  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <Header title="Swap Summary" />

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.summaryContainer}>
          <SwapSummaryDetails
            currency={currency}
            network={network}
            amount={amount}
            exchange_rate={exchange_rate}
            amount_usd={amount_usd}
            amount_naira={amount_naira}
            fee_naira={fee_naira}
            fee={fee}
            status={status}
            transaction_id={transaction_id}
            reference={reference}
            icon={icon} // Pass icon as a prop here

          />
        </View>
      </ScrollView>

      {/* Proceed Button Fixed at Bottom */}
      <View style={styles.fixedButtonContainer}>
        <PrimaryButton
          title="Proceed"
          onPress={() =>
            router.push({
              pathname: "/TransactionPage",
              params: { types: "swap", id, from: "summary" }, // ✅ Add `from`
            })
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 25,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  summaryContainer: {
    marginHorizontal: 16,
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 18,
    right: 18,
    width: '90%',
  },
});

export default SwapSummary;
