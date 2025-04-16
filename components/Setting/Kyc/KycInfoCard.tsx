import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { images } from '@/constants';

interface KycInfoCardProps {
  status?: string;
}

const KycInfoCard: React.FC<KycInfoCardProps> = ({ status = 'Pending' }) => {
  const cardBackgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#1A1A1A' }, 'card');
  const textColor = useThemeColor({ light: '#222222', dark: '#FFFFFF' }, 'text');
  const titleColor = useThemeColor({ light: '#064E3B', dark: '#A7F3D0' }, 'title');

  return (
    <View style={[styles.container, { backgroundColor: cardBackgroundColor }]}>
      {/* Shield Icon */}
      <View style={styles.iconContainer}>
        <Image source={images.shield} style={styles.icon} />
      </View>

      {/* Title */}
      <Text style={[styles.title, { color: titleColor }]}>Complete Your KYC</Text>

      {/* Instructions */}
      <View style={styles.list}>
        {[
          'Make sure to write your name as it appears on ID',
          'Accepted Documents include: ',
          'Make sure documents uploaded are clear',
          'Review takes between 1-2 business days',
          `Status: ${status}`
        ].map((item, index) => (
          <View key={index} style={styles.listItemContainer}>
            <Image source={images.dots} style={styles.dotIcon} />
            <Text style={[styles.listItem, { color: textColor }]}>
              {index === 1 ? (
                <>
                  Accepted Documents include:{' '}
                  <Text style={styles.boldText}>
                    National ID Card, International Passport, Driver’s License, Voter’s Card
                  </Text>
                </>
              ) : (
                item
              )}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginVertical: 20,
    borderColor: '#25AE7A',
    borderWidth: 1,
    width: '95%',
    alignSelf: 'center',
  },
  iconContainer: {
    position: 'absolute',
    top: -26,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
 
  },
  icon: {
    width: 54,
    height: 54,
  },
  title: {
    fontSize: 26,
    marginVertical: 14,
    fontFamily: 'Caprasimo'


  },
  list: {
    alignSelf: 'flex-start',
    width: '100%',
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dotIcon: {
    width: 12,
    height: 12,
    marginRight: 8,
  },
  listItem: {
    fontSize: 14,
    flexShrink: 1,
  },
  boldText: {
    fontWeight: 'bold',
  },
});

export default KycInfoCard;
