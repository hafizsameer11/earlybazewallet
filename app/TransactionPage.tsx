import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import Header from '@/components/Header';
import PrimaryButton from '@/components/Buy/PrimaryButton';
import TransactionStep from '@/components/Buy/TransactionStep';
import TransactionSuccess from '@/components/Buy/TransactionSuccess';
import TransactionSummaryModal from '@/components/Buy/TransactionSummaryModal';
import { useNavigation } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import { router } from 'expo-router';

//Code related to the integration:
import { getFromStorage } from '@/utils/storage';
import { getSwap, getWithdraw, getBuy } from '@/utils/queries/appQueries';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import LoadingIndicator from '@/components/LoadingIndicator';

const TransactionPage: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const backgroundColor = useThemeColor({ light: '#EFFEF9', dark: '#000000' }, 'background');
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const textColor = useThemeColor({ light: '#000000', dark: '#FFFFFF' }, 'text');
  const route = useRoute();

  const params = route.params as { type: string };
  const transactionType = params?.type;
  const { id, types, from } = useLocalSearchParams();

  console.log("Type from TransactionPagess:", types);
  console.log("ID from TransactionPagess:", id);

  const normalizedType = types || undefined; // Ensure it's undefined if empty

  console.log("normalize type", normalizedType);
  // Fetch the token and user data when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      const fetchedToken = await getFromStorage("authToken");
      setToken(fetchedToken);
      console.log("🔹 Retrieved Token:", fetchedToken);
    };

    fetchUserData();
  }, []);
  const { data: transactionSummary, error, isPending } = useQuery({
    queryKey: [normalizedType === "swap" ? "internalSend" : normalizedType === undefined ? "withdraw" : "internalReceive", token, id],
    queryFn: () => {
      if (!token || !id) return Promise.reject("No valid ID or token");

      // Call the correct function based on `normalizedType`
      // Default to `getWithdraw`, only call `getSwap` if type is explicitly "swap"
      if (normalizedType === "swap") {
        return getSwap({ token, id });
      }
      if (normalizedType === "buy") {
        return getBuy({ token, id });
      }
      else {
        return getWithdraw({ token, id });
      }
    },
    enabled: !!token && !!id, // Only fetch if both token and ID exist
  });
  if (isPending && id) {
    return <LoadingIndicator message="Fetching Transaction Details..." />;
  }
  console.log("🔹 Transaction Data of Swap/Receive:", transactionSummary);

  const normalizedStatus = transactionSummary.data.status
    ? transactionSummary.data.status.toLowerCase()
    : "unknown";
  // Function to generate dynamic labels based on API response keys

  console.log("the Status....", normalizedStatus);
  const generateLabels = (transactionData, normalizedType) => {
    if (!transactionData) return {}; // Ensure no errors if data is missing

    return normalizedType === "swap"
      ? {
        coin: transactionData?.coin || "Unknown",
        network: transactionData?.network || "Unknown",
        amountBtc: transactionData?.amountBtc || "Unknown",
        amountUsd: transactionData?.amountUsd || "Unknown",
        amountPaid: transactionData?.amountPaid || "Unknown",
        accountPaidTo: transactionData?.accountPaidTo || "Unknown",
        transactionReference: transactionData?.transactionReference || "Unknown",
        transactionDate: transactionData?.transactionDate || "Unknown",
        status: transactionData?.status || "Unknown",
        reason: transactionData?.reason || null,
      }
      : normalizedType === "buy"
        ? {
          coin: transactionData?.coin || "Unknown",
          network: transactionData?.network || "Unknown",
          amountBtc: transactionData?.amount_btc || "Unknown",
          amountUsd: transactionData?.amount_usd || "Unknown",
          amountPaid: transactionData?.amount_paid || "Unknown",
          accountPaidTo: transactionData?.account_paid_to || "Unknown",
          transactionReference: transactionData?.transaction_reference || "Unknown",
          transactionDate: transactionData?.transaction_date || "Unknown", // FIXED: Directly using the date
          status: transactionData?.status || "Unknown",
        }
        : {
          amount: transactionData?.amount || "Unknown",
          bank_name: transactionData?.bank_account?.bank_name || "Unknown",
          transactionReference: transactionData?.transactionReference || "Unknown",
          transactionDate: transactionData?.transactionDate || "Unknown",
          status: transactionData?.status || "Unknown",
        };
  };

  // Extract API transaction data safely
  const transactionData = transactionSummary?.data
    ? normalizedType === "swap"
      ? {
        coin: transactionSummary.data.currency || "Unknown",
        network: transactionSummary.data.network || "Unknown",
        amountBtc: transactionSummary.data.amount || "Unknown"
          ? `${transactionSummary.data.amount} ${transactionSummary.data.currency}`
          : "Unknown",
        amountUsd: transactionSummary.data.amount_usd
          ? `$${transactionSummary.data.amount_usd}`
          : "Unknown",
        amountPaid: transactionSummary.data.amount_naira
          ? `NGN${Number(transactionSummary.data.amount_naira).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
          : "Unknown",
        accountPaidTo: "Account 1", // Placeholder
        transactionReference: transactionSummary.data.reference || "Unknown",
        transactionDate: transactionSummary.data.created_at
          ? new Date(transactionSummary.data.created_at).toLocaleString()
          : "Unknown",
        status: ["approved", "completed", "success"].includes(normalizedStatus)
          ? "Success"
          : ["rejected", "failed"].includes(normalizedStatus)
            ? "Rejected"
            : "Pending",
        reason:
          transactionSummary.data.status === "failed" || 'rejected'
            ? "Network congestion timeout"
            : null,
      }
      : normalizedType === "buy"
        ? {
          coin: transactionSummary.data.coin || "Unknown",
          network: transactionSummary.data.network || "Unknown",
          amountBtc: transactionSummary.data.amount_btc || "Unknown",
          amountUsd: transactionSummary.data.amount_usd || "Unknown",
          amountPaid: transactionSummary.data.amount_paid || "Unknown",
          accountPaidTo: transactionSummary.data.account_paid_to || "Unknown",
          transactionReference: transactionSummary.data.transaction_reference || "Unknown",
          transactionDate: transactionSummary.data.transaction_date || "Unknown", // FIXED: No Date conversion
          status: transactionSummary.data.status || "Unknown",
        }
        : {
          amount: transactionSummary.data.amount || "Unknown",
          bank_name:
            transactionSummary.data.bank_account?.bank_name || "Unknown",
          transactionReference: transactionSummary.data.reference || "Unknown",
          transactionDate: transactionSummary.data?.created_at
            ? new Date(transactionSummary.data.created_at.replace(/\.\d{6}Z$/, 'Z')).toLocaleString()
            : "Unknown",

          status:
            ["approved", "completed", "success"].includes(transactionSummary.data.status)
              ? "Success"
              : ["rejected", "failed"].includes(transactionSummary.data.status)
                ? "Rejected"
                : "Pending",
        }
    : null;




  // Generate labels dynamically from transactionData
  const labels = generateLabels(transactionData, normalizedType);

  // Base transaction steps
  const baseTransactions = [
    {
      title: 'Transaction Submitted',
      description: 'Your transaction has been submitted successfully.',
      date: new Date(transactionSummary?.data?.created_at || "").toLocaleString(),
      isCompleted: true,
      hasButton: true,
    },
    {
      title: 'Transaction Processed',
      description: 'Your transaction is being processed, your naira account will be credited soon.',
      date: new Date(transactionSummary?.data?.created_at || "").toLocaleString(),
      isCompleted: normalizedStatus !== "pending" && normalizedStatus !== "rejected",
      isProcessing: normalizedStatus === "pending",
    },
  ];

  // Additional steps based on status
  const statusSteps = {
    rejected: {
      title: 'Transaction Rejected',
      description: 'Your transaction has been rejected. Please try again.',
      isCompleted: false,
      isProcessing: false,
    },
    failed: {
      title: 'Transaction Failed',
      description: 'Your transaction failed. Please contact support.',
      isCompleted: false,
      isProcessing: false,
    },
  };

  // Check if the current status requires adding an extra step
  const extraStep = statusSteps[normalizedStatus]
    ? {
      ...statusSteps[normalizedStatus],
      date: new Date(transactionSummary?.data?.updated_at || "").toLocaleString(),
    }
    : null;

  // Construct final transactions array
  const transactions = extraStep ? [...baseTransactions, extraStep] : baseTransactions;

  console.log("TransactionDataComing:", transactions);

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <Header title="Transaction Page" from={from} />


      {/* Transaction Steps */}
      <View style={styles.progressContainer}>
        <View style={styles.progressLine} />

        {transactions.map((tx, index) => (
          <TransactionStep
            key={index}
            title={tx.title}
            description={tx.description}
            date={tx.date}
            isCompleted={tx.isCompleted}
            isProcessing={tx.isProcessing}
            hasButton={tx.hasButton}
            transactionData={transactionData}
          />
        ))}

        {(normalizedStatus === "approved" || normalizedStatus === "completed") && (
          <View style={{ marginTop: 20 }}>
            <TransactionSuccess
              type={types}
              title={types === "withdraw" ? "Withdrawal Successful" : "Transaction Successful"}
              amount={transactionSummary?.data?.amount}
              network={transactionSummary?.data?.network}
              currency={transactionSummary?.data?.currency}
              symbol={transactionSummary?.data?.symbol}
              amountPaid={transactionData?.amountPaid}
            />
          </View>
        )}

      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        {/* If only one step exists or transaction is still processing */}
        {transactions.length === 1 ||
          (transactions.some(tx => tx.title === 'Transaction Processed') &&
            transactionData?.status !== "rejected" &&
            !transactions.some(tx => tx.title === 'Transaction Success')) ? (
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              if (from === "summary") {
                router.push('/(tabs)')
              } else {
                navigation.goBack();
              }
            }}
          >
            <Text style={[styles.closeButtonText, { color: textColor }]}>
              {transactionData?.status === "Rejected" ? "Support" : "Close"}
            </Text>
          </TouchableOpacity>

        ) : (
          <>
            <View style={styles.buttonWrapper}>
              <PrimaryButton title="Full Summary" onPress={() => setModalVisible(true)} />
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                if (from === "summary") {
                  router.push('/(tabs)')

                } else {
                  navigation.goBack();
                }
              }}
            >
              <Text style={[styles.closeButtonText, { color: textColor }]}>
                {transactionData?.status === "Rejected" ? "Support" : "Close"}
              </Text>
            </TouchableOpacity>

          </>
        )}
      </View>

      {/* Modal */}
      <TransactionSummaryModal visible={modalVisible} onClose={() => setModalVisible(false)} transactionData={transactionData} labels={labels} />

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 3,
    paddingBottom: 20,
    marginTop: 25,
  },
  progressContainer: {
    marginBottom: 20,
    position: 'relative',
    paddingHorizontal: 18,
  },
  progressLine: {
    position: 'absolute',
    left: -130,
    top: 170,
    width: 327,
    height: 0,
    borderWidth: 0.5,
    borderColor: '#9A9A9A',
    transform: [{ rotate: '90deg' }],
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 18,
    position: 'absolute',
    bottom: 0,
  },
  buttonWrapper: {
    flex: 1,
    marginRight: 10,
  },
  closeButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#A0A0A0',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    height: 60,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
});

export default TransactionPage;
