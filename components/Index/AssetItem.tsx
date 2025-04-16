import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useRouter } from 'expo-router';

interface AssetProps {
    item: {
        id: number | string;
        name: string;
        balance: string;
        price?: string;
        icon?: string | null;
        symbol?: string | null;
        created_at?: string;
        type?: string;
    };
    isAssetTab?: boolean;
    customIconSize?: number;
}

const transactionTypeColors: Record<string, string> = {
    send: '#C6FFC7',
    receive: '#FFCAEE',
    buy: '#E0D6FF',
    swap: '#FFDFDF',
    withdraw: '#D9D9D9',
};

const AssetItem: React.FC<AssetProps> = ({ item, isAssetTab = false, customIconSize = 20 }) => {
    const themeBackground = useThemeColor({ light: '#FFFFFF', dark: '#1A1A1A' }, 'background');
    const textColor = useThemeColor({ light: '#000000', dark: '#FFFFFF' }, 'text');
    const balanceTextColor = useThemeColor({ light: '#000000', dark: '#FFFFFF' }, 'text');

    const router = useRouter();

    const cardBackground = isAssetTab ? '#FFF9E5' : themeBackground;
    const iconBgColor = item.type ? transactionTypeColors[item.type.toLowerCase()] || '#C6FFC7' : '#C6FFC7';
    
    const formatPrice = (priceString: string): string => {

        const regex = /1 (\w+) = ([0-9.]+) USD/;
        const match = priceString.match(regex);

        if (!match) return priceString;

        const asset = match[1];
        const price = parseFloat(match[2]).toFixed(4); // 👈 Show up to 4 digits

        return `1 ${asset} = ${price} USD`;
    };

    return (
        <TouchableOpacity
            style={[styles.itemContainer, { backgroundColor: themeBackground }]}
            onPress={() => {
                if (item?.type === 'send' || item?.type === 'receive') {
                    router.push(`/TransactionSummary?id=${item.id}&transType=${item.type}`);
                } else if (item?.type) {
                    router.push(`/TransactionPage?id=${item.id}&types=${item.type}`);
                }
            }}
        >
            {/* Left Side: Icon + Name */}
            <View style={styles.leftContainer}>
                <View style={[styles.iconWrapper, { backgroundColor: iconBgColor, width: customIconSize + 15, height: customIconSize + 15, borderRadius: (customIconSize + 15) / 2 }]}>
                    {item.icon ? (
                        <Image
                            source={{ uri: item.icon }}
                            style={{ width: customIconSize, height: customIconSize }}
                            resizeMode="contain"
                        />
                    ) : (
                        <Text style={{ color: textColor, fontSize: 10 }}>No Icon</Text>
                    )}
                </View>

                <View>
                    <Text style={[styles.assetName, { color: textColor }]}>
                        {item.name?.toUpperCase()}
                    </Text>
                    {item.type && (
                        <Text style={[styles.assetSubText, { color: '#888' }]}>
                            {item.type.toUpperCase()}
                        </Text>
                    )}
                </View>
            </View>

            {/* Right Side: Balance + Price */}
            <View style={styles.rightContainer}>
                <Text style={[styles.balance, { color: balanceTextColor }]}>
                    {parseFloat(item.balance).toFixed(4)}
                </Text>
                {item.price && (
                    <Text style={[styles.price, { color: textColor }]}>
                        {formatPrice(item.price)}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );
};

export default AssetItem;

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 15,
        marginHorizontal: 16,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    assetName: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    assetSubText: {
        fontSize: 12,
        marginTop: 2,
    },
    rightContainer: {
        alignItems: 'flex-end',
        flexGrow: 1,
        marginRight: 10,
    },
    balance: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    price: {
        fontSize: 10,
        color: '#888',
    },
});
