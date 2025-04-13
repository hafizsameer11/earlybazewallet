import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SettingOptionProps {
  title: string;
  iconName: any;
  onPress: () => void;
  iconColor?: string;
  textColor?: string;
  rightContent?: React.ReactNode;
}

const SettingOption: React.FC<SettingOptionProps> = ({ 
  title, 
  iconName, 
  onPress, 
  iconColor = "#000", 
  textColor = "#000", 
  rightContent 
}) => {
  return (
    <TouchableOpacity style={styles.settingRow} onPress={onPress}>
      <View style={styles.iconLabel}>
        <Image source={iconName} style={[{height:20,width:20}]} />
        <Text style={[styles.label, { color: textColor }]}>{title}</Text>
      </View>
      {rightContent && <View>{rightContent}</View>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  iconLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    marginLeft: 10,
  },
});

export default SettingOption;
