import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
  Platform,
  Alert
} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import { images } from '@/constants';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Asset } from 'expo-asset';
import * as Share from 'expo-sharing';
import * as Clipboard from 'expo-clipboard';

import { getFromStorage } from "@/utils/storage";
import { getReceiveAddress } from "@/utils/queries/appQueries";
import { useQuery } from '@tanstack/react-query';

interface QRCodeCardProps {
  cardBackgroundColor: string;
  selectedTab: 'Crypto Address' | 'Email Address';
  selectedNetworkName: string;
  selectedCoinName: string;
}

const QRCodeCard: React.FC<QRCodeCardProps> = ({
  cardBackgroundColor,
  selectedTab,
  selectedNetworkName,
  selectedCoinName
}) => {
  const [email, setEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const save = useThemeColor({ light: images.save_white, dark: images.save_black }, 'save');
  const share = useThemeColor({ light: images.share_white, dark: images.share_black }, 'share');
  const iconBackground = useThemeColor({ light: '#E9E9E9', dark: '#000000' }, 'iconBackground');

  useEffect(() => {
    const fetchUserData = async () => {
      const user = await getFromStorage("user");
      const fetchedToken = await getFromStorage("authToken");
      setToken(fetchedToken);
      setEmail(user?.email || null);
    };
    fetchUserData();
  }, []);

  const { data: receiveAddress } = useQuery({
    queryKey: ["receiveAddress", selectedCoinName, selectedNetworkName],
    queryFn: () => getReceiveAddress(token as string, selectedCoinName, selectedNetworkName),
    enabled: !!token && !!selectedCoinName && !!selectedNetworkName,
  });

  const handleSaveImage = async () => {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant storage permissions to save the image.');
      return;
    }

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${selectedTab === 'Crypto Address'
      ? receiveAddress?.data?.address
      : email}&size=200x200`;

    const fileUri = FileSystem.cacheDirectory + 'qr_code.png';
    const downloadRes = await FileSystem.downloadAsync(qrUrl, fileUri);

    const asset = await MediaLibrary.createAssetAsync(downloadRes.uri);
    await MediaLibrary.createAlbumAsync('QR Codes', asset, false);

    Platform.OS === 'android'
      ? ToastAndroid.show('Saved to gallery', ToastAndroid.SHORT)
      : Alert.alert('Saved', 'Image has been saved.');
  } catch (err) {
    console.error('Save error:', err);
    Alert.alert('Error', 'Failed to save image.');
  }
};


  const handleShareImage = async () => {
  try {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${selectedTab === 'Crypto Address'
      ? receiveAddress?.data?.address
      : email}&size=200x200`;

    const fileUri = FileSystem.cacheDirectory + 'qr_code_share.png';
    const downloadRes = await FileSystem.downloadAsync(qrUrl, fileUri);

    const isAvailable = await Share.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert('Sharing not available');
      return;
    }

    await Share.shareAsync(downloadRes.uri, {
      dialogTitle: 'Share your QR Code',
      mimeType: 'image/png'
    });
  } catch (err) {
    console.error('Share error:', err);
    Alert.alert('Error', 'Failed to share image.');
  }
};


  return (
    <View style={[styles.qrContainer, { backgroundColor: cardBackgroundColor }]}>
      <Image
        source={{
          uri: `https://api.qrserver.com/v1/create-qr-code/?data=${selectedTab === 'Crypto Address'
            ? receiveAddress?.data?.address
            : email
            }&size=200x200`
        }}
        style={styles.qrCode}
      />
      <View style={styles.iconRow}>
        <TouchableOpacity style={styles.iconButton} onPress={handleSaveImage}>
          <View style={[styles.iconBackground, { backgroundColor: iconBackground }]}>
            <Image source={save} /> {/* Fixed closing tag */}
          </View>
          <Text style={styles.iconText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={handleShareImage}>
          <View style={[styles.iconBackground, { backgroundColor: iconBackground }]}>
            <Image source={share} /> {/* Fixed closing tag */}
          </View>
          <Text style={styles.iconText}>Share</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.inputContainer, { backgroundColor: '#25AE7A' }]}>
        <Text style={styles.cryptoAddress}>
          {selectedTab === 'Crypto Address'
            ? receiveAddress?.data?.address || "Please Select the Network..."
            : email}
        </Text>
        <TouchableOpacity
          onPress={() => {
            const textToCopy = selectedTab === 'Crypto Address'
              ? receiveAddress?.data?.address
              : email;
            if (textToCopy) {
              Clipboard.setStringAsync(textToCopy);
              ToastAndroid.show("Copied to clipboard", ToastAndroid.SHORT);
            }
          }}
        >
          <Ionicons name="copy-outline" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
    qrContainer: {
        alignItems: 'center',
        paddingVertical: 20,
        borderRadius: 10,
        marginBottom: 10,
        marginHorizontal: 16,
    },
    qrCode: {
        width: 150,
        height: 150,
        marginBottom: 15,
    },
    iconRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 30,
        marginBottom: 10,
    },
    iconButton: {
        alignItems: 'center',
    },
    iconBackground: {
        width: 50,
        height: 50,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconText: {
        fontSize: 10,
        color: '#000000B2',
        marginTop: 5,
        fontWeight: '500',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 10,
        justifyContent: 'space-between',
        marginTop: 20,
        marginHorizontal: 10,
    },
    cryptoAddress: {
        color: 'white',
        fontSize: 12,
        flex: 1,
    },
});

export default QRCodeCard;
