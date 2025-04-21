import React, { useEffect, useState } from 'react';
import { router, useNavigationContainerRef } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { ActivityIndicator, View } from 'react-native';

const Index = () => {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      const seen = await SecureStore.getItemAsync('onboardingViewed');

      if (seen) {
        router.replace('/login'); // ⬅️ Replaces after layout is mounted
      } else {
        router.replace('/onboarding'); // ⬅️ Replaces after layout is mounted
      }

      setChecking(false);
    }, 0); // ⬅️ ensures navigation happens after mount

    return () => clearTimeout(timeout); // cleanup
  }, []);

  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#25AE7A" />
      </View>
    );
  }

  return null;
};

export default Index;
