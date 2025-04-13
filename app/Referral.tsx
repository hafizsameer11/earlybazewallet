import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Image, Clipboard } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '@/components/Header';
import ReferralStats from '@/components/Setting/Referral/ReferralStats';
import ReferralCodeBox from '@/components/Setting/Referral/ReferralCodeBox';
import ReferralListItem from '@/components/Setting/Referral/ReferralListItem';
import { images } from '@/constants';
import { useRouter } from 'expo-router';

// Integration
import { getReferral } from '@/utils/queries/appQueries';
import { useQuery } from '@tanstack/react-query';
import { getFromStorage } from '@/utils/storage';
import ReferralStatsModal from '@/components/Setting/Referral/ReferralStatsModal';

const Referral: React.FC = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const backgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#000000' }, 'background');
  const titleText = useThemeColor({ light: '#0B3558', dark: '#25AE7A' }, 'text');
  const textColor = useThemeColor({ light: '#222222', dark: '#FFFFFF' }, 'text');
  const [showStatsModal, setShowStatsModal] = useState(false);

  // Fetch token
  useEffect(() => {
    const fetchUserData = async () => {
      const fetchedToken = await getFromStorage("authToken");
      setToken(fetchedToken);
      console.log("🔹 Retrieved Token:", fetchedToken);
    };
    fetchUserData();
  }, []);

  // Fetch referrals using React Query (Fixed Signature for v5)
  const { data: referrals, error: referralsError, isLoading: referralsLoading } = useQuery({
    queryKey: ["referrals", token], // Ensure token is part of the query key to refetch when it changes
    queryFn: () => (token ? getReferral({ token }) : Promise.reject("No token available")), // Ensure token is not undefined
    enabled: !!token, // Run query only when token exists
  });


  console.log("🔹 Referrals Data:", referrals);

  // Process API response
  const referralList = referrals?.data?.earning?.map((referral: any) => ({
    name: referral.name,
    amount: referral.amount.toString(),
    date: new Date(referral.created_at).toLocaleDateString(),
    imageUrl: referral.image
      ? `https://earlybaze.hmstech.xyz/storage/${referral.image}`
      : images.defaultAvatar, // Fallback if image is missing
  })) || [];

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Gradient Background */}
      <LinearGradient colors={['#25AE7A', '#0E5A98']} style={styles.gradientBackground}>
        <View>
          <Header />
          <TouchableOpacity style={styles.withdrawButton} onPress={() => router.push('/Withdraw')}>
            <Text style={styles.withdrawText}>Withdraw</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Referral</Text>

          {/* Referral Stats */}
          <View style={{ marginHorizontal: 10 }}>
            <ReferralStats
              earnings={referrals?.data?.Earning?.naira?.toString() || "0"}
              referrals={referrals?.data?.totalRefferals || 0}
            />

            {/* Referral Code */}
            <ReferralCodeBox
              code={referrals?.data?.reffralCode || "No Code"}
              onCopy={() => Clipboard.setString(referrals?.data?.reffralCode || "")}
              onShare={() => console.log('Share referral')}
            />
          </View>
        </View>
      </LinearGradient>

      {showStatsModal && (
  <ReferralStatsModal
    totalEarnings={referrals?.data?.earning?.[0]?.totalEarning || "0"}
    totalWithdrawals={referrals?.data?.earning?.[0]?.totalWithdrawls || "0"}
    numberOfReferrals={referrals?.data?.earning?.[0]?.noOfReferrals || 0}
    totalTrades={referrals?.data?.earning?.[0]?.totalTradesCompletedByReferrals || "0"}
    onClose={() => setShowStatsModal(false)}
  />
)}



      {/* Referrals List */}
      <View style={[styles.section, { backgroundColor }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={[styles.sectionTitle, { color: titleText }]}>My Referrals</Text>
          <TouchableOpacity onPress={() => setShowStatsModal(true)}>
            <Text style={[styles.sectionText, { color: titleText }]}>View Stats</Text>
          </TouchableOpacity>
        </View>

        {/* Show Empty State if No Referrals */}
        {referralList.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Image source={images.empty} style={styles.emptyImage} />
            <Text style={[styles.emptyText, { color: textColor }]}>You have no referrals yet</Text>
          </View>
        ) : (
          referralList.map((referral, index) => <ReferralListItem key={index} {...referral} />)
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
    marginTop: 30,
  },
  gradientBackground: {
    paddingHorizontal: 6,
    paddingBottom: 20,
  },
  withdrawButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    alignSelf: 'flex-end',
    position: 'absolute',
    top: 25,
    width: 100,
    alignItems: 'center',
    right: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    marginLeft: 20,
  },
  withdrawText: {
    color: '#222222',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 13,
  },
  sectionText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  section: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  emptyText: {
    fontSize: 16,
    marginTop: 12,
  },
});

export default Referral;
