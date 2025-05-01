import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { images } from '@/constants'; // Ensure this contains valid image paths or requires
import { ThemedText } from './ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import useLoadFonts from '@/hooks/useLoadFonts'; // Import font loader

import { router } from 'expo-router';

interface HeaderProps {
  title?: string;
  onBackPress?: () => void;
  onFilterPress?: () => void;
  from?: string; // ✅ optional param
}

const Header: React.FC<HeaderProps> = ({ title, onBackPress, onFilterPress, from }) => {
  // Using useThemeColor to dynamically pick the background color
  const backgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#0D0D0D' }, 'background');
  const fontsLoaded = useLoadFonts(); // Load custom fonts

  // Now using useThemeColor to decide which back icon to show based on the theme
  const backIcon = useThemeColor({
    light: images.back_icon_white,
    dark: images.back_icon_black
  }, 'backIcon');

  const filterIcon = useThemeColor({
    light: images.filter_icon,
    dark: images.filter_icon_black
  }, 'filterIcon');

  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      {/* Back Button */}
      <TouchableOpacity
        style={[styles.iconButton, { backgroundColor }]}
        onPress={
          onBackPress
            ? onBackPress
            : from === 'summary'
              ? () =>
                router.push('/(tabs)')
              : () => navigation.goBack()
        }
      >
        <Image source={backIcon} style={styles.icon} />
      </TouchableOpacity>


      {/* Show Title if passed */}
      {title && <ThemedText style={[styles.headerTitle, { fontFamily: fontsLoaded ? 'Caprasimo-Regular' : undefined }]}>{title}</ThemedText>}

      {/* Show Filter Button only if onFilterPress exists */}
      {title && onFilterPress && (
        <TouchableOpacity style={[styles.iconButton, { backgroundColor }]} onPress={onFilterPress}>
          <Image source={filterIcon} style={styles.icon} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1, // Ensures proper alignment of title
    textAlign: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  icon: {
    height: 20,
    resizeMode: 'contain',
  },
});

export default Header;
