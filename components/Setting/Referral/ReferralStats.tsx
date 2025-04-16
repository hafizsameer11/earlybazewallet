import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ReferralStatsProps {
  earnings: string;
  referrals: number;
}

const ReferralStats: React.FC<ReferralStatsProps> = ({ earnings, referrals }) => {
  return (
    <View >
      <View style={styles.container}>
        <View style={styles.statBox}>
          <Text style={styles.label}>Earnings</Text>
          <View style={styles.earningsRow}>
            <Text style={styles.currencySymbol}>$</Text>
            <Text style={styles.amount}>
              {Number(earnings).toLocaleString()}
            </Text>          </View>

        </View>

        <View style={styles.divider} />

        <View style={styles.statBox}>
          <Text style={styles.label}>No of Referrals</Text>
          <Text style={styles.amount}>{referrals}</Text>
        </View>
      </View>
      <Text style={styles.description}>
        For every person you refer and completes their KYC, you earn a certain commission from their trades.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)', // Transparent border effect
    backgroundColor: 'transparent', // Keep transparent for gradient background
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 16,
    fontWeight: '500',
    marginLeft: 10,
  },
  earningsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 2,
  },
  amount: {
    fontSize: 24,
    color: '#FFFFFF',
    marginLeft: 10,
    fontFamily: 'Caprasimo'


  },
  description: {
    fontSize: 12,
    color: '#D3D3D3',
    marginTop: 6,
    width: '100%',
  },
  divider: {
    width: 1,
    height: '60%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 16,
  },
});

export default ReferralStats;
