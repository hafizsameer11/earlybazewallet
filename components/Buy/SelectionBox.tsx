// components/common/SelectionBox.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { images } from '@/constants';

interface SelectionBoxProps {
  label: string;
  value: string;
  icon: any;
  id: string;
  onPress?: () => void;
  disabled?: boolean;
  style?: object; // ✅ Added missing `style` prop
  coinName?:string;
}


const SelectionBox: React.FC<SelectionBoxProps> = ({ label, value, icon, onPress, id, disabled, style }) => {
  const textColor = useThemeColor({ light: '#000000', dark: '#FFFFFF' }, 'text');
  const bgColor = useThemeColor({ light: '#FFFFFF', dark: '#2D2D2D' }, 'inputBackground');
  const arrow = useThemeColor({ light: images.down_arrow, dark: images.down_arrow_black }, 'arrow');

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: bgColor, opacity: disabled ? 0.5 : 1 },
        style || {} // ✅ Ensure style is always an object to avoid undefined errors
      ]}
      onPress={disabled ? undefined : onPress}
      activeOpacity={disabled ? 1 : 0.7}
      disabled={disabled}
    >

      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      <View style={styles.content}>
        <Text style={[styles.value, { color: textColor }]}>{value}</Text>
        <View style={styles.iconContainer}>
          <Image
            source={typeof icon === 'string' && icon.startsWith('http') ? { uri: icon } : icon}
            style={styles.icon}
          />
          <TouchableOpacity onPress={disabled ? undefined : onPress} activeOpacity={disabled ? 1 : 0.7}>
            <Image source={arrow} style={[styles.arrowIcon,]} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'column',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2, // Android shadow
  },
  label: {
    fontSize: 11,
    fontWeight: "500",
    marginBottom: 4,
    opacity: 0.6, // Light gray effect like in the image
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  value: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 33,
    height: 33,
    marginRight: 6, // Space between icon and arrow
    marginBottom: 2, // Adjusted spacing between icon and text
  },
  arrowIcon: {
    width: 12,
    height: 12,
  },
});

export default SelectionBox;
