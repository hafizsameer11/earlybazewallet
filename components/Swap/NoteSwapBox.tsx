import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

const NoteSwapBox: React.FC = () => {
  const backgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#1A1A1A' }, 'cardBackground');
  const borderColor = '#25AE7A';
  const textColor = useThemeColor({ light: '#000000', dark: '#FFFFFF' }, 'text');

  return (
    <View style={[styles.container, { backgroundColor, borderColor }]}>
      {/* Header (Note) */}
      <View style={[styles.header, { borderBottomColor: borderColor }]}>
        <Text style={[styles.headerText, { color: textColor }]}>Note</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={[styles.noteText, { color: textColor }]}>
          First Select Coin and then Network before entering the amount
        </Text>
        <Text style={[styles.noteText, { color: textColor }]}>
          CrossCheck Amount Before Swap
        </Text>
        <Text style={[styles.noteText, { color: textColor }]}>
          Make sure you select the right network
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // width: 388,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#25AE7A',
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 0px 4px rgba(165, 165, 165, 0.25)',
    borderRadius: 15,
    // paddingVertical: 10,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#25AE7A',
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  noteText: {
    fontSize: 10,
    fontWeight: '400',
    marginBottom: 5,
  },
});

export default NoteSwapBox;
