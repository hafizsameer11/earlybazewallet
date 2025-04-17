import React, { useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Alert, Text } from 'react-native';
import { ThemedText, } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/useThemeColor';
import { images } from '@/constants';
import { useRouter, router } from 'expo-router';
import useLoadFonts from '@/hooks/useLoadFonts';
import QrModal from '../Send/QrModal';

export type HeaderProps = {
  username: string | undefined;
  greeting: string;
};

export function Header({ username, greeting }: HeaderProps) {
  const fontsLoaded = useLoadFonts();
  const router = useRouter();
  const [isScannerOpen, setIsScannerOpen] = useState(false); // State to control modal visibility

  const backgroundColor = useThemeColor(
    { light: '#FFFFFF', dark: '#0D0D0D' },
    'background'
  );

  const titleColor = useThemeColor(
    { light: '#0B3558', dark: '#25AE7A' },
    'text'
  );

  const notification = useThemeColor({
    light: images.notification,
    dark: images.notification_black,
  }, 'notification');

  const scan = useThemeColor({
    light: images.scan,
    dark: images.scan_black
  }, 'scan');

  // Function to handle icon press
  const handleIconPress = (iconName: string) => {
    router.push('/Notification');
    console.log(`${iconName} icon clicked`);
  };

  return (
    <SafeAreaView>
      <ThemedView style={styles.headerContainer}>
        <View style={{ padding: 8 }}>
          <ThemedText
            style={[styles.title, { color: titleColor, fontFamily: fontsLoaded ? 'Caprasimo-Regular' : undefined }]}
            type="title"
          >
            {`Hi, ${username}`}
          </ThemedText>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ThemedText type="subtitle">

              {greeting}



            </ThemedText>
            <View style={{ paddingBottom: 1, }}>
              <Image source={images.hand} style={{ width: 30, height: 30, }} />
            </View>
          </View>
        </View>
        <View style={styles.iconsContainer}>
          {/* Scan Icon - Opens QR Modal */}
          <View style={[styles.iconContainer, { backgroundColor }]}>
            <TouchableOpacity onPress={() => setIsScannerOpen(true)}>
              <Image source={scan} style={styles.icon} />
            </TouchableOpacity>
          </View>
          {/* Notification Icon */}
          <View style={[styles.iconContainer, { backgroundColor }]}>
            <TouchableOpacity onPress={() => handleIconPress('Notification')}>
              <Image source={notification} style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>
      </ThemedView>

      {/* QR Scanner Modal */}
      <QrModal
        isVisible={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}

      />    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'backgroundColor',
  },
  iconContainer: {
    padding: 8,
    borderRadius: 20,
  },
  iconsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  icon: {
    width: 22,
    height: 22,
    borderRadius: 16,
  },
});

