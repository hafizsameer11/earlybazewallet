import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useThemeColor } from '@/hooks/useThemeColor';
import { images } from '@/constants';

interface TransactionDetailItemProps {
  label: string;
  value: string | number;
  isCopyable?: boolean;
  icon?: any;
  valueStyle?: object;
}

const TransactionDetailItem: React.FC<TransactionDetailItemProps> = ({ label, value, isCopyable, icon, valueStyle }) => {
  const textColor = useThemeColor({ light: '#000000', dark: '#FFFFFF' }, 'text');
  const labelColor = useThemeColor({ light: '#808080', dark: '#A0A0A0' }, 'label');
  const copy = useThemeColor({ light: images.copy_white, dark: images.copy_black }, 'copy');

  const handleCopy = async () => {
    await Clipboard.setString(String(value));
    console.log(`Copied: ${value}`);
  };
  function formatSmartDecimal(value: string | number): string {
    const num = parseFloat(String(value));
    if (isNaN(num)) return '0.00';

    const fixed = num.toFixed(8); // Show up to 8 decimals
    const trimmed = fixed
      .replace(/(\.\d*?[1-9])0+$/g, '$1') // remove trailing zeros
      .replace(/\.0+$/, '.00');           // ensure whole numbers end in .00

    const [intPart, decPart] = trimmed.split('.');
    if (!decPart) return `${intPart}.00`;
    if (decPart.length === 1) return `${intPart}.${decPart}0`;

    return trimmed;
  }

  return (
    <View style={styles.paymentRow}>
      <Text style={[styles.label, { color: labelColor }]}>{label}</Text>

      <View style={styles.rightContent}>
        {isCopyable && (
          <TouchableOpacity onPress={handleCopy}>
            <Image source={copy} style={styles.icon} />
          </TouchableOpacity>)}

        <Text
          style={[styles.value, { color: textColor }, valueStyle]}
          numberOfLines={2}
        >
          {typeof value === 'number' || !isNaN(Number(value)) ? formatSmartDecimal(value) : String(value)}
        </Text>

        {icon && <Image source={icon} style={styles.icon} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomColor: '#ddd',
    gap: 10,
  },
  label: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#999',
    maxWidth: 110,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 1,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    maxWidth: '65%',
  },
  value: {
    fontSize: 10,
    fontWeight: '600',
    flexShrink: 1,
    flexWrap: 'wrap',
    textAlign: 'right',
    maxWidth: '100%',
  },
  icon: {
    width: 16,
    height: 16,
    marginLeft: 4,
  },
});

export default TransactionDetailItem;
