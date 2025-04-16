import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import AssetCard from '@/components/AssetCard';
import icons from '@/constants/icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useRouter } from 'expo-router';

// Code related to the integration:
import { useQuery } from '@tanstack/react-query';
import { getFromStorage } from "@/utils/storage";
import { getUserAssets } from "@/utils/queries/appQueries";
import LoadingIndicator from "@/components/LoadingIndicator";

const AssetList: React.FC<{
    selectedTab: 'All Assets' | 'My Assets'; searchQuery: string; type: string, showPrice: boolean; fromMarket: string // ✅ Add this
}> = ({
    selectedTab,
    searchQuery,
    type,
    showPrice,
    fromMarket
}) => {
        console.log("Type from SendReceive:", type);
        const backgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#000000' }, 'background');
        const router = useRouter();
        const [token, setToken] = useState<string | null>(null);

        // Fetch the token when the component mounts
        useEffect(() => {
            const fetchUserData = async () => {
                const fetchedToken = await getFromStorage("authToken");
                setToken(fetchedToken);
                console.log("🔹 Retrieved Token:", fetchedToken);
            };

            fetchUserData();
        }, []);

        const { data: userAssets, error: userAssetsError, isLoading: userAssetsLoading } = useQuery({
            queryKey: ["userAssets"],
            queryFn: () => getUserAssets({ token }),
            enabled: !!token, // Only run the query when the token is available
        });

        console.log("🔹 User Assets:", userAssets);

        // Convert API data to match required structure
        const formattedAssets = userAssets?.data?.map((asset: any) => ({
            id: asset.id.toString(),
            name: asset.currency,
            coinName: asset.wallet_currency.name,
            fullName: asset.blockchain.charAt(0).toUpperCase() + asset.blockchain.slice(1),
            balance: asset.available_balance,
            price: showPrice && asset.wallet_currency?.price ? `$${asset.wallet_currency.price}` : "******", // ✅ Hide or show based on toggle
            icon: asset.wallet_currency?.symbol
                ? `https://earlybaze.hmstech.xyz/storage/${asset.wallet_currency.symbol}`
                : icons.bitCoin,
        })) || [];


        // Filter assets based on selection & search query
        let filteredData = selectedTab === 'All Assets' ? formattedAssets : formattedAssets.filter((asset) => Number(asset.balance) > 0);
        if (searchQuery) {
            filteredData = filteredData.filter(
                (asset) =>
                    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    asset.fullName.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return (
            <View style={[styles.mainContainer, { backgroundColor }]}>
                {userAssetsLoading ? (
                    <LoadingIndicator /> // ✅ Show the loading indicator
                ) : filteredData.length === 0 ? (
                    <View style={styles.noDataContainer}>
                        <Text style={styles.noDataText}>No Assets Available</Text>
                    </View>
                ) : (
                    <FlatList
                        data={filteredData}
                        keyExtractor={(item) => item.id}
                        numColumns={2} // Ensures two items per row
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.cardContainer}
                                onPress={() => {
                                    // if (fromMarket == 'market') {
                                    //     router.push({
                                    //         pathname: '/MyAssest',
                                    //         params: { balance: item.balance, assestId: item.id, assetName: item.name, fullName: item.fullName, icon: item.icon },
                                    //     });
                                    // }
                                    if (type === 'receive') {
                                        router.push({
                                            pathname: '/Receive',
                                            params: { assestId: item.id, assetName: item.name, fullName: item.fullName, icon: item.icon },
                                        });
                                    } else if (type === 'send' && Number(item.balance) > 0) {
                                        router.push({
                                            pathname: '/Send',
                                            params: { assestId: item.id, assetName: item.name, fullName: item.fullName, icon: item.icon, balance: item.balance },
                                        });
                                    } else if (type === 'send' && Number(item.balance) === 0) {
                                        Alert.alert(
                                            'Insufficient Balance',
                                            `You don't have enough ${item.name} to send.`,
                                            [{ text: 'OK' }]
                                        );
                                    } else {
                                        console.log(`Normal action for ${item.name}`);
                                        router.push({
                                            pathname: '/MyAssest',
                                            params: { balance: item.balance, assestId: item.id, assetName: item.name, fullName: item.fullName, icon: item.icon },
                                        })
                                    }
                                }
                                }
                            >
                                <AssetCard {...item} />
                            </TouchableOpacity>
                        )}
                        contentContainerStyle={styles.list}
                    />
                )}
            </View>
        );

    };

const styles = StyleSheet.create({
    mainContainer: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
        flex: 1,
        alignSelf: 'stretch',
    },
    noDataContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noDataText: {
        fontSize: 16,
        color: 'gray',
    },
    list: {
        paddingBottom: 20,
        paddingHorizontal: 8,
    },
    cardContainer: {
        flex: 1,
        margin: 6,
    },
});

export default AssetList;
