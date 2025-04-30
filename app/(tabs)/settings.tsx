import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, SafeAreaView } from 'react-native';
import ProfileHeader from '@/components/Setting/ProfileHeader';
import SettingsList from '@/components/Setting/SettingsList';
import OtherSettings from '@/components/Setting/OtherSettings';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useRouter, router } from 'expo-router';
import { images } from '@/constants';

//Code related to the integraion:
import { useQuery } from '@tanstack/react-query';
import { getFromStorage } from "@/utils/storage";
import { getUserDetails } from "@/utils/queries/appQueries";

import { getUserBalance } from "@/utils/queries/appQueries";

const SettingsScreen: React.FC = () => {
  const [token, setToken] = useState<string | null>(null); // State to hold the token

  const [isDarkMode, setIsDarkMode] = useState(false);
  const backgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#000000' }, 'background');

  const handleThemeToggle = (theme: 'Light' | 'Dark') => {
    setIsDarkMode(theme === 'Dark');
  };
  // Fetch the token and user data when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      const fetchedToken = await getFromStorage("authToken");
      setToken(fetchedToken);
      console.log("🔹 Retrieved Token:", fetchedToken);
    };

    fetchUserData();
  }, []);

  const { data: userDetails, error: userError, isLoading: userLoading } = useQuery(
    {
      queryKey: ["userDetails"],
      queryFn: () => getUserDetails({ token }),
      enabled: !!token, // Only run the query when the token is available
    }
  );

  console.log("🔹 User Details Setting Page:", userDetails);


  // Fetch user balance using `useQuery`
  const { data: userBalance, error: userBalanceError, isLoading: userBalanceLoading, } = useQuery({
    queryKey: ['userBalance'],
    queryFn: () => getUserBalance({ token }), // Replace with actual API function
    enabled: !!token, // Only run the query when the token is available
  });
console.log("🔹 User Balance:", userBalance?.data);
  return (
    <SafeAreaView style={styles.container} >
      <ScrollView>
        <ProfileHeader
          name={userDetails?.data.name}
          email={userDetails?.data.email}
          cryptoBalance={userBalance?.data?.userBalance?.crypto_balance}
          nairaBalance={userBalance?.data?.userBalance?.naira_balance}
          profileImage={
            userDetails?.data.profile_picture
              ? `https://earlybaze.hmstech.xyz/storage/${userDetails.data.profile_picture}`
              : undefined
          }
          kycStatus={userDetails?.data.kyc_status}
        />

        {/* Settings Grid */}
        <View style={[styles.gridContainer, { backgroundColor }]}>
          <SettingsList
            options={[
              { title: 'Edit Profile', image: images.edit_profile, onPress: () => { router.push('/EditProfile') } },
              { title: 'Account', image: images.account, onPress: () => { router.push('/Account') } },
              { title: 'Referral', image: images.referral, onPress: () => { router.push('/Referral') } },
              { title: 'KYC', image: images.kyc, onPress: () => { router.push('/Kyc') } },
              { title: 'Support', image: images.support, onPress: () => { router.push('/Support') } },
              { title: 'Security', image: images.security, onPress: () => { router.push('/Security') } },
            ]}
          />
        </View>

        <OtherSettings isDarkMode={isDarkMode} onToggleTheme={handleThemeToggle} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 20,
    marginTop: 10,
  },
});

export default SettingsScreen;
