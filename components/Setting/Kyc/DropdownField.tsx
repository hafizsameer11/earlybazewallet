import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface DropdownFieldProps {
  label: string;
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

const DropdownField: React.FC<DropdownFieldProps> = ({ label, options, selectedValue, onSelect }) => {
  const [isModalVisible, setModalVisible] = useState(false);

  // Theme colors
  const backgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#1E1E1E' }, 'background');
  const textColor = useThemeColor({ light: '#222222', dark: '#FFFFFF' }, 'text');
  const modalBackgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#2D2D2D' }, 'modalBackground');
  const activeColor = useThemeColor({ light: '#25AE7A', dark: '#25AE7A' }, 'active');

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      <TouchableOpacity
        style={[styles.input, { backgroundColor }]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={{ color: textColor }}>{selectedValue || 'Select document type'}</Text>
      </TouchableOpacity>

      <Modal visible={isModalVisible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={[styles.modal, { backgroundColor: modalBackgroundColor }]}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.modalTitle}>Select Document</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={[styles.closeButton, { color: textColor }]}>✖</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.divider} />

            {/* Options List */}
            <FlatList
              data={options}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    selectedValue === item && {
                      backgroundColor: '#F8FFFA',
                    }
                  ]}
                  onPress={() => {
                    onSelect(item);
                    setModalVisible(false);
                  }}
                >
                  <View style={[
                    styles.radioButtonOuter,
                    { borderColor: selectedValue === item ? activeColor : '#999' }
                  ]}>
                    {selectedValue === item && <View style={[styles.radioButtonInner, { backgroundColor: activeColor }]} />}
                  </View>

                  <Text style={[styles.optionText, { color: textColor }]}>{item}</Text>
                </TouchableOpacity>
              )}

              keyExtractor={(item) => item}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 10 },
  label: { fontSize: 14, fontWeight: 'bold', marginBottom: 5 },
  input: {
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
    elevation: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingBottom: 15,
  },
  modal: {
    width: '92%',
    padding: 20,
    borderRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    color: '#25AE7A',
    fontFamily: 'Caprasimo',
  },
  closeButton: {
    fontSize: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginBottom: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 10,
  },
  radio: {
    marginRight: 15,
    fontSize: 18,
  },
  optionText: {
    fontSize: 16,
  },
  radioButtonOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

});

export default DropdownField;
