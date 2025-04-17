import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getTransactionCurrency } from "@/utils/queries/appQueries";
import LoadingIndicator from "@/components/LoadingIndicator";
import { getFromStorage } from "@/utils/storage";

import { useRouter } from "expo-router";

const BASE_URL = "https://earlybaze.hmstech.xyz/storage/";

const Transactions = ({ assetName }) => {
    const router = useRouter(); // add this inside the component before return

    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const fetchedToken = await getFromStorage("authToken");
            setToken(fetchedToken);
            console.log("🔹 Retrieved Token:", fetchedToken);
        };

        fetchUserData();
    }, []);

    console.log("assetName", assetName);
    // Fetch transaction data using API
    const { data, error, isLoading } = useQuery({
        queryKey: ["currency", assetName],
        queryFn: () => getTransactionCurrency(token, assetName),
        enabled: !!token,
    });

    if (isLoading) return <LoadingIndicator />;
    if (error) return <Text>Error fetching transactions</Text>;

    const transactions = data?.data?.transactions || [];
    console.log("The data:", data);

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

    return (
        <View style={styles.activityContainer}>
            <Text style={styles.activityDate}>Activity</Text>
            {transactions.length > 0 ? (
                <FlatList
                    data={transactions}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => {
                        const imageUrl = item.icon
                            ? `${BASE_URL}${item.icon}`
                            : "https://via.placeholder.com/30";

                        const iconBgColor = item.type
                            ? transactionTypeColors[item.type.toLowerCase()] || '#D9D9D9'
                            : '#D9D9D9';

                        return (
                            <TouchableOpacity
                                onPress={() => {
                                    if (item?.type === 'send' || item?.type === 'receive') {
                                        router.push({
                                            pathname: "/TransactionSummary",
                                            params: {
                                                id: item.id,
                                                transType: item.type
                                            }
                                        });
                                    } else if (item?.type) {
                                        router.push({
                                            pathname: "/TransactionPage",
                                            params: {
                                                id: item.id,
                                                types: item.type
                                            }
                                        });
                                    }
                                }}
                                style={styles.transactionCard}
                            >
                                <View style={[styles.iconWrapper, { backgroundColor: iconBgColor }]}>
                                    <Image source={{ uri: imageUrl }} style={styles.icon} />
                                </View>

                                <View style={styles.middleSection}>
                                    <Text style={styles.typeText}>{item.currency?.toUpperCase() || 'USDT'}</Text>
                                    {item?.details?.status && (
                                        <View style={styles.statusRow}>
                                            <View
                                                style={[
                                                    styles.statusDot,
                                                    {
                                                        backgroundColor:
                                                            item.details.status === 'approved' || item.details.status === 'completed'
                                                                ? 'green'
                                                                : item.details.status === 'pending'
                                                                    ? 'orange'
                                                                    : 'red',
                                                    },
                                                ]}
                                            />
                                            <Text
                                                style={[
                                                    styles.statusText,
                                                    {
                                                        color:
                                                            item.details.status === 'approved' || item.details.status === 'completed'
                                                                ? 'green'
                                                                : item.details.status === 'pending'
                                                                    ? 'orange'
                                                                    : 'red',
                                                    },
                                                ]}
                                            >
                                                {item.details.status.charAt(0).toUpperCase() + item.details.status.slice(1)}
                                            </Text>
                                        </View>
                                    )}


                                </View>

                                <View style={styles.rightSection}>
                                    <Text style={styles.amountText}>
                                        {parseFloat(item.amount).toFixed(4)} {item.currency?.toUpperCase() || 'USDT'}
                                    </Text>
                                    <Text style={styles.dateText}>{formatDate(item.created_at)}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                />
            ) : (
                <Text style={styles.noTransactions}>No transactions found.</Text>
            )}
        </View>
    );

};

const styles = StyleSheet.create({
    activityContainer: {
        padding: 16,
        backgroundColor: "white",
    },
    activityDate: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
    },
    transactionItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 12,
        backgroundColor: "#f9f9f9",
        borderRadius: 10,
        marginBottom: 10,
    },
    transactionImageWrapper: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#fff",
        borderWidth: 2,
        borderColor: "#22A45D", // or any accent color
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
        padding: 5,
    },
    transactionImage: {
        width: 24,
        height: 24,

        borderRadius: 15,
        resizeMode: "contain",
    },
    transactionDetails: {
        flex: 1,
        marginLeft: 10,
    },
    transactionType: {
        fontSize: 14,
        fontWeight: "bold",
    },
    transactionAmount: {
        fontSize: 12,
        color: "#666",
    },
    transactionPrice: {
        fontSize: 14,
        fontWeight: "bold",
    },
    noTransactions: {
        textAlign: "center",
        fontSize: 16,
        color: "#999",
        marginTop: 20,
    },
    transactionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 15,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 12,
    },

    iconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },

    icon: {
        width: 22,
        height: 22,
        resizeMode: 'contain',
    },

    middleSection: {
        flex: 1,
    },

    typeText: {
        fontSize: 14,
        fontWeight: 'bold',
    },

    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },

    statusDot: {
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

    rightSection: {
        alignItems: 'flex-end',
    },

    amountText: {
        fontSize: 14,
        fontWeight: 'bold',
    },

    dateText: {
        fontSize: 11,
        color: '#666',
        marginTop: 4,
    },

});

export default Transactions;
