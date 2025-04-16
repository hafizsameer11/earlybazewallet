import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import useLoadFonts from '@/hooks/useLoadFonts'; // Import font loader

interface BuyHeadProps {
  buttonText: string; // Required Buy button text
  exchangeRate?: string; // Optional exchange rate text
  topLabel?: string; // Optional top label
}

const BuyHead: React.FC<BuyHeadProps> = ({ buttonText, exchangeRate, topLabel }) => {
  const fontsLoaded = useLoadFonts(); // Load custom fonts

  return (
    <View style={styles.container}>
      {/* Buy Button */}
      <TouchableOpacity style={styles.buyButton}>
        <Text style={[styles.buyText, {fontFamily: fontsLoaded ? 'Caprasimo-Regular' : undefined }]}>{buttonText}</Text>

        {/* Exchange Rate Label - Show only if passed via props */}
        {exchangeRate && (
          <View style={styles.exchangeRateContainer}>
            <Text style={styles.exchangeRateText}>{topLabel}</Text>
            <Text style={styles.exchangeRateValue}>{exchangeRate}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 21,
    marginTop: 10,
  },
  buyButton: {
    backgroundColor: '#25AE7A', // Updated green color
    paddingVertical: 25,
    paddingHorizontal: 30,
    borderRadius: 20, // Main card border radius
    height: 90, // Match frame height
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  buyText: {
    fontSize: 32,
    color: '#FFF',
    fontFamily: 'Caprasimo'

  },
  exchangeRateContainer: {
    position: 'absolute',
    top: -28, // Adjusted positioning
    right: 0, // Adjusted positioning
    backgroundColor: '#0C4A7E',
    width: 136, // Match small card width
    height: 57, // Match small card height
    borderTopLeftRadius: 20, // top-left radius
    borderTopRightRadius: 20, // top-right radius
    borderBottomRightRadius: 0, // bottom-right radius
    borderBottomLeftRadius: 15, // bottom-left radius
    paddingVertical: 8,
    paddingHorizontal: 14,
    justifyContent: 'center',
    // alignItems: 'center',
    shadowColor: '#0C4A7E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  exchangeRateText: {
    color: '#FFF',
    fontSize: 12,
  },
  exchangeRateValue: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 4,
  },
});

export default BuyHead;
