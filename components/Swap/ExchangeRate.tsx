import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface ExchangeRateProps {
  rate: string;
}

const ExchangeRate: React.FC<ExchangeRateProps> = ({ rate }) => {
  const backgroundColor = useThemeColor({ light: '#25AE7A', dark: '#25AE7A' }, 'background');
  const labelColor = useThemeColor({ light: '#FFFFFF', dark: '#DDDDDD' }, 'label');
  const rateColor = useThemeColor({ light: '#FFFFFF', dark: '#FFFFFF' }, 'text');

  return (
    <View style={[styles.exchangeRateBox, { backgroundColor }]}>
      <Text style={[styles.label, { color: labelColor }]}>Exchange Rate</Text>
      <Text style={[styles.rateText, { color: rateColor }]}>{rate}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  exchangeRateBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    fontFamily: 'Caprasimo'
  },
  rateText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ExchangeRate;
