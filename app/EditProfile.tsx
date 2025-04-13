import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import Header from '@/components/Header';
import PrimaryButton from '@/components/Buy/PrimaryButton';
import ProfileAvatar from '@/components/Setting/Profile/ProfileAvatar';
import ProfileInputField from '@/components/Setting/Profile/ProfileInputField';

// Code related to the Integration:
import { useMutation, useQuery } from '@tanstack/react-query';
import { editProfile } from '@/utils/mutations/accountMutations';
import { getUserDetails } from '@/utils/queries/appQueries';
import { getFromStorage } from '@/utils/storage';
import Toast from "react-native-toast-message"; // ✅ Import Toast
import { router } from 'expo-router';
const EditProfile: React.FC = () => {
  const [token, setToken] = useState<string | null>(null); // State to hold the token
  const backgroundColor = useThemeColor({ light: '#EFFEF9', dark: '#000000' }, 'background');

  // Fetch the token when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      const fetchedToken = await getFromStorage("authToken");
      setToken(fetchedToken);
      console.log("🔹 Retrieved Token:", fetchedToken);
    };

    fetchUserData();
  }, []);

  // Fetch user details when the token is available
  const { data: userDetails, error: userError, isLoading: userLoading } = useQuery({
    queryKey: ["userDetails"],
    queryFn: () => getUserDetails({ token }),
    enabled: !!token, // Only run the query when the token is available
  });

  console.log("🔹 User Details:", userDetails);

  // Extract data from API response
  const userData = userDetails?.data || {};
  const [username, setUsername] = useState(userData.name || '');
  const [email] = useState(userData.email || ''); // Read-only
  const [phone, setPhone] = useState(userData.phone || '');
  const [password, setPassword] = useState('**********');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  
  const baseURL = "https://earlybaze.hmstech.xyz/storage/";

  // Update state when userDetails changes
  useEffect(() => {
    if (userDetails?.data) {
      setUsername(userDetails.data.name);
      setPhone(userDetails.data.phone);
  
      // ✅ Set full URL if `profile_picture` exists
      const baseURL = "https://earlybaze.hmstech.xyz/storage/";
      if (userDetails.data.profile_picture) {
        setAvatarUri(`${baseURL}${userDetails.data.profile_picture}`);
      }
    }
  }, [userDetails]);

  console.log("🔹 User Detailssss:", userDetails);
  console.log("👤 Full Avatar URL Set:", `${baseURL}${userDetails?.data.profile_picture}`);


  // Mutation for editing profile
  const { mutate: editProfileMutation, isPending } = useMutation({
    mutationFn: ({ data, token }: { data: { name: string; phone: string }; token: string }) =>
      editProfile({ data, token }),

    onSuccess: (response: any) => {
      console.log("✅ Profile Updated:", response);

      // ✅ Show success toast for 1.5 seconds
      Toast.show({
        type: "success",
        text1: "Edit Profile Successful 🎉",
        visibilityTime: 1500, // 1.5 seconds
      });

      // ✅ Navigate back after 1.5 seconds
      setTimeout(() => {
        router.back(); // Navigates back in the stack
      }, 1500);
    },

    onError: (error: any) => {
      console.error('❌ Error updating profile:', error);

      Toast.show({
        type: "error",
        text1: "Edit Profile Failed ❌",
        text2: error.message || "Please try again.",
        visibilityTime: 3000, // 3 seconds
      });

    },
  });

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <Header title="Edit Profile" />

      {/* Avatar */}
      <ProfileAvatar avatarUri={avatarUri} setAvatarUri={setAvatarUri} />

      {/* Profile Fields */}
      <ProfileInputField label="Username" value={username} onChangeText={setUsername} />
      <ProfileInputField label="Email" value={email} isEditable={false} />
      <ProfileInputField label="Phone" value={phone} onChangeText={setPhone} />
      <ProfileInputField
        label="Password"
        value={password}
        isEditable={false}
        showChangeButton
        onChangePress={() => console.log('Change Password')}
      />

      {/* Save Button */}
      <View style={styles.buttonContainer}>
        <PrimaryButton
          title={isPending ? "Saving..." : "Save"} // Change button text dynamically
          onPress={() => {
            if (token) {
              const formData = new FormData();
          
              formData.append('name', username);
              formData.append('phone', phone);
          
              if (avatarUri) {
                const fileName = avatarUri.split('/').pop();
                const fileType = fileName?.split('.').pop();
          
                formData.append('profile_picture', {
                  uri: avatarUri,
                  name: fileName,
                  type: `image/${fileType}`,
                } as any); // `as any` required due to RN's FormData limitation
              }
          
              editProfileMutation({ data: formData, token });
            }
          }}
          
          disabled={isPending} // Disable button when saving
        />
      </View>
      <Toast /> {/* ✅ Add Toast Component to Render */}

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
    marginTop: 20,
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignSelf: 'center',
  },
});

export default EditProfile;
