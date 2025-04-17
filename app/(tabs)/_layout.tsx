import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Image, View, StyleSheet, Text } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useColorScheme } from '@/hooks/useColorScheme';
import icons from '@/constants/icons'; // Import icons
import useLoadFonts from '@/hooks/useLoadFonts'; // Import your font loader

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const fontsLoaded = useLoadFonts();
  console.log('Color Scheme:', colorScheme);

  const unfocusedTintColor = colorScheme === 'dark' ? '#FFFFFF80' : '#000000C0';

  const backgroundColor = useThemeColor({ light: '#F6FBFF', dark: '#202020' }, 'background');
  const activeColor = useThemeColor({ light: '#25AE7A', dark: '#25AE7A' }, 'primary'); // Green for active tab
  const inactiveColor = useThemeColor({ light: '#E5FFF5', dark: '#303030' }, 'secondary'); // Light green for inactive tab
  const tabIconColor = useThemeColor({ light: '#000000C0', dark: '#C7C7C7' }, 'text');
  const tabIconColorActive = useThemeColor({ light: '#FFFFFF', dark: '#FFFFFF' }, 'background');
  const tabIconColorInactive = useThemeColor({ light: '#000000C0', dark: '#FFFFFF80' }, 'background');

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: backgroundColor,
          height: 70,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
        },


        tabBarActiveTintColor: colorScheme === 'light' ? '#FFFFFF' : '#FFFFFF', // Selected tab text color
        tabBarInactiveTintColor: colorScheme === 'light' ? '#000000' : '#FFFFFF', // Unselected tab text color
        tabBarPressOpacity: 1, // Prevents opacity change on press
        tabBarPressColor: 'transparent', // Disables ripple effect on Android
        tabBarIcon: ({ size, focused }) => {
          let iconSource;

          if (route.name === 'index') {
            iconSource = icons.home;
          } else if (route.name === 'assets') {
            iconSource = icons.assests;
          } else if (route.name === 'transactions') {
            iconSource = icons.tnxs;
          } else if (route.name === 'settings') {
            iconSource = icons.settings;
          }

          return (
            <Image
              source={iconSource}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? activeColor : tabIconColorInactive,
                resizeMode: 'contain',
              }}
            />

          );
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: ({ focused }) => (
            <Text style={{ fontSize: 11, marginTop: 4, color: focused ? activeColor : tabIconColorInactive }}>
              Home
            </Text>
          ),
        }}
      />

      <Tabs.Screen
        name="assets"
        options={{
          title: 'Assets',
          tabBarLabel: ({ focused }) => (
            <Text style={{ fontSize: 11, marginTop: 4, color: focused ? activeColor : tabIconColorInactive }}>
              Assets
            </Text>
          ),
        }}
      />

      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Tnxs',
          tabBarLabel: ({ focused }) => (
            <Text style={{ fontSize: 11, marginTop: 4, color: focused ? activeColor : tabIconColorInactive }}>
              Tnxs
            </Text>
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarLabel: ({ focused }) => (
            <Text style={{ fontSize: 11, marginTop: 4, color: focused ? activeColor : tabIconColorInactive }}>
              Settings
            </Text>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({

  iconContainer: {
    width: 55,
    height: 55,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  icon: {
    width: 20,
    height: 20,
    marginBottom: 5,
    resizeMode: 'contain',
    opacity: 1
  },
});

// export default TabLayout;
