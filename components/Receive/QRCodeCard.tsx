import React, { useEffect, useState } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, ToastAndroid, Platform, Alert } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import { images } from '@/constants';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Asset } from 'expo-asset';
import * as Share from 'expo-sharing';

import * as Clipboard from 'expo-clipboard';
// import { ToastAndroid } from 'react-native'; // optional for feedback (Android only)

//Code related to the integration:
import { getFromStorage } from "@/utils/storage";
import { getReceiveAddress } from "@/utils/queries/appQueries";
import { useQuery } from '@tanstack/react-query';

interface QRCodeCardProps {
    cardBackgroundColor: string;
    selectedTab: 'Crypto Address' | 'Email Address';
    selectedNetworkName: string;
    selectedCoinName: string;
}

const QRCodeCard: React.FC<QRCodeCardProps> = ({ cardBackgroundColor, selectedTab, selectedNetworkName, selectedCoinName }) => {
    const [email, setEmail] = useState<string | null>(null); // State to hold the token
    const [token, setToken] = useState<string | null>(null);
    const cryptoAddress = "0xednfvdnkdwj43rnggnfner43itjfkmfltr...";
    const randomEmails = [
        "example1@email.com",
        "user.test@mail.com",
        "crypto.receiver@domain.com",
        "sampleaddress@wallet.com",
    ];
    const randomEmail = randomEmails[Math.floor(Math.random() * randomEmails.length)];
    const save = useThemeColor({ light: images.save_white, dark: images.save_black }, 'save');
    const share = useThemeColor({ light: images.share_white, dark: images.share_black }, 'share');
    const iconBackground = useThemeColor({ light: '#E9E9E9', dark: '#000000' }, 'iconBackground');

    // Fetch the token and user data when the component mounts
    useEffect(() => {
        const fetchUserData = async () => {
            const user = await getFromStorage("user");
            const fetchedToken = await getFromStorage("authToken");
            setToken(fetchedToken);

            const fetchedEmail = user.email;
            setEmail(fetchedEmail);
            console.log("🔹 Retrieved Email:", fetchedEmail);
        };

        fetchUserData();
    }, []);


    const { data: receiveAddress, error: receiveAddressError, isLoading: receiveAddressLoading } = useQuery(
        {
            queryKey: ["receiveAddress", selectedCoinName, selectedNetworkName], // Include coin and network in queryKey
            queryFn: () => getReceiveAddress(token as string, selectedCoinName, selectedNetworkName), // Pass both parameters
            enabled: !!token && !!selectedCoinName && !!selectedNetworkName, // Ensure both are defined
        }
    );
    const handleSaveImage = async () => {
        try {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Required', 'Please grant storage permissions to save the image.');
                return;
            }

            // ✅ Resolve the asset URI from static image
            const asset = Asset.fromModule(images.qrcode);
            await asset.downloadAsync(); // Ensure it's downloaded

            // ✅ Use the local URI from the asset
            const localUri = asset.localUri;

            if (!localUri) {
                throw new Error("Unable to resolve local URI for the image.");
            }

            // ✅ Save to gallery
            const mediaAsset = await MediaLibrary.createAssetAsync(localUri);
            await MediaLibrary.createAlbumAsync('QR Codes', mediaAsset, false);

            if (Platform.OS === 'android') {
                ToastAndroid.show('The image has been saved to your gallery', ToastAndroid.SHORT);
            } else {
                Alert.alert('Saved', 'The image has been saved to your gallery');
            }
        } catch (error) {
            console.error('Error saving image:', error);
            Alert.alert('Error', 'Failed to save image. Please try again.');
        }
    };

    const handleShareImage = async () => {
        try {
            const asset = Asset.fromModule(images.qrcode);
            await asset.downloadAsync(); // Ensure it's available
            const localUri = asset.localUri;

            if (!localUri) {
                Alert.alert("Error", "Could not load image to share.");
                return;
            }

            const isAvailable = await Share.isAvailableAsync();
            if (!isAvailable) {
                Alert.alert('Sharing not available on this device');
                return;
            }

            await Share.shareAsync(localUri, {
                dialogTitle: 'Share your QR Code',
                mimeType: 'image/png', // or image/jpeg depending on format
            });
        } catch (error) {
            console.error('Error sharing image:', error);
            Alert.alert('Error', 'Could not share image.');
        }
    };



    return (
        <View style={[styles.qrContainer, { backgroundColor: cardBackgroundColor }]}>
            <Image
                source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?data=${selectedTab === 'Crypto Address' ? receiveAddress?.data?.address : email}&size=200x200` }}
                style={styles.qrCode}
            />            <View style={styles.iconRow}>
                <TouchableOpacity style={styles.iconButton} onPress={handleSaveImage}>
                    <View style={[styles.iconBackground, { backgroundColor: iconBackground }]}>
                        <Image source={save} />
                    </View>
                    <Text style={styles.iconText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={handleShareImage}>
                    <View style={[styles.iconBackground, { backgroundColor: iconBackground }]}>
                        <Image source={share} />
                    </View>
                    <Text style={styles.iconText}>Share</Text>
                </TouchableOpacity>
            </View>

            <View style={[styles.inputContainer, { backgroundColor: selectedTab === 'Crypto Address' ? '#25AE7A' : '#25AE7A' }]}>
                <Text style={styles.cryptoAddress}>
                    {selectedTab === 'Crypto Address' ? receiveAddress?.data?.address || "Please Select the Network..." : email}
                </Text>
                <TouchableOpacity
                    onPress={() => {
                        const textToCopy = selectedTab === 'Crypto Address' ? receiveAddress?.data?.address : email;
                        if (textToCopy) {
                            Clipboard.setStringAsync(textToCopy);
                            ToastAndroid.show("Copied to clipboard", ToastAndroid.SHORT); // optional
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
