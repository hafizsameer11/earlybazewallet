import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColor } from '@/hooks/useThemeColor';
import { images } from '@/constants';
import Header from '../Header';
import useLoadFonts from '@/hooks/useLoadFonts';
interface ProfileHeaderProps {
    name: string | undefined;
    email: string | undefined;
    cryptoBalance: number | undefined;
    nairaBalance: number | undefined;
    profileImage?: string | undefined;
    kycStatus?: string | undefined;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ name, email, cryptoBalance, nairaBalance, profileImage, kycStatus }) => {
    const cardBackgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#1A1A1A' }, 'card');
    const textColor = useThemeColor({ light: '#222222', dark: '#FFFFFF' }, 'text');
    const amountColor = useThemeColor({ light: '#0C5E3F', dark: '#0C5E3F' }, 'textTitle');
    const fontsLoaded = useLoadFonts(); // Load custom fonts
    const wallet_icon = useThemeColor({ light: images.wallet, dark: images.wallet_black }, 'textTitle');
    console.log("cryptoBalance", cryptoBalance, "nairaBalance", nairaBalance);

    return (
        <>
            <View style={styles.container}>
                {/* Gradient Background */}
                <LinearGradient
                    colors={['#25AE7A', '#1E8753']} // Adjusted for a smooth gradient effect
                    style={styles.gradientBackground}
                >
                    <Header />
                    <View style={styles.profileContainer}>
                        <View style={styles.avatarContainer}>
                            <LinearGradient
                                colors={['#55EBB2', '#3B80B8']} // Avatar gradient colors
                                style={styles.avatarGradient}
                            >
                                {profileImage ? (
                                    <Image source={{ uri: profileImage }} style={styles.avatar} />
                                ) : (
                                    <Image source={images.profile} style={styles.avatar} />
                                )}
                            </LinearGradient>
                        </View>

                        <Text style={[styles.name, { fontFamily: fontsLoaded ? 'Caprasimo' : undefined }]}>{name}</Text>
                        <Text style={styles.email}>{email}</Text>

                        {/* ID Verified Badge */}
                        {kycStatus && kycStatus == "approved" ? <View style={styles.verificationBadge}>
                            <Text style={styles.verificationText}>ID Verified <Image source={images.tick} style={styles.verifiedIcon} /></Text>
                        </View> : <Text style={styles.verificationText}>{kycStatus} </Text>}
                    </View>
                </LinearGradient>

                {/* Balance Section */}
                <View style={[styles.balanceContainer, { backgroundColor: cardBackgroundColor }]}>
                    <View style={styles.balanceItem}>
                        <Text style={[styles.balanceLabel, { color: textColor }]}>Crypto Asset</Text>
                        <View style={styles.balanceRow}>
                            <Image source={wallet_icon} style={styles.balanceIcon} />
                            <Text style={[styles.balanceAmount, { color: amountColor }]}>{cryptoBalance}</Text>
                            <View style={styles.balanceCurrencyName} >
                                <Text style={{ color: textColor }}>USD</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.separator} />

                    <View style={styles.balanceItem}>
                        <Text style={[styles.balanceLabel, { color: textColor }]}>Naira Asset</Text>
                        <View style={styles.balanceRow}>
                            <Image source={wallet_icon} style={styles.balanceIcon} />
                            <Text style={[styles.balanceAmount, { color: amountColor }]}>
                                {(nairaBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                            </Text>

                            <View style={styles.balanceCurrencyName} >
                                <Text style={{ color: textColor }}>NGN</Text>
                            </View>
                        </View>
                    </View>
                </View>

            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 25,
    },
    gradientBackground: {
        paddingBottom: 60,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    profileContainer: {
        alignItems: 'center',
    },
    avatarContainer: {
        width: 104,
        height: 104,
        borderRadius: 90,
        borderWidth: 0.1,
        borderColor: '#FFFFFF',
    },
    avatarGradient: {
        flex: 1,
        borderRadius: 90,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        width: 51,
        height: 62,
        alignSelf: 'center',  // Keeps the image centered
    },
    name: {
        fontSize: 24,
        color: '#FFFFFF',
        marginTop: 10,
        fontFamily: 'Caprasimo'

    },
    email: {
        fontSize: 13,
        color: '#E0E0E0',
        marginBottom: 8,
    },
    verificationBadge: {
        backgroundColor: '#EFFEF9',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        marginTop: 8,
    },
    verificationText: {
        color: '#22A45D',
        fontSize: 12,
        fontWeight: '600',
        backgroundColor: '#EFFEF9',
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: 20,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    verifiedIcon: {
        marginTop: 2,
        // marginLeft: 5,
        height: 16,
        width: 16,
        //make image fit to width height not cutted
        resizeMode: 'contain',
    },
    balanceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 16,
        marginTop: -35, // Overlapping effect
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    balanceItem: {
        flex: 1,
    },
    balanceLabel: {
        fontSize: 14,
        color: '#888',
        marginBottom: 5,
    },
    balanceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    balanceIcon: {
        marginRight: 5,
    },
    balanceAmount: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    balanceCurrencyName: {
        marginLeft: 4,
        fontSize: 10,
    },
    separator: {
        width: 1,
        height: '100%',
        backgroundColor: '#25AE7A',
        marginHorizontal: 10,
    },
    balanceCurrency: {
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default ProfileHeader;
