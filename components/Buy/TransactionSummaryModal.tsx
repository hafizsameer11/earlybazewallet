import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image
} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import icons from '@/constants/icons';
import TransactionDetailItem from '@/components/Buy/TransactionDetailItem';
import { images } from '@/constants';


interface TransactionSummaryModalProps {
  visible: boolean;
  onClose: () => void;
  transactionData: {
    coin: string;
    network: string;
    amountBtc: string;
    amountUsd: string;
    amountPaid: string;
    accountPaidTo: string;
    transactionReference: string;
    transactionDate: string;
    status: string;
    reason?: string;
  };
  labels: { [key: string]: string }; // Mapping field names to labels
}


const TransactionSummaryModal: React.FC<TransactionSummaryModalProps> = ({ visible, onClose, transactionData, labels }) => {
  console.log("Transaction Data:", transactionData);
  const backgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#1A1A1A' }, 'background');
  const textColor = useThemeColor({ light: '#000000', dark: '#FFFFFF' }, 'text');
  const labelColor = useThemeColor({ light: '#808080', dark: '#A0A0A0' }, 'label');
  const borderColor = useThemeColor({ light: '#EAEAEA', dark: '#333333' }, 'border');
  const textTitleColor = useThemeColor({ light: '#25AE7A', dark: '#25AE7A' }, 'textTitle');

  console.log("The Labels", labels);
  console.log();

  const close = useThemeColor({ light: images.cross_white, dark: images.cross_black }, 'close');

  const statusColor =
    transactionData && transactionData.status === "Completed" || "Success"
      ? "#25AE7A"
      : transactionData && transactionData.status === "Rejected"
        ? "#D32F2F"
        : textColor;

  const showReason = transactionData && transactionData.status === "Rejected";

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { backgroundColor, borderColor }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: textTitleColor }]}>Summary</Text>
            <TouchableOpacity onPress={onClose} style={[styles.closeButton, { backgroundColor: backgroundColor }]}>
              <Image source={close} style={styles.closeIcon} />
            </TouchableOpacity>
          </View>
          <View style={styles.horizontalLine} />

          {/* Transaction Details */}
          <View style={styles.detailContainer}>
            {Object.entries(transactionData || {}).map(([key, value]) => {
              if (!value) return null; // Skip empty or null values

              // Format amount fields to two decimals, remove trailing zeros
              let displayValue = value;
              if (key.startsWith("amount")) {
                // Try to extract the numeric part (e.g., "$1.00000000" or "NGN1,750")
                const match = typeof value === "string" && value.match(/^([^0-9.-]*)([0-9,.-]+)(.*)$/);
                if (match) {
                  let prefix = match[1] || "";
                  let numStr = match[2].replace(/,/g, "");
                  let suffix = match[3] || "";
                  let num = Number(numStr);
                  if (!isNaN(num)) {
                    // Format to 2 decimals, remove trailing .00 if present
                    let formatted = num.toFixed(2).replace(/\.00$/, "");
                    displayValue = `${prefix}${formatted}${suffix}`;
                  }
                }
              }

              return (
                <TransactionDetailItem
                  key={key}
                  label={labels?.[key] || key}
                  value={displayValue}
                  isCopyable={key === "transactionReference"}
                  valueStyle={key === "status" ? { color: statusColor, fontWeight: "bold" } : {}}
                />
              );
            })}

            {/* Conditionally render Reason */}
            {showReason && transactionData?.reason && (
              <TransactionDetailItem label={labels?.reason || "Reason"} value={transactionData.reason} />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalContainer: {
    width: '90%',
    borderRadius: 15,
    borderWidth: 1,
    position: 'relative',
  },
  title: {
    fontSize: 17,
    fontFamily: 'Caprasimo'
  },
  horizontalLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#0F714D',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  closeButton: {
    padding: 5,
    borderRadius: 25,
    borderWidth: 1,
  },
  closeIcon: {
    width: 20,
    height: 20,
  },
  detailContainer: {
    marginTop: 10,
  },
});

export default TransactionSummaryModal;
