import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface ToggleOptionProps {
  label: string;
  description: string;
  icon: React.ReactNode;
  value: boolean;
  onToggle: (val: boolean) => void;
  disabled?: boolean;
}

const ToggleOption: React.FC<ToggleOptionProps> = ({ label, description, icon, value, onToggle, disabled = false }) => {
  const textColor = useThemeColor({ light: '#000', dark: '#fff' }, 'text');

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>{icon}</View>
      <View style={styles.textContainer}>
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#ddd', true: '#A5D6A7' }}
        thumbColor={value ? '#009B5D' : '#f4f3f4'}
        ios_backgroundColor="#ddd"
        disabled={disabled}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  iconContainer: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 12,
    color: '#888',
  },

});

export default ToggleOption;
