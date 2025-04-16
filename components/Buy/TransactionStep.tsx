import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import icons from '@/constants/icons';
import TransactionSummaryModal from '@/components/Buy/TransactionSummaryModal';

interface TransactionStepProps {
  title: string;
  description: string;
  date: string;
  isCompleted?: boolean;
  isProcessing?: boolean;
  hasButton?: boolean;
  transactionData?: {
    coin: string;
    network: string;
    amountBtc: string;
    amountUsd: string;
    amountPaid: string;
    accountPaidTo: string;
    transactionReference: string;
    transactionDate: string;
    status: string;
    reason?: string; // Optional field
  };
}

const TransactionStep: React.FC<TransactionStepProps> = ({
  title,
  description,
  date,
  isCompleted = false,
  isProcessing = false,
  hasButton = false,
  transactionData,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  console.log('Transaction DataAAAA:', transactionData);

  // Theme colors
  const backgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#1A1A1A' }, 'background');
  const textColor = useThemeColor({ light: '#000000', dark: '#FFFFFF' }, 'text');
  const borderColor = useThemeColor({ light: '#EAEAEA', dark: '#333333' }, 'border');
  const buttonColor = useThemeColor({ light: '#FFFFFF', dark: '#0D0D0D' }, 'button');
  const labelColor = useThemeColor({ light: '#000000B2', dark: '#A0A0A0' }, 'label');

  return (
    <>
      <View style={styles.stepItem}>
        {/* Left Indicator (Checkmark or Number) */}
        <View
          style={[
            styles.stepCircle,
            title === 'Transaction Rejected' && styles.rejectedStepCircle,
          ]}
        >
          {isCompleted ? (
            <Image
              source={title === 'Transaction Rejected' ? icons.cross_circle : icons.check_circle}
              style={styles.checkIcon}
            />
          ) : (
            <Text style={styles.stepNumberText}>3</Text>
          )}
        </View>

        {/* Transaction Box */}
        <View style={[styles.transactionBox, { backgroundColor, borderColor }]}>
          <Text
            style={[
              styles.stepTitle,
              title === 'Transaction Submitted' && [, { color: textColor }],
              title === 'Transaction Processed' && styles.processedTitle,
              title === 'Transaction Rejected' && styles.rejectedTitle,
            ]}
          >
            {title}
          </Text>
          <Text style={[styles.stepDescription, { color: labelColor }]}>{description}</Text>

          {hasButton && (
            <TouchableOpacity
              style={[styles.viewSummaryBtn, { backgroundColor: buttonColor }]}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.viewSummaryText}>View Summary</Text>
            </TouchableOpacity>
          )}

          <Text style={[styles.dateText, { color: labelColor }]}>{date}</Text>
        </View>
      </View>

      {/* Transaction Summary Modal */}
      <TransactionSummaryModal visible={modalVisible} onClose={() => setModalVisible(false)} transactionData={transactionData} />
    </>
  );
};

const styles = StyleSheet.create({
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#22A45D', // Default green
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  rejectedStepCircle: {
    backgroundColor: '#C51B1B', // Red for rejected transactions
  },
  stepCircleNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#22A45D',
    backgroundColor: '#EFFEF9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#22A45D',
  },
  checkIcon: {
    width: 14,
    height: 14,
  },
  transactionBox: {
    flex: 1,
    borderRadius: 10,
    padding: 15,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  stepTitle: {
    fontSize: 13,
    fontFamily: 'Caprasimo'

  },
  boldTitle: {
    fontWeight: 'bold',
  },
  processedTitle: {
    color: '#C56A1B',
    fontFamily: 'Caprasimo'
  },
  rejectedTitle: {
    color: '#C51B1B',
    fontFamily: 'Caprasimo'
  },
  stepDescription: {
    fontSize: 11,
    fontWeight: 'medium',
    marginVertical: 5,
  },
  viewSummaryBtn: {
    paddingHorizontal: 2,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  viewSummaryText: {
    fontSize: 12,
    borderWidth: 1,
    borderColor: '#25AE7A',
    borderRadius: 30,
    color: '#25AE7A',
    padding: 10,
  },
  dateText: {
    fontSize: 10,
    marginTop: 5,
    fontWeight: 'bold',
    alignSelf: 'flex-end',
  },
});

export default TransactionStep;
