import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet, TextInput
} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { images } from '@/constants';

interface SwapAssetSectionProps {
  title: string;
  asset: string;
  assetImage: any;
  amount: string;
  network?: string;
  networkImage?: any;
  initialAmount?: string; // ✅ Initial amount
  conversionRate?: number; // ✅ Added conversion rate (default to 1)
  onPressAsset?: () => void;
  onPressNetwork?: () => void;
  onAmountChange?: (amount: string) => void; // ✅ Passes amount to parent
  onConvertedChange?: (convertedAmount: string) => void; // ✅ Passes converted amount to parent
  balance?: string; // Optional balance prop
  converted?: string; // ✅ Add this to receive prop from parent
  nairaAmount?: any;

}

const SwapAssetSection: React.FC<SwapAssetSectionProps> = ({
  title,
  asset,
  assetImage,
  network,
  networkImage,
  amount,
  initialAmount = '',
  conversionRate = 1.0, // Default conversion rate
  onPressAsset,
  onPressNetwork,
  onAmountChange,
  balance,
  onConvertedChange,
  converted = "0.00", // ✅ default value.
  nairaAmount

}) => {
  const [enteredAmount, setEnteredAmount] = useState<string>(''); // start empty

  const textColor = useThemeColor({ light: '#000000', dark: '#FFFFFF' }, 'text');
  const cardBackgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#161616' }, 'card');
  const inputBackgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#000000' }, 'input');
  const labelColor = useThemeColor({ light: '#888', dark: '#BBBBBB' }, 'label');
  const borderColor = useThemeColor({ light: '#E5E5E5', dark: '#000000' }, 'border');
  const arrow = useThemeColor({ light: images.down_arrow, dark: images.down_arrow_black }, 'arrow');

  const inputRef = useRef<TextInput>(null);

  // ✅ Update Converted Amount when User Inputs Amount
  const handleAmountChange = (text: string) => {
    const numericValue = text.replace(/[^0-9.]/g, '');
    const input = parseFloat(numericValue || "0");
    const max = parseFloat(balance || "0");

    if (input > max) {
      alert(`🚫 You don’t have enough balance.\nYour maximum available amount is ${max.toFixed(6)} ${asset}.`);
      const maxValue = max.toFixed(6);
      setEnteredAmount(maxValue);
      const converted = (max * conversionRate).toFixed(2);
      if (onAmountChange) onAmountChange(maxValue);
      if (onConvertedChange) onConvertedChange(converted);
      return;
    }

    setEnteredAmount(numericValue);
    const updatedConvertedAmount = (input * conversionRate).toFixed(2);
    if (onAmountChange) onAmountChange(numericValue);
    if (onConvertedChange) onConvertedChange(updatedConvertedAmount);
  };

  function formatSmartDecimal(value: string | number): string {
    const num = parseFloat(String(value));
    if (isNaN(num)) return '0.00';

    const fixed = num.toFixed(8); // Show up to 8 decimals
    const trimmed = fixed
      .replace(/(\.\d*?[1-9])0+$/g, '$1') // Trim trailing zeros after non-zero digit
      .replace(/\.0+$/, '.00'); // Ensure .00 if it's whole number

    const [intPart, decPart] = trimmed.split('.');
    if (!decPart) return `${intPart}.00`;
    if (decPart.length === 1) return `${intPart}.${decPart}0`;

    return trimmed;
  }

  return (
    <View style={[styles.swapBox, { backgroundColor: cardBackgroundColor, borderColor }]}>
      <Text style={[styles.label, { color: labelColor }]}>{title}</Text>

      {/* Asset Selection */}
      {/* Asset Selection */}
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.assetBox, { borderColor, backgroundColor: inputBackgroundColor }]}
          onPress={onPressAsset}
          disabled={title === 'You Receive'} // disable press for "You Receive"
        >
          <Image source={assetImage} style={styles.assetImage} />
          <View style={styles.assetTextContainer}>
            <Text style={[styles.assetText, { color: textColor }]}>{asset}</Text>
          </View>
        </TouchableOpacity>

        {title === 'You Send' && (
          <TouchableOpacity
            style={[styles.assetBox, { borderColor, backgroundColor: inputBackgroundColor }]}
            onPress={onPressNetwork}
          >
            <Image source={networkImage} style={styles.assetImage} />
            <View style={styles.assetTextContainer}>
              <Text style={[styles.assetText, { color: textColor }]}>{network}</Text>
            </View>
          </TouchableOpacity>
        )}
        {title === 'You Receive' && (
          <View style={[styles.amountBox, { borderColor, backgroundColor: inputBackgroundColor }]}>
            <Text style={[styles.amountCurrency, { color: labelColor }]}>NGN</Text>
            <Text style={[styles.amountText, { color: textColor }]}>
              {formatSmartDecimal(converted)}
            </Text>
          </View>
        )}
      </View>


      {/* Network Selection & Converted Amount */}
      {/* Network Selection & Converted Amount */}
      {title === 'You Send' && (
        <View style={styles.row}>
          <View style={[styles.amountBox, { borderColor, backgroundColor: inputBackgroundColor }]}>
            <TouchableOpacity
              activeOpacity={1}
              style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 0 }}
              onPress={() => {
                if (asset !== "Select Asset") {
                  inputRef.current?.focus();
                }
              }}
            >
              <Text style={[styles.amountCurrency, { color: labelColor }]}>{asset}</Text>
              <TextInput
                ref={inputRef}
                style={[styles.amountText, { color: textColor, textAlign: 'right', flex: 1, padding: 0 }]}
                placeholderTextColor={labelColor}
                keyboardType="numeric"
                value={enteredAmount}
                onChangeText={(text) => setEnteredAmount(text)}
                onBlur={() => handleAmountChange(enteredAmount)}

                editable={asset !== "Select Asset"}
              />
            </TouchableOpacity>
          </View>

          <View style={[styles.amountBox, { borderColor, backgroundColor: inputBackgroundColor }]}>
            <Text style={[styles.amountCurrency, { color: labelColor }]}>USD</Text>
            <Text style={[styles.amountText, { color: textColor }]}>{converted}</Text>
          </View>
        </View>
      )}




    </View>
  );
};

const styles = StyleSheet.create({
  swapBox: {
    borderRadius: 20,
    padding: 15,
    marginBottom: 2,
    marginTop: 10,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  assetBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10, // Rounded corners
    paddingVertical: 8,
    paddingHorizontal: 10,
    width: '48%',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    justifyContent: 'space-between',
  },
  assetTextContainer: {
    flex: 1,
    marginLeft: 8, // Adjust spacing between icon and text
  },
  assetSubText: {
    fontSize: 11,
    fontWeight: '500',
    opacity: 0.6, // Light gray effect
  },
  assetImage: {
    width: 32,
    height: 32,
  },
  assetText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  arrowIcon: {
    marginTop: 10,
    width: 10,
    height: 10,
  },
  amountBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    paddingVertical: 18,
    paddingHorizontal: 10,
    width: '48%',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  amountCurrency: {
    fontSize: 10,
    fontWeight: '500',
    opacity: 0.6, // Light gray effect
  },
  amountText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
});
export default SwapAssetSection;
