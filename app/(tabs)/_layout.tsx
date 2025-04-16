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
  const tabIconColorActive = useThemeColor({ light: '#FFFFFF', dark: '#FFFFFF' },'background');
  const tabIconColorInactive = useThemeColor({ light: '#000000C0', dark: '#FFFFFF80' },'background');
  
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          height: 80,
          // fontSize: 2, // Height adjusted for the rounded effect
        },
        tabBarBackground: () => (
          <View style={[styles.tabBarBackground, { backgroundColor }]} />
        ),
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
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: focused ? activeColor : inactiveColor },
              ]}
            >
              <Image
                source={iconSource}
                style={[
                  styles.icon,
                  {tintColor: focused ? tabIconColorActive : tabIconColorInactive
                    ,
                     width: size, height: size },
                ]}
              />
            </View>
          );
        },
      })}
    >
     <Tabs.Screen
  name="index"
  options={{
    title: 'Home',
    tabBarLabel: ({ focused }) => (
      <Text style={{ fontSize: 9, color: focused ? '#FFFFFF' : tabIconColor }}>
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
      <Text style={{ fontSize: 9, color: focused ? '#FFFFFF' : tabIconColor }}>
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
      <Text style={{ fontSize: 9, color: focused ? '#FFFFFF' : tabIconColor }}>
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
      <Text style={{ fontSize: 9, color: focused ? '#FFFFFF' : tabIconColor }}>
        Settings
      </Text>
    ),
  }}
/>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarBackground: {
    position: 'absolute',
    bottom: 30,
    width: '94.5%', // Responsive width
    height: 58,
    borderRadius: 50,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: 'rgba(179, 179, 179, 0.25)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 0.3,
    paddingBottom : 0,
  },
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
    opacity:1
  },
});

// export default TabLayout;
