import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, NativeAppEventEmitter } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import PrimaryButton from '@/components/Buy/PrimaryButton';
import Header from '@/components/Header';
import TransactionDetailItem from '@/components/Buy/TransactionDetailItem';
import icons from '@/constants/icons';
import { router, useLocalSearchParams } from 'expo-router';
import VerificationModal from '@/components/Send/VerificationModal';
import { useState } from 'react';
import TransactionFailedModal from '@/components/Send/TransactionFailedModal';
import TransactionSuccessfulModal from '@/components/Send/TransactionSuccessfulModal';
import moment from 'moment';


//Code Related to the Integration:
import { getFromStorage } from "@/utils/storage";
import { useQuery } from '@tanstack/react-query';
import { getInternalSend } from "@/utils/queries/appQueries";
import { getInternalReceive } from "@/utils/queries/appQueries";
import LoadingIndicator from "@/components/LoadingIndicator";

const TransactionSummary: React.FC = () => {
  const { type, currency, network, amount, email, address, temp, image, platform_fee, network_fee, total_fee, amount_after_fee, converted, name } = useLocalSearchParams();

  const { transType } = useLocalSearchParams();
  console.log("Transaction Type:", transType); // Debugging
  const { id } = useLocalSearchParams();
  console.log("Transaction ID:", id); // Debugging
  console.log("The data coming from the props:", type, currency, network, amount, email, address, temp, image);
  console.log("🧾 Image from params:", image);

  console.log("The Amount:", amount);
  const [token, setToken] = useState<string | null>(null); // State to hold the token

  console.log("Received type from navigation:", type);
  const backgroundColor = useThemeColor({ light: "#EFFEF9", dark: "#000000" }, "background");
  const cardBackgroundColor = useThemeColor({ light: "#FFFFFF", dark: "#1A1A1A" }, "card");

  const [isModalVisible, setModalVisible] = useState(false);
  const [transactionReference, setTransactionReference] = useState<string | null>(null);
  const [isVerificationVisible, setVerificationVisible] = useState(false);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [transactionAmount, setTransactionAmount] = useState<string | null>(null);
  const [transactionCurrency, setTransactionCurrency] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const fetchedToken = await getFromStorage("authToken");
      setToken(fetchedToken);
      console.log("🔹 Retrieved Token:", fetchedToken);
    };

    fetchUserData();
  }, []);

  const { data: transactionData, error, isPending } = useQuery({
    queryKey: [
      transType === "send" || type === "send" ? "internalSend" : "internalReceive",
      token,
      id
    ],
    queryFn: () => {
      if (!token || !id) return Promise.reject("No valid ID or token");

      // Check if transType exists, otherwise fallback to type
      if (transType === "send" || type === "send") {
        return getInternalSend({ token, id });
      } else {
        return getInternalReceive({ token, id });
      }
    },
    enabled: !!token && !!id, // Only fetch if both token and ID exist
  });

  console.log("🔹 Transaction Data:", transactionData);

  const transaction = useMemo(() => {
    return transactionData?.data || {
      id: 0,
      transaction_id: 0,
      transaction_type: type || "internal",
      currency: currency,
      symbol: "default.png",
      tx_id: "N/A",
      block_hash: "N/A",
      gas_fee: "N/A",
      status: "pending",
      created_at: "N/A",
      amount: amount || "N/A",
      amount_usd: amount || "N/A",
      converted: converted || "N/A",
      sender_address: email || "N/A",
      recipient_address: email || address,
      name: name
    };
  }, [transactionData, type, email, address, amount]);

  // ✅ Place this check AFTER all hooks are initialized
  if (isPending && !temp) {
    return <LoadingIndicator message="Fetching Transaction Details..." />;
  }

  function formatSmartDecimal(value: string | number): string {
    const num = parseFloat(String(value));
    if (isNaN(num)) return '0.00';

    const fixed = num.toFixed(8); // Show up to 8 decimals
    const trimmed = fixed
      .replace(/(\.\d*?[1-9])0+$/g, '$1') // Trim trailing zeros after non-zero digit
      .replace(/\.0+$/, '.00'); // Ensure .00 if it's whole number

    const [intPart, decPart] = trimmed.split('.');
    if (!decPart) return `${intPart}.00`;
    if (decPart.length === 1) return `${intPart}.${decPart}0`;

    return trimmed;
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <Header title="Summary" />

      {/* Dynamic Crypto Icon with Floating Effect */}
      <View style={styles.iconWrapper}>
        <View style={styles.borderWrapper}>
          <View style={styles.iconContainer}>
            <Image
              source={
                image && typeof image === "string" && image.startsWith("http")
                  ? { uri: image }
                  : { uri: `https://earlybaze.hmstech.xyz/storage/${transaction?.symbol || "default.png"}` }
              }
              style={styles.bitcoinIcon}
            />
          </View>
        </View>
      </View>


      {/* Transaction Card */}
      <View style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.amountText}>
            {formatSmartDecimal(transaction?.amount || '0')}
          </Text>
s
          <Text style={[styles.amountText, { marginLeft: 4 }]}>
            {transaction?.currency?.replace(/\b\w/g, (char) => char.toUpperCase())}
          </Text>

        </View>
        y
        <TransactionDetailItem
          label={type === "send" ? "Recipient Address" : "Sender Address"}
          value={email || String(transType == "send" ? transaction?.sender_address : transaction?.recipient_address)}
          isCopyable
        />

        <TransactionDetailItem
          label="Network"
          value={String(transaction?.currency)}
          icon={
            image && typeof image === "string" && image.startsWith("http")
              ? { uri: image }
              : { uri: `https://earlybaze.hmstech.xyz/storage/${transaction?.symbol || "default.png"}` }
          }
        />

        <TransactionDetailItem label="Amount" value={String(transaction?.amount)} />
        <TransactionDetailItem label="Amount in USD" value={String(transaction?.converted ?? transaction?.amount_usd)} />
        {type === "send" && (
          <TransactionDetailItem label="Receiver Name" value={String(transaction?.name)} />
        )}

        {!temp && (
          <>
            <TransactionDetailItem label="Network fee" value={String(transaction?.gas_fee ?? 0)} />
            <TransactionDetailItem label="Transaction Hash" value={String(transaction?.tx_id)} isCopyable />

            <TransactionDetailItem
              label="Transaction Date"
              value={transaction?.created_at ? moment(transaction?.created_at).format("MMMM DD, YYYY h:mm A") : "N/A"}
            />
            <TransactionDetailItem label="Type" value={String(transaction?.transaction_type)} />
            <TransactionDetailItem
              label="Status"
              value={String(transaction?.status)}
              valueStyle={{
                color:
                  String(transaction?.status).toLowerCase() === 'completed'
                    ? 'green'
                    : String(transaction?.status).toLowerCase() === 'rejected'
                      ? 'red'
                      : undefined,
              }}
            />          </>
        )}
      </View>

      {/* Action Button */}
      <View style={styles.buttonContainer}>
        {type === "send" && (
          <PrimaryButton title="Proceed" onPress={() => setVerificationVisible(true)} />
        )}
      </View>

      {/* Show Verification Modal */}
      <VerificationModal
        visible={isVerificationVisible}
        onClose={() => setVerificationVisible(false)}
        onFail={() => {
          setVerificationVisible(false);
          setModalVisible(true); // ✅ Show failed modal when transfer fails
        }}
        onSuccess={(data) => {
          console.log("The data is:", data);
          setTransactionReference(data.reference);
          setTransactionAmount(data.amount);
          setTransactionCurrency(data.currency)
          setSuccessModalVisible(true); // ✅ Show success modal on transfer success
          setTransactionId(data.transaction_id)
        }}

        requestData={{
          currency,
          network,
          amount,
          email,
          address,
          token,
          ...(type === "send" && {
            fee_summary: {
              platform_fee_usd: platform_fee ?? "0.00",
              network_fee_usd: network_fee ?? "0.00",
              total_fee_usd: total_fee ?? "0.00",
              amount_after_fee: amount_after_fee ?? "0.00"
            }
          })
        }}

      />

      <TransactionSuccessfulModal
        visible={isSuccessModalVisible}
        onClose={() => {
          setSuccessModalVisible(false);
          router.replace("/(tabs)"); // 👈 Navigates to the home tab (if using expo-router)
        }}
        transactionReference={transactionReference}
        transactionAmont={transactionAmount}
        transactionCurrency={transactionCurrency}
        transactionId={transactionId}
      />

    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 20,
  },
  iconWrapper: {
    alignItems: 'center',
    marginBottom: -45, // Pulls it into the card
    zIndex: 10,
  },
  iconContainer: {
    width: 65,
    height: 65,
    backgroundColor: '#FFFF', // Bitcoin orange
    borderRadius: 32.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    marginBottom: -26,
  },
  borderWrapper: {
    width: 70, // slightly larger to show border
    height: 40, // half of the full height
    borderTopLeftRadius: 33,
    borderTopRightRadius: 33,
    borderWidth: 1,
    borderColor: '#22A45D', // ✅ Your desired top border color
    borderBottomWidth: 0,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bitcoinIcon: {
    width: 65,
    height: 65,
    resizeMode: 'contain',
  },
  card: {
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderColor: '#22A45D',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginTop: 43,
  },
  amountText: {
    fontSize: 18,
    color: '#22A45D',
    textAlign: 'center',
    marginVertical: 10,
    fontFamily: 'Caprasimo'


  },
  buttonContainer: {
    marginTop: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
});

export default TransactionSummary;
