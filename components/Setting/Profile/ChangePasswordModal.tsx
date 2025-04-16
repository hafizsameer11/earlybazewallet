import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Image } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import PrimaryButton from '@/components/Buy/PrimaryButton';
import { images } from '@/constants';


//Code related to the Integration
import { useMutation } from '@tanstack/react-query';
import { changePassword } from '@/utils/mutations/accountMutations';
import { getFromStorage } from '@/utils/storage';

interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ visible, onClose }) => {
  const cardBackgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#1A1A1A' }, 'card');
  const textColor = useThemeColor({ light: '#222222', dark: '#FFFFFF' }, 'text');
  const inputBorderColor = useThemeColor({ light: '#E5E5E5', dark: '#333333' }, 'border');
  const backgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#1A1A1A' }, 'background');
  const textTitleColor = useThemeColor({ light: '#25AE7A', dark: '#25AE7A' }, 'textTitle');
  const close = useThemeColor({ light: images.cross_white, dark: images.cross_black }, 'close');

  const [token, setToken] = useState<string | null>(null); // State to hold the token
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // State to track focus
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  // Function to handle focus and blur
  const handleFocus = (field: string) => setFocusedInput(field);
  const handleBlur = () => setFocusedInput(null);

  // Fetch the token and user data when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      const fetchedToken = await getFromStorage("authToken");
      setToken(fetchedToken);
      console.log("🔹 Retrieved Token:", fetchedToken);
    };

    fetchUserData();
  }, []);
  console.log("🔹 Token:", token);
  const { isPending: isPendingChangePassword, mutate: mutateChangePassword } = useMutation({
    mutationFn: (data: { oldPassword: string; newPassword: string }) => changePassword({ data, token }), // Pass the token and the data as expected

    onSuccess: (response) => {
      console.log("✅ Password Changed Successfully:", response);
      alert("Password changed successfully!");
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onClose();
    },
    onError: (error) => {
      console.error("❌ Error changing password:", error);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      alert(`❌ Error changing password: ${error.message || 'An unknown error occurred'}`);

    },
  });



  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { backgroundColor: cardBackgroundColor }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: textTitleColor }]}>Change Password</Text>
            <TouchableOpacity onPress={onClose} style={[styles.closeButton, { backgroundColor: backgroundColor }]}>
              <Image source={close} style={styles.closeIcon} />
            </TouchableOpacity>
          </View>
          <View style={styles.horizontalLine} />

          {/* Password Input Fields */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: textColor }]}>Old Password</Text>
            <TextInput
              style={[styles.input, { borderColor: focusedInput === 'oldPassword' ? '#25AE7A' : inputBorderColor, color: textColor }]}
              placeholder="Enter old password"
              placeholderTextColor="#A1A1A1"
              secureTextEntry
              value={oldPassword}
              onChangeText={setOldPassword}
              onFocus={() => handleFocus('oldPassword')}
              onBlur={handleBlur}
            />

            <Text style={[styles.label, { color: textColor }]}>New Password</Text>
            <TextInput
              style={[styles.input, { borderColor: focusedInput === 'newPassword' ? '#25AE7A' : inputBorderColor, color: textColor }]}
              placeholder="Enter new password"
              placeholderTextColor="#A1A1A1"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              onFocus={() => handleFocus('newPassword')}
              onBlur={handleBlur}
            />

            <Text style={[styles.label, { color: textColor }]}>New Password Again</Text>
            <TextInput
              style={[styles.input, { borderColor: focusedInput === 'confirmPassword' ? '#25AE7A' : inputBorderColor, color: textColor }]}
              placeholder="Enter new password again"
              placeholderTextColor="#A1A1A1"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              onFocus={() => handleFocus('confirmPassword')}
              onBlur={handleBlur}
            />
          </View>

          {/* Update Button */}
          <View style={styles.buttonContainer}>
            <PrimaryButton
              title={isPendingChangePassword ? "Updating..." : "Update"}
              onPress={() => {
                if (!oldPassword || !newPassword || !confirmPassword) {
                  alert("Please fill in all fields.");
                  return;
                }
                if (newPassword !== confirmPassword) {
                  alert("New passwords do not match.");
                  return;
                }
                mutateChangePassword({ oldPassword, newPassword });
              }}
              disabled={isPendingChangePassword} // Disable button while updating
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '94%',
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  horizontalLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#0F714D',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Caprasimo'

  },
  inputContainer: {
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 15,
    marginBottom: 10,
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
  buttonContainer: { paddingHorizontal: 15, marginBottom: 15 },
});

export default ChangePasswordModal;
