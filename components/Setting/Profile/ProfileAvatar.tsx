import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { images } from '@/constants';

interface ProfileAvatarProps {
  avatarUri: string | null;              // Can be remote or local
  setAvatarUri: (uri: string) => void;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ avatarUri, setAvatarUri }) => {
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'You need to grant access to the media library.');
      return;
    }
    console.log("asd");
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri); // Will override remote image
    }
  };

  // Conditionally select image source
  const renderImageSource = () => {
    if (avatarUri && avatarUri !== '') {
      return { uri: avatarUri };
    }
    return images.profile;
  };

  return (
    <View style={styles.avatarContainer}>
      <LinearGradient colors={['#25AE7A', '#1E8753']} style={styles.gradientBackground}>
        <TouchableOpacity onPress={pickImage}>
          <Image source={renderImageSource()} style={styles.avatar} />
        </TouchableOpacity>
      </LinearGradient>

      <TouchableOpacity style={styles.editIcon} onPress={pickImage}>
        <Ionicons name="pencil" size={16} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 15,
    position: 'relative',
  },
  gradientBackground: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editIcon: {
    position: 'absolute',
    bottom: -8,
    right: '40%',
    backgroundColor: '#1E8753',
    borderRadius: 14,
    padding: 1,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProfileAvatar;
