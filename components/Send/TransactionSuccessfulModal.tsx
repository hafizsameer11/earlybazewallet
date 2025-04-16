import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { images } from '@/constants';
import { router } from 'expo-router';

// Success Icon Component

const SuccessIcon: React.FC = () => (

  <View style={styles.successIconContainer}>
    <View style={styles.successIcon}>
      <Image source={images.successTick} style={{ width: 75, height: 75 }} />
    </View>
  </View>
);

// Transaction Message Component
const TransactionMessage: React.FC<{ transactionReference: string, transactionAmont: string, transactionCurrency: string }> = ({ transactionReference, transactionAmont, transactionCurrency }) => (
  <View style={styles.textContainer}>
    <Text style={styles.successText}>Transaction Successful</Text>
    <Text style={styles.description}>
      You have successfully sent <Text style={styles.bold}>{transactionAmont} {transactionCurrency}</Text> to
    </Text>
    <Text style={styles.walletAddress}>{transactionReference}</Text>
  </View>
);
// Button Component
const TransactionButton: React.FC<{ onPress: () => void }> = ({ onPress }) => (

  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.buttonText}>View Transaction</Text>
  </TouchableOpacity>
);

// TransactionSuccessfulModal component
const TransactionSuccessfulModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  transactionReference: string;
  transactionAmont: string;
  transactionCurrency: string;
  transactionId: string;
}> = ({ visible, onClose, transactionAmont, transactionReference, transactionCurrency, transactionId }) => {

  const close = useThemeColor({ light: images.cross_white, dark: images.cross_white }, 'close');
  const backgroundColorClose = useThemeColor({ light: '#FFFFFF', dark: '#FFFFFF' }, 'background');
  const backgroundColor = useThemeColor({ light: '#22A45D', dark: '#22A45D' }, 'background');

  console.log("the last data", transactionAmont, transactionReference, transactionCurrency);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={[styles.modalContainer, { backgroundColor }]}>

        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <TouchableOpacity onPress={onClose} style={[styles.closeButton, { backgroundColor: backgroundColorClose }]}>
            <Image source={close} style={styles.closeIcon} />
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Success Icon */}
        <SuccessIcon />

        {/* Transaction Message */}
        <TransactionMessage
          transactionReference={transactionReference}
          transactionAmont={transactionAmont}
          transactionCurrency={transactionCurrency}
        />

        {/* Button Container */}
        <View style={styles.buttonContainer}>
          <TransactionButton
            onPress={() => {
              onClose();  // Close the modal
              router.push({
                pathname: '/TransactionSummary',
                params: { transType: 'send', id: transactionId },
              });  // Navigate to TransactionSummary
            }}
          />
        </View>
      </View>
    </Modal>
  );
};


const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 15,
    zIndex: 10,
    padding: 10,
    borderRadius: 20,
  },
  successIconContainer: {
    marginBottom: 20,
  },

  closeIcon: {
    width: 20,
    height: 20,
  },
  successIcon: {
    backgroundColor: '#138A36',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  successText: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 8,
    fontFamily: 'Caprasimo'

  },
  description: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
  walletAddress: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#E0E0E0',
    marginTop: 5,
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
    elevation: 3,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#22A45D',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
  },
});

export default TransactionSuccessfulModal;
