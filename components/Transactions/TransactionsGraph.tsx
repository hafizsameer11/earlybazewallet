import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';

const COLORS = {
  send: '#22A45D',
  buy: '#5D3FD3',
  withdraw: '#000000',
  receive: '#800000',
  swap: '#8A2BE2',
};

const BAR_WIDTH = 12;
const BAR_GAP = 8;
const BAR_GROUP_MARGIN = 12;
const maxHeight = 120; // max bar height

const TransactionsGraph = ({ graphicalData }: { graphicalData: any[] }) => {
  if (!graphicalData || graphicalData.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', padding: 16, color: '#888' }}>
          No transaction graph data available.
        </Text>
      </View>
    );
  }

  const maxTransactionValue = Math.max(
    ...graphicalData.map((data) =>
      Math.max(data.send, data.receive, data.buy, data.swap, data.withdrawTransaction)
    )
  );

  const getBarHeight = (value: number) =>
    maxTransactionValue === 0 ? 0 : (value / maxTransactionValue) * maxHeight;

  // Always show labels starting from 1, not 0
  const getYAxisLabels = (maxValue: number) => {
    if (maxValue <= 10) return Array.from({ length: maxValue }, (_, i) => maxValue - i);

    const approxLabelCount = 6; // desired number of labels
    const step = Math.ceil(maxValue / approxLabelCount);

    const labels = [];
    for (let i = maxValue; i >= 1; i -= step) {
      labels.push(i);
    }

    if (labels[labels.length - 1] !== 1) labels.push(1); // ensure 1 is included
    return labels;
  };

  const yAxisLabels = getYAxisLabels(maxTransactionValue);

  return (
    <View style={styles.container}>
      <ScrollView horizontal contentContainerStyle={styles.chartContainer} showsHorizontalScrollIndicator={false}>
        {/* Y-axis Labels */}
        <View style={styles.yAxis}>
          {yAxisLabels.map((value, idx) => (
            <Text key={idx} style={styles.yAxisLabel}>
              {value}
            </Text>
          ))}
        </View>

        {/* Bars */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ position: 'relative' }}>
            {/* Horizontal Lines */}
            <View style={styles.gridLines}>
              {yAxisLabels.map((_, index) => (
                <View key={index} style={styles.gridLine} />
              ))}
            </View>

            {/* Bars */}
            <View style={styles.barsWrapper}>
              {graphicalData.map((data, index) => (
                <View key={index} style={styles.barGroup}>
                  <View style={styles.barStack}>
                    <View style={[styles.bar, { height: getBarHeight(data.send), backgroundColor: COLORS.send }]} />
                    <View style={[styles.bar, { height: getBarHeight(data.receive), backgroundColor: COLORS.receive }]} />
                    <View style={[styles.bar, { height: getBarHeight(data.buy), backgroundColor: COLORS.buy }]} />
                    <View style={[styles.bar, { height: getBarHeight(data.swap), backgroundColor: COLORS.swap }]} />
                    <View style={[styles.bar, { height: getBarHeight(data.withdrawTransaction), backgroundColor: COLORS.withdraw }]} />
                  </View>
                  <Text style={styles.label}>{data.month}</Text>
                </View>
              ))}
            </View>
          </View>

        </ScrollView>
      </ScrollView>

      {/* Legend */}
      <View style={styles.legendContainer}>
        <Legend color={COLORS.send} label="Send Transactions" />
        <Legend color={COLORS.buy} label="Buy Transactions" />
        <Legend color={COLORS.withdraw} label="Withdrawals" />
        <Legend color={COLORS.receive} label="Receive Transactions" />
        <Legend color={COLORS.swap} label="Swap Transactions" />
      </View>
    </View>
  );
};

const Legend = ({ color, label }: { color: string; label: string }) => (
  <View style={styles.legendRow}>
    <View style={[styles.legendDot, { backgroundColor: color }]} />
    <Text style={styles.legendText}>{label}</Text>
  </View>
);

export default TransactionsGraph;

const styles = StyleSheet.create({
  container: {
    borderColor: '#22A45D',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    margin: 16,
    backgroundColor: '#fff',
  },
  chartContainer: {
    flexDirection: 'row',
  },
  yAxis: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 8,
    height: maxHeight,
  },
  yAxisLabel: {
    fontSize: 10,
    color: '#555',
  },
  barsWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: 12,
  },
  barGroup: {
    alignItems: 'center',
    marginHorizontal: BAR_GROUP_MARGIN,
  },
  barStack: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: BAR_GAP,
    marginBottom: 4,
  },
  bar: {
    width: BAR_WIDTH,
    borderRadius: 4,
  },
  label: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    justifyContent: 'space-evenly',
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 4,
  },
  legendText: {
    fontSize: 11,
  },
  gridLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: maxHeight,
    justifyContent: 'space-between',
    zIndex: -1,
  },
  gridLine: {
    height: 1,
    backgroundColor: '#ddd',
    width: '100%',
  },

});
