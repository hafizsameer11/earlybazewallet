import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet, GestureResponderEvent } from 'react-native';
import { useRouter } from 'expo-router';
import images from '../../constants/images';

// Define the interface for ServiceButton props
interface ServiceButtonProps {
  icon: string;
  label: string;
  onPress: (event: GestureResponderEvent) => void;
}

const ServiceButton: React.FC<ServiceButtonProps> = ({ icon, label, onPress }) => {
  return (
    <TouchableOpacity style={styles.serviceButton} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Image source={icon} style={styles.iconImage} />
      </View>
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
};

const ServiceOptions: React.FC = () => {
  const router = useRouter(); // expo-router navigation

  return (
    <View style={styles.container}>
      <Image source={images.indexService} style={styles.backgroundImage} />

      <View style={styles.overlay}>
        <ServiceButton
          icon={images.cil_send}
          label="Send"
          onPress={() => {
            console.log('Navigating to SendReceive with type:', { type: 'send' });
            router.push({ pathname: '/SendReceive', params: { type: 'send' } });
          }}
        />
        <View style={styles.divider} />
        <ServiceButton
          icon={images.cil_receive}
          label="Receive"
          onPress={() => {
            console.log('Navigating to SendReceive with type:', { type: 'receive' });
            router.push({ pathname: '/SendReceive', params: { type: 'receive' } });
          }}
        />

        <View style={styles.divider} />
        <ServiceButton
          icon={images.buy_index}
          label="Buy"
          onPress={() => router.push('/Buy')}
        />
        <View style={styles.divider} />
        <ServiceButton
          icon={images.swap_indexpng}
          label="Swap"
          onPress={() => router.push('/Swap')}
        />
      </View>
    </View>
  );
};

export default ServiceOptions;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 0,
  },
  iconImage: {
    width: 20,
    height: 20,
  },
  backgroundImage: {
    width: '90%',
    height: 100,
    resizeMode: 'stretch',
  },
  overlay: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '90%',
    height: 80,
  },
  serviceButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconContainer: {
    backgroundColor: '#fff',
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  text: {
    fontSize: 12,
    color: '#fff',
    fontFamily: 'Caprasimo'
  },
  divider: {
    width: 1,
    height: '60%',
    backgroundColor: '#fff',
  },
});
