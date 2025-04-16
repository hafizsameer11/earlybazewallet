import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { images } from '@/constants';

//Code related to the integration: 
import { verifyPin, setPin } from '@/utils/mutations/authMutations';
import { useMutation } from '@tanstack/react-query';
import { getFromStorage } from "@/utils/storage";
import Toast from "react-native-toast-message"; // ✅ Import Toast


interface ChangePinModalProps {
  visible: boolean;
  onClose: () => void;
}

const ChangePinModal: React.FC<ChangePinModalProps> = ({ visible, onClose }) => {
  const [email, setEmail] = useState<string | null>(null);
  const backgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#1A1A1A' }, 'background');
  const textColor = useThemeColor({ light: '#000', dark: '#fff' }, 'text');
  const buttonColor = useThemeColor({ light: '#22A45D', dark: '#2E7D32' }, 'button');
  const borderColor = useThemeColor({ light: '#E0E0E0', dark: '#333' }, 'border');

  const [step, setStep] = useState(1);
  const [pin, setPin] = useState<string[]>(['', '', '', '']);
  const [newPin, setNewPin] = useState<string[]>(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState<string[]>(['', '', '', '']);

  const inputRefs = useRef<Array<TextInput | null>>([]);
  const close = useThemeColor({ light: images.cross_white, dark: images.cross_black }, 'close');

  // Reset the modal state when it is closed
  useEffect(() => {
    if (!visible) {
      setStep(1);
      setPin(['', '', '', '']);
      setNewPin(['', '', '', '']);
      setConfirmPin(['', '', '', '']);
    }
  }, [visible]);

  // Fetch the token and user data when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      const user = await getFromStorage("user");
      const email = user.email
      setEmail(email);
      console.log("🔹 Retrieved email:", email);
    };

    fetchUserData();
  }, []);
  console.log("🔹 Email:", email);

  // Mutation to verify the old pin
  const { mutate: verifyOldPin } = useMutation({
    mutationFn: () => verifyPin({ email: email || '', pin: pin.join('') }),
    onSuccess: () => {
      setStep(2);
      // Show success toast
      Toast.show({
        type: 'success',
        text1: 'Success ✅',
        text2: 'Old PIN verified successfully!',
        visibilityTime: 3000,
      });
    },
    onError: (error) => {
      // Show error toast
      Toast.show({
        type: 'error',
        text1: 'Error ❌',
        text2: error.message || 'Failed to verify PIN.',
        visibilityTime: 3000,
      });
    },
  });

  // Mutation for Setting new pin
  const { mutate: setNewPinMutation } = useMutation({
    mutationFn: () => setPin({ email: email || '', pin: newPin.join('') }),
    onSuccess: () => {
      setStep(3);
      // Show success toast
      Toast.show({
        type: 'success',
        text1: 'Success ✅',
        text2: 'New PIN set successfully!',
        visibilityTime: 3000,
      });
      onClose();
    },
    onError: (error) => {
      // Show error toast
      Toast.show({
        type: 'error',
        text1: 'Error ❌',
        text2: error.message || 'Failed to set new PIN.',
        visibilityTime: 3000,
      });
    },
  });



  const handleChange = (text: string, index: number) => {
    if (!/^\d*$/.test(text)) return; // Ensure only numeric input

    let newPinArray = [...pin];

    if (step === 1) newPinArray = [...pin];
    else if (step === 2) newPinArray = [...newPin];
    else newPinArray = [...confirmPin];

    newPinArray[index] = text;

    if (step === 1) setPin(newPinArray);
    else if (step === 2) setNewPin(newPinArray);
    else setConfirmPin(newPinArray);

    // Move to the next input field automatically
    if (text && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleProceed = () => {
    const enteredPin = step === 1 ? pin.join('') : step === 2 ? newPin.join('') : confirmPin.join('');

    if (enteredPin.length !== 4) {
      Alert.alert('Error', 'Please enter a valid 4-digit PIN.');
      return;
    }

    if (step === 1) {
      if (email) {
        verifyOldPin({ email, pin: enteredPin }); // Verify old pin
      } else {
        Alert.alert('Error', 'Email not found.');
      }
    } else if (step === 2) {
      setStep(3);
      setConfirmPin(['', '', '', '']); // Reset confirm PIN fields
    } else if (step === 3) {
      if (confirmPin.join('') !== newPin.join('')) {
        Alert.alert('Error', 'New PIN does not match. Please try again.');
        return;
      }
      if (email) {
        setNewPinMutation({ email, pin: newPin.join('') }); // Set new pin
      } else {
        Alert.alert('Error', 'Email not found.');
      }
    }
  };


  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { backgroundColor }]}>
          {/* Header with Close Button */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: buttonColor }]}>Pin Setup</Text>
            <TouchableOpacity onPress={onClose} style={[styles.closeButton, { backgroundColor: backgroundColor }]}>
              <Image source={close} style={styles.closeIcon} />
            </TouchableOpacity>
          </View>
          <View style={styles.horizontalLine} />

          {/* Step Text */}
          <Text style={styles.subTitle}>
            {step === 1 ? 'Input Old Pin' : step === 2 ? 'Input New Pin' : 'Re-enter New Pin'}
          </Text>

          {/* PIN Input Fields */}
          <View style={styles.pinInputContainer}>
            {(step === 1 ? pin : step === 2 ? newPin : confirmPin).map((_, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={[
                  styles.pinInput,
                  { borderColor: borderColor, color: textColor, backgroundColor: backgroundColor }
                ]}
                keyboardType="numeric"
                maxLength={1}
                secureTextEntry
                value={step === 1 ? pin[index] : step === 2 ? newPin[index] : confirmPin[index]}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === 'Backspace' && index > 0) {
                    inputRefs.current[index - 1]?.focus();
                  }
                }}
              />
            ))}
          </View>

          {/* Proceed Button */}
          <View style={{ width: '100%', paddingHorizontal: 20 }}>
            <TouchableOpacity style={[styles.button, { backgroundColor: buttonColor }]} onPress={handleProceed}>
              <Text style={styles.buttonText}>Proceed</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Toast /> {/* ✅ Add Toast Component to Render */}

    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContainer: {
    width: '93%',
    borderRadius: 20,

    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6, // For Android shadow
  },
  horizontalLine: {
    width: '100%',
    height: 0.5,
    backgroundColor: '#0F714D',
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Caprasimo',
  },
  closeButton: {
    padding: 5,
    borderRadius: 25,
    borderWidth: 0.5,
  },
  closeIcon: {
    width: 20,
    height: 20,
  },
  subTitle: {
    fontSize: 32,
    marginVertical: 20,
    color: '#22A45D',
    paddingBottom: 10,
    fontFamily: 'Caprasimo',

  },
  pinInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  pinInput: {
    width: 55,
    height: 55,
    borderWidth: 2,
    borderRadius: 10,
    fontSize: 26,
    textAlign: 'center',
    marginHorizontal: 8,
  },

  button: {
    width: '100%',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 15,

  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',

  },
});

export default ChangePinModal;
