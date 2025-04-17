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
        <Text style={[styles.buyText, { fontFamily: fontsLoaded ? 'Caprasimo-Regular' : undefined }]}>{buttonText}</Text>

        {/* Exchange Rate Label - Show only if passed via props */}
        {exchangeRate && (
          <View style={styles.glowWrapper}>
            <View style={styles.exchangeRateContainer}>
              <Text style={styles.exchangeRateText}>{topLabel}</Text>
              <Text style={styles.exchangeRateValue}>{exchangeRate}</Text>
            </View>
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
    top: -28,
    right: 0,
    backgroundColor: '#0C4A7E',
    width: 136,
    height: 57,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 14,
    justifyContent: 'center',
    shadowColor: '#0C4A7E',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  glowWrapper: {
    position: 'absolute',
    top: -0,
    right: 0,
    shadowColor: '#0C4A7E',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20, // ensures Android renders it
    borderRadius: 20,
  },
  
  exchangeRateText: {
    color: '#FFF',
    fontSize: 12,
  },
  exchangeRateValue: {
    color: '#FFF',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'Caprasimo',
  },
});

export default BuyHead;
