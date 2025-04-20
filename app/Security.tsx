import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import Header from '@/components/Header';
import ToggleOption from '@/components/Setting/Security/ToggleOption';
import ChangePinButton from '@/components/Setting/Security/ChangePinButton';
import ChangePinModal from '@/components/Setting/Security/ChangePinModal';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

import * as SecureStore from 'expo-secure-store';
import { useEffect } from 'react';



const Security: React.FC = () => {
  const backgroundColor = useThemeColor({ light: '#EFFEF9', dark: '#000000' }, 'background');
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Default preferences
  const [useFaceScan, setUseFaceScan] = useState(true);
  const [useFingerprint, setUseFingerprint] = useState(true);

  // Load preferences from SecureStore
  useEffect(() => {
    const loadPreferences = async () => {
      const faceScan = await SecureStore.getItemAsync('useFaceScan');
      const fingerprint = await SecureStore.getItemAsync('useFingerprint');

      if (faceScan !== null) setUseFaceScan(faceScan === 'true');
      if (fingerprint !== null) setUseFingerprint(fingerprint === 'true');
    };

    loadPreferences();
  }, []);

  // Save preferences to SecureStore
  const handleToggleFaceScan = async (value: boolean) => {
    setUseFaceScan(value);
    await SecureStore.setItemAsync('useFaceScan', value.toString());
  };

  const handleToggleFingerprint = async (value: boolean) => {
    setUseFingerprint(value);
    await SecureStore.setItemAsync('useFingerprint', value.toString());
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
      <Header title="Security" />
      <View style={styles.optionsContainer}>
        <ToggleOption
          label="Use pin to verify transaction"
          description="Use pin code to verify transactions when sending crypto"
          icon={<MaterialIcons name="pin" size={20} color="#888" />}
          value={true}
          onToggle={() => {}}
          disabled={true}
        />
        <ToggleOption
          label="Use face scan to verify transaction"
          description="Use face scan to verify transactions when sending crypto"
          icon={<MaterialIcons name="face" size={20} color="#888" />}
          value={useFaceScan}
          onToggle={handleToggleFaceScan}
        />
        <ToggleOption
          label="Use fingerprint to verify transaction"
          description="Use fingerprint to verify transactions when sending crypto"
          icon={<Ionicons name="finger-print" size={20} color="#888" />}
          value={useFingerprint}
          onToggle={handleToggleFingerprint}
        />
      </View>

      <View style={styles.buttonContainer}>
        <ChangePinButton onPress={() => setIsModalVisible(true)} />
        <ChangePinModal visible={isModalVisible} onClose={() => setIsModalVisible(false)} />
      </View>
    </ScrollView>
  );
};

  

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingBottom: 20,
        paddingTop: 20,
    },
    optionsContainer: {
        paddingHorizontal: 16,
        marginTop: 10,
    },
    buttonContainer: {
        marginTop: 20,
        paddingHorizontal: 16,
        position: 'absolute',
        bottom: 20,
        width: '100%',
        alignSelf: 'center',
    },
});

export default Security;
