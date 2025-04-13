import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import InputField from '@/components/Buy/InputField';
import SelectionBox from '@/components/Buy/SelectionBox';
import PaymentMethodHeader from '@/components/Buy/PaymentMethodHeader';
import AmountToPay from '@/components/Buy/AmountToPay';
import NetworkSelectionModal from './Receive/NetworkSelectionModal';
import networkOptions from '@/constants/networkOptions.json';

import { images } from '@/constants';

//Import realted to the integration
import { calculateExchangeRate } from '../utils/mutations/accountMutations';
import { useMutation } from '@tanstack/react-query';
import { getFromStorage } from "@/utils/storage";



interface BuyCardProps {
  setSelectedData: (data: { selectedCoin: any; selectedNetwork: any }) => void; // ✅ Accepts function to update parent state
}




const BuyCard = ({ setSelectedData, showToast }) => {  // Add showToast prop
  const [token, setToken] = useState<string | null>(null);
  const [usdAmount, setUsdAmount] = useState<string>('');  // For USD input
  const [btcAmount, setBtcAmount] = useState<string>('0');  // For BTC input
  const [ngnAmount, setNgnAmount] = useState<string>('NGN 0');  // For NGN input
  const [isUsdEditable, setIsUsdEditable] = useState<boolean>(false);  // Control USD input editability
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState(networkOptions[0]);
  const [selectedNetwork, setSelectedNetwork] = useState(networkOptions[0]);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<{ id: string; account_name: string; account_number: string } | null>(null);

  const [modalType, setModalType] = useState<string | null>(null);
  const doublearrow = useThemeColor({ light: images.double_arrow_white, dark: images.double_arrow_black }, 'doublearrow');

  const [hasUserSelectedCoin, setHasUserSelectedCoin] = useState(false);


  useEffect(() => {
    const fetchUserData = async () => {
      const fetchedToken = await getFromStorage('authToken');
      setToken(fetchedToken);
      console.log('🔹 Retrieved Token:', fetchedToken);
    };
    fetchUserData();
  }, []);

  const { mutate: getExchangeRate } = useMutation({
    mutationFn: ({ data, token }: { data: { currency: string; amount: string }; token: string }) =>
      calculateExchangeRate({ data, token }),
    onSuccess: (response) => {
      if (response?.status === 'success') {
        const { amount_usd, amount_naira } = response.data;
        setBtcAmount(amount_usd);  // Update BTC input
        setNgnAmount(`NGN ${parseFloat(amount_naira).toFixed(2)}`);  // Update NGN input
      }
    },
    onError: (error) => {
      console.error('Error fetching exchange rate:', error);
    },
  });

  const handleUsdChange = (value: string) => {
    setUsdAmount(value);
    if (token && selectedCoin) {
      getExchangeRate({
        data: {
          currency: selectedCoin.name,
          amount: value,
        },
        token,
      });
    }
  };




  const coinId = selectedCoin?.id ? selectedCoin.id.toString() : null;

  const openModal = (type: string) => {
    setModalType(type);
    setModalVisible(true);
  };


  useEffect(() => {
    setSelectedData({
      selectedCoin,
      selectedNetwork,
      selectedPaymentMethodId,
      amount_coin: btcAmount,
      amount_usd: usdAmount,
      amount_naira: ngnAmount.replace('NGN ', '')
    });
    console.log('🔹 Updated Selection:', {
      selectedCoin,
      selectedNetwork,
      selectedPaymentMethodId,
      amount_coin: btcAmount,
      amount_usd: usdAmount,
      amount_naira: ngnAmount.replace('NGN ', '')
    });
  }, [selectedCoin, selectedNetwork, selectedPaymentMethodId, btcAmount, usdAmount, ngnAmount]);

  useEffect(() => {
    if (hasUserSelectedCoin) {
      setIsUsdEditable(selectedCoin && selectedCoin.name ? true : false);
    }
  }, [selectedCoin, hasUserSelectedCoin]);

  const handleSelectNetwork = (network: any) => {
    if (modalType === 'coin') {
      setSelectedCoin(network);
      setHasUserSelectedCoin(true); // Mark that the user has selected a coin
      setIsUsdEditable(true);
    } else if (modalType === 'network') {
      setSelectedNetwork(network);
    }
    setModalVisible(false);
  };

  return (
    <View style={[styles.card, { backgroundColor: useThemeColor({ light: '#FFFFFF', dark: '#161616' }, 'cardBackground') }]}>
      <PaymentMethodHeader setSelectedPaymentMethodId={setSelectedPaymentMethodId} />

      {/* Coin Selection */}
      <View style={styles.exchangeContainer}>
        <InputField
          label={selectedCoin.name}
          value={usdAmount}
          editable={isUsdEditable}
          onChangeText={handleUsdChange}
          keyboardType="numeric"
          onPressDisabled={() => showToast("Please select a coin first.")} // Show toast when input is disabled
        />

        <SelectionBox
          label="Coin"
          id={selectedCoin.id}
          value={selectedCoin.name}
          icon={selectedCoin.icon}
          onPress={() => openModal('coin')}
        />
      </View>

      {/* Swap Button */}
      <TouchableOpacity style={[styles.swapButton, { borderColor: useThemeColor({ light: '#E5E5E5', dark: '#095D3F' }, 'arrowBorder') }]}>
        <Image source={doublearrow} style={styles.swapIcon} />
      </TouchableOpacity>

      {/* Network Selection */}
      <View style={styles.selectionContainer}>
        <InputField label="USD" value={btcAmount} editable={false} />
        <SelectionBox
          label="Network"
          id={selectedNetwork.id}
          value={selectedNetwork.name}
          icon={selectedNetwork.icon}
          onPress={coinId ? () => openModal('network') : undefined}
          disabled={!coinId}
          style={!coinId ? { opacity: 0.5 } : undefined}
        />
      </View>

      {/* Amount to Pay Section */}
      <AmountToPay label="Amount to pay" value={ngnAmount} />

      {coinId && (
        <NetworkSelectionModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSelectNetwork={handleSelectNetwork}
          selectedNetwork={selectedNetwork}
          networks={networkOptions}
          modelType={modalType}
          coinId={selectedCoin.id}
          isBuy={true}
        />
      )}
    </View>
  );
};




const styles = StyleSheet.create({
  card: {
    marginTop: 20,
    borderRadius: 10,
    padding: 16,
    margin: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  exchangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  selectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 8,
  },
  swapButton: {
    padding: 14,
    borderRadius: 50,
    marginHorizontal: 8,
    borderWidth: 2,
    position: 'absolute',
    zIndex: 1,
    top: '50%',
    right: '45%',
  },
  swapIcon: {
    width: 28,
    height: 28,
  },
});

export default BuyCard;
