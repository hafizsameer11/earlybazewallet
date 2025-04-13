import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import PrimaryButton from '@/components/Buy/PrimaryButton';
import Header from '@/components/Header';
import KycInfoCard from '@/components/Setting/Kyc/KycInfoCard';
import { useRouter, router } from 'expo-router';

// Code related to the integration:
import { getKycStatus } from "@/utils/queries/accountQueries";
import { useQuery } from '@tanstack/react-query';
import { getFromStorage } from "@/utils/storage";

const Kyc: React.FC = () => {
  const backgroundColor = useThemeColor({ light: '#EFFEF9', dark: '#000000' }, 'background');
  const [token, setToken] = useState<string | null>(null); // State to hold the token
  const [kycStatus, setKycStatus] = useState<'Pending' | 'Failed' | 'Approved' | undefined>('Pending');

  useEffect(() => {
    const fetchUserData = async () => {
      const fetchedToken = await getFromStorage("authToken");
      setToken(fetchedToken);
      console.log("🔹 Retrieved Token:", fetchedToken);
    };

    fetchUserData();
  }, []);

  const { data: kycData, error: kycError, isLoading: kycLoading } = useQuery(
    {
      queryKey: ["kycStatus"],
      queryFn: () => getKycStatus(token),
      enabled: !!token,
    }
  );

  // Check if KYC data is available, and update the state
  useEffect(() => {
    if (kycData?.data?.status) {
      const status = kycData.data.status;
      console.log("KYC Status from API:", status); // Debugging

      // Ensure status is one of the allowed values
      if (['Pending', 'Failed', 'Approved'].includes(status)) {
        console.log("changings status", status);
        setKycStatus(status);
      } else {
        // Fallback to 'Pending' if status is not recognized
        setKycStatus('Pending');
      }
    }
  }, [kycData]); // Dependency on kycData ensures this only runs when kycData is updated

  console.log("🔹 KYC Data:", kycData);

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <Header title="KYC Verification" />

      {/* KYC Instructions */}
      <KycInfoCard status={kycStatus} />

      {/* Proceed Button */}
      <View style={styles.buttonContainer}>
        <PrimaryButton
          title="Proceed"
          onPress={() => router.push('/KycDetail')}
          disabled={kycStatus === 'Approved' } // Disable button if KYC is approved
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 20,
  },
  buttonContainer: {
    paddingHorizontal: 6,
    marginTop: 20,
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignSelf: 'center',
  },
});

export default Kyc;
