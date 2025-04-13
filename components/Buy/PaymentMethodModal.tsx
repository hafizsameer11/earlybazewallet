import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import icons from '@/constants/icons';
import { images } from '@/constants';

import { useQuery } from '@tanstack/react-query';
import { getFromStorage } from '@/utils/storage';
import { getBanksAccounts } from '@/utils/queries/appQueries';
import { router } from 'expo-router';

interface PaymentMethodModalProps {
  title: string;
  visible: boolean;
  onClose: () => void;
  onSelectPaymentMethod: (method: { id: number; account_name: string; account_number?: string }) => void;
}

const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({ title, visible, onClose, onSelectPaymentMethod }) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const backgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#000000' }, 'background');
  const textColor = useThemeColor({ light: '#000000', dark: '#FFFFFF' }, 'text');
  const borderColor = useThemeColor({ light: '#228B22', dark: '#90EE90' }, 'border');
  const containerBackgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#161616' }, 'containerBackgroundColor');
  const close = useThemeColor({ light: images.cross_white, dark: images.cross_black }, 'close');
  const titleTextColor = useThemeColor({ light: '#25AE7A', dark: '#25AE7A' }, 'text');
  const arrow = useThemeColor({ light: images.down_arrow, dark: images.down_arrow_black }, 'arrow');
  const closeButtonColor = useThemeColor({ light: '#F5F5F5', dark: '#161616' }, 'button');

  useEffect(() => {
    const fetchUserData = async () => {
      const fetchedToken = await getFromStorage("authToken");
      setToken(fetchedToken);
    };
    fetchUserData();
  }, []);

  const { data: bankAccounts, isLoading: bankLoading } = useQuery({
    queryKey: ["bankAccounts"],
    queryFn: () => getBanksAccounts({ token }),
    enabled: !!token,
  });

  const accounts = bankAccounts?.data || [];

  if (!bankLoading && accounts.length === 0) {
    return (
      <Modal transparent visible={visible} animationType="slide">
        <View style={styles.overlay}>
          <View style={[styles.modalContainer, { backgroundColor }]}>
            <View style={styles.header}>
              <Text style={[styles.title, { color: titleTextColor }]}>{title}</Text>
              <TouchableOpacity onPress={onClose} style={[styles.closeButton, { backgroundColor: closeButtonColor }]}>
                <Image style={styles.closeText} source={close} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.addAccountButton, { backgroundColor: containerBackgroundColor, borderColor }]}
              onPress={() => router.replace('/Account')}
            >
              <Text style={[styles.addAccountText, { color: textColor }]}>Add Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { backgroundColor }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: titleTextColor }]}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={[styles.closeButton, { backgroundColor: closeButtonColor }]}>
              <Image style={styles.closeText} source={close} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.paymentOption, { backgroundColor: containerBackgroundColor }]}
            onPress={() => setIsDropdownVisible(!isDropdownVisible)}
          >
            <Image source={icons.bank} style={styles.bankIcon} />
            <Text style={[styles.paymentText, { color: titleTextColor }]}>Bank Transfer</Text>
            <Image source={arrow} style={[styles.arrowIcon, isDropdownVisible && styles.arrowRotated]} />
          </TouchableOpacity>

          {isDropdownVisible && (
            <View style={[styles.accountContainer, { backgroundColor: containerBackgroundColor }]}>
              <FlatList
                data={accounts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.accountRow}>
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedAccountId(item.id); // Set the selected account ID
                        onSelectPaymentMethod({
                          id: item.id,
                          account_name: item.account_name,
                          account_number: item.account_number,
                        }); // Call the onSelectPaymentMethod with the necessary data
                      }}
                    >
                      <View style={[styles.radioCircle, { borderColor }]}>
                        {selectedAccountId === item.id && (
                          <View style={[styles.radioSelected, { backgroundColor: borderColor }]} />
                        )}
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.accountItem,
                        { borderColor },
                        selectedAccountId === item.id && styles.accountSelected,
                      ]}
                      onPress={() => {
                        setSelectedAccountId(item.id);
                        onSelectPaymentMethod({
                          id: item.id,
                          account_name: item.account_name,
                          account_number: item.account_number,
                        });
                        onClose();
                      }}
                    >
                      <Text style={[styles.accountTitle, { color: textColor }]}>Account {item.id}</Text>
                      <View style={styles.accountDetailsRow}>
                        <Text style={[styles.accountLabel, { color: textColor }]}>Bank Name</Text>
                        <Text style={[styles.accountText, { color: textColor }]}>{item.bank_name || "N/A"}</Text>
                      </View>
                      <View style={styles.accountDetailsRow}>
                        <Text style={[styles.accountLabel, { color: textColor }]}>Account Name</Text>
                        <Text style={[styles.accountText, { color: textColor }]}>{item.account_name || "N/A"}</Text>
                      </View>
                      <View style={styles.accountDetailsRow}>
                        <Text style={[styles.accountLabel, { color: textColor }]}>Account Number</Text>
                        <Text style={[styles.accountText, { color: textColor }]}>{item.account_number || "N/A"}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  addAccountButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    margin: 20,
  },
  addAccountText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    width: 16,
    height: 16,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    padding: 12,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  bankIcon: {
    width: 40,
    height: 40,
  },
  paymentText: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 10,
  },
  arrowIcon: {
    width: 15,
    height: 15,
    transform: [{ rotate: '0deg' }],
  },
  arrowRotated: {
    transform: [{ rotate: '180deg' }],
  },
  accountContainer: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  accountItem: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  accountSelected: {
    borderColor: '#25AE7A',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  accountTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  accountDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  accountLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  accountText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default PaymentMethodModal;
