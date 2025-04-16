import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import PaymentMethodModal from '@/components/Buy/PaymentMethodModal';
import { images } from '@/constants';

const PaymentMethodHeader: React.FC<{ setSelectedPaymentMethodId: (data: { id: string; account_name: string; account_number: string }) => void }> = ({ setSelectedPaymentMethodId }) => {
  const backgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#1A1A1A' }, 'cardBackground');
  const borderColor = useThemeColor({ light: '#C2C2C2', dark: '#444' }, 'border');
  const textColor = useThemeColor({ light: '#1A1A1A', dark: '#C2C2C2' }, 'placeholder');
  const arrow = useThemeColor({ light: images.down_arrow, dark: images.down_arrow_black }, 'arrow');

  const [selectedAccount, setSelectedAccount] = useState<{ id: string; account_name: string } | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelectPaymentMethod = (method: { id: string; account_name: string; account_number: string }) => {
    console.log('Selected Method:', method);  // Debugging step
    // Set local state for selected account name
    setSelectedAccount({ id: method.id, account_name: method.account_name });

    // Pass the full object (id, account_name, account_number) to the parent component
    setSelectedPaymentMethodId({ id: method.id, account_name: method.account_name, account_number: method.account_number });

    // Close the modal after selection
    setModalVisible(false);
  };

  useEffect(() => {
    console.log('Updated selectedAccount:', selectedAccount);  // Debugging step
  }, [selectedAccount]);

  return (
    <>
      <TouchableOpacity
        style={[styles.container, { backgroundColor, borderColor }]}
        onPress={() => setModalVisible(true)}
      >
        {/* Display Selected Account Name or Default 'Payment Method' */}
        <Text style={[styles.text, { color: textColor }]}>
          {selectedAccount?.account_name || 'Payment Method'}
        </Text>
        <Image source={arrow} style={styles.arrowIcon} />
      </TouchableOpacity>

      {/* Payment Method Modal */}
      <PaymentMethodModal
        title="Payment Method"
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelectPaymentMethod={handleSelectPaymentMethod}
      />
    </>
  );
};


const styles = StyleSheet.create({
  container: {
    height: 60,
    borderWidth: 0.3,
    borderColor: '#C2C2C2',
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 0px 4px rgba(165, 165, 165, 0.25)',
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 15,
    alignSelf: 'center',
  },
  text: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
  },
  arrowIcon: {
    width: 16,
    height: 16,
  },
});

export default PaymentMethodHeader;
