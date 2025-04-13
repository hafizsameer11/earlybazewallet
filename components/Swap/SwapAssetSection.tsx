import React, { useState,useRef } from 'react';
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
}

const SwapAssetSection: React.FC<SwapAssetSectionProps> = ({
  title,
  asset,
  assetImage,
  network,
  networkImage,
  amount,
  initialAmount = "0",
  conversionRate = 1.0, // Default conversion rate
  onPressAsset,
  onPressNetwork,
  onAmountChange,
  balance,
  onConvertedChange
}) => {
  const [enteredAmount, setEnteredAmount] = useState(initialAmount); // ✅ State for user-entered amount
  const [convertedAmount, setConvertedAmount] = useState((parseFloat(initialAmount) * conversionRate).toFixed(2)); // ✅ State for converted amount

  const textColor = useThemeColor({ light: '#000000', dark: '#FFFFFF' }, 'text');
  const cardBackgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#161616' }, 'card');
  const inputBackgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#000000' }, 'input');
  const labelColor = useThemeColor({ light: '#888', dark: '#BBBBBB' }, 'label');
  const borderColor = useThemeColor({ light: '#E5E5E5', dark: '#000000' }, 'border');
  const arrow = useThemeColor({ light: images.down_arrow, dark: images.down_arrow_black }, 'arrow');

  const inputRef = useRef<TextInput>(null);

  // ✅ Update Converted Amount when User Inputs Amount
  const handleAmountChange = (text: string) => {
    const numericValue = text.replace(/[^0-9.]/g, ''); // Allow only numbers & decimal
    const input = parseFloat(numericValue || "0");
    const max = parseFloat(balance || "0");

    if (input > max) {
      alert(`🚫 You don’t have enough balance.\nYour maximum available amount is ${max.toFixed(6)} ${asset}.`);

      // Auto-set to max
      const maxValue = max.toFixed(6);
      setEnteredAmount(maxValue);
      const converted = (max * conversionRate).toFixed(2);
      setConvertedAmount(converted);

      if (onAmountChange) onAmountChange(maxValue);
      if (onConvertedChange) onConvertedChange(converted);
      return;
    }

    setEnteredAmount(numericValue);
    const updatedConvertedAmount = (input * conversionRate).toFixed(2);
    setConvertedAmount(updatedConvertedAmount);

    if (onAmountChange) onAmountChange(numericValue);
    if (onConvertedChange) onConvertedChange(updatedConvertedAmount);
  };

  return (
    <View style={[styles.swapBox, { backgroundColor: cardBackgroundColor, borderColor }]}>
      <Text style={[styles.label, { color: labelColor }]}>{title}</Text>

      {/* Asset Selection */}
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.assetBox, { borderColor, backgroundColor: inputBackgroundColor }]}
          onPress={onPressAsset}
        >
          <Image source={assetImage} style={styles.assetImage} />
          <View style={styles.assetTextContainer}>
            <Text style={[styles.assetSubText, { color: labelColor }]}>Asset</Text>
            <Text style={[styles.assetText, { color: textColor }]}>{asset}</Text>
          </View>
          {title === 'You Send' && <Image source={arrow} style={styles.arrowIcon} />}
        </TouchableOpacity>

        {/* ✅ Input for "You Send" (Editable only if asset is selected) */}
        {title === "You Send" ? (
  <View style={[styles.amountBox, { borderColor, backgroundColor: inputBackgroundColor }]}>
    <TouchableOpacity
      activeOpacity={1}
      style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
      onPress={() => {
        if (asset !== "Select Asset") {
          inputRef.current?.focus();
        }
      }}
    >
      <Text style={[styles.amountCurrency, { color: labelColor }]}>{asset}</Text>
      <TextInput
        ref={inputRef}
        style={[styles.amountText, { color: textColor, textAlign: 'right', flex: 1 }]}
        placeholderTextColor={labelColor}
        keyboardType="numeric"
        value={enteredAmount}
        onChangeText={handleAmountChange}
        editable={asset !== "Select Asset"}
      />
    </TouchableOpacity>
  </View>
) : (
  <View style={[styles.amountBox, { borderColor, backgroundColor: inputBackgroundColor }]}>
    <Text style={[styles.amountCurrency, { color: labelColor }]}>{asset}</Text>
    <Text style={[styles.amountText, { color: textColor }]}>{amount}</Text>
  </View>
)}

      </View>

      {/* Network Selection & Converted Amount */}
      {network && (
        <View style={styles.row}>
          <TouchableOpacity style={[styles.assetBox, { borderColor, backgroundColor: inputBackgroundColor }]} onPress={onPressNetwork}>
            <Image source={networkImage} style={styles.assetImage} />
            <View style={styles.assetTextContainer}>
              <Text style={[styles.assetSubText, { color: labelColor }]}>Network</Text>
              <Text style={[styles.assetText, { color: textColor }]}>{network}</Text>
            </View>
            <Image source={arrow} style={styles.arrowIcon} />
          </TouchableOpacity>

          {/* ✅ Converted Amount Updates Dynamically */}
          <View style={[styles.amountBox, { borderColor, backgroundColor: inputBackgroundColor }]}>
            <Text style={[styles.amountCurrency, { color: labelColor }]}>USD</Text>
            <Text style={[styles.amountText, { color: textColor }]}>{convertedAmount}</Text>
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
    borderRadius: 50, // Rounded corners
    paddingVertical: 10,
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
    width: 42,
    height: 42,
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
    borderRadius: 20,
    paddingVertical: 14,
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
