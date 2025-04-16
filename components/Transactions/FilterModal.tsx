import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { images } from '@/constants';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
}

const filters = ['All', 'completed', 'pending', 'failed'];

const FilterModal: React.FC<FilterModalProps> = ({ visible, onClose, selectedFilter, setSelectedFilter }) => {
  const backgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#1A1A1A' }, 'background');
  const textColor = useThemeColor({ light: '#000000', dark: '#FFFFFF' }, 'text');
  const activeColor = useThemeColor({ light: '#22A45D', dark: '#157347' }, 'active');
  const close = useThemeColor({ light: images.cross_white, dark: images.cross_black }, 'close');
  const dividerColor = useThemeColor({ light: '#DDDDDD', dark: '#333333' }, 'border');

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { backgroundColor }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.modalTitle]}>Status Filter</Text>
            <TouchableOpacity onPress={onClose} style={[styles.closeButton, { backgroundColor }]}>
              <Image source={close} style={styles.closeIcon} />
            </TouchableOpacity>
          </View>
          <View style={[styles.horizontalLine, { backgroundColor: dividerColor }]} />

          <View style={styles.filterContainer}>
            {/* Filter Options */}
            {filters.map(filter => (
              <TouchableOpacity
                key={filter}
                style={styles.filterOption}
                onPress={() => {
                  setSelectedFilter(filter);
                  onClose();
                }}
              >
                <View style={[styles.radioCircle, {
                  borderColor: selectedFilter === filter ? activeColor : '#C2C2C2'
                }]}>
                  {selectedFilter === filter && <View style={[styles.radioSelected, { backgroundColor: activeColor }]} />}
                </View>
                <Text style={[styles.filterText, { color: textColor }]}>{filter}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContainer: {
    width: '95%',
    borderRadius: 15,
    paddingBottom: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    paddingHorizontal: 20,
  },
  horizontalLine: {
    width: '100%',
    height: 1,
  },
  modalTitle: {
    fontSize: 18,
    color: '#25AE7A',
    fontFamily: 'Caprasimo',
  },
  closeButton: {
    padding: 6,
    borderRadius: 25,
  },
  closeIcon: {
    width: 20,
    height: 20,
  },
  filterContainer: {
    padding: 12,
    gap: 10,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
    borderRadius: 12,
  },
  filterText: {
    fontSize: 16,
    marginLeft: 12,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
