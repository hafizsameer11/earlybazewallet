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
        network?: string | null; // ✅ Add this line
        status?: string | null;
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

const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    };
    return date.toLocaleString('en-US', options).replace(',', '');
};

const AssetItem: React.FC<AssetProps> = ({ item, isAssetTab = false, customIconSize = 20 }) => {
    const themeBackground = useThemeColor({ light: '#FFFFFF', dark: '#1A1A1A' }, 'background');
    const textColor = useThemeColor({ light: '#000000', dark: '#FFFFFF' }, 'text');
    const balanceTextColor = useThemeColor({ light: '#000000', dark: '#FFFFFF' }, 'text');

    const router = useRouter();

    const cardBackground = themeBackground;
    const iconBgColor = item.type ? transactionTypeColors[item.type.toLowerCase()] || '#2232' : '#2232';

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
                if (isAssetTab) {
                    router.push({
                        pathname: '/MyAssest',
                        params: {
                            balance: item.balance,
                            assestId: item.id,
                            assetName: item.name,
                            fullName: item.name, // 👈 If fullName exists separately, update accordingly
                            icon: item.icon,
                            type: item.type,
                            id:item.id,

                        }
                    });
                } else if (item?.type === 'send' || item?.type === 'receive') {
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
                    {!isAssetTab && item.status && (
                        <View style={styles.statusContainer}>
                            <View style={styles.dot} />
                            <Text style={styles.statusText}>{['approved', 'completed'].includes(item.status ?? 'approved') ? 'Successful' : 'Pending'}
                            </Text>
                        </View>
                    )}
                    {isAssetTab && (
                        <Text style={[styles.assetSubText, { color: '#666666', marginTop: 10, }]}>
                            {item.network ? item.network : item.name}
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
                    <Text style={[styles.price, { color: textColor, marginTop: 10 }]}>
                        {formatPrice(item.price)}
                    </Text>
                )}
                {!isAssetTab && (
                    <Text style={styles.dateText}>
                        {formatDate(item.created_at)}
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
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12, // more subtle
        marginBottom: 10,
        backgroundColor: '#fff', // or use cardBackground
        shadowColor: '#000',
        shadowOpacity: 0.4,
        shadowRadius: 2,
        elevation: 1,
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
        fontSize: 10,
        marginTop: 2,
    },
    rightContainer: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        flexGrow: 1,
        marginRight: 10,
    },
    balance: {
        fontSize: 14,
        fontWeight: '600', // bolder to match
    },
    price: {
        fontSize: 11,
        fontWeight: '400',
        color: '#666',
        marginTop: 2,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'green',
        marginRight: 6,
    },
    statusText: {
        color: 'green',
        fontSize: 12,
        fontWeight: '500',
    },
    dateText: {
        marginTop: 6,
        fontSize: 11,
        color: '#555',
    },

});
