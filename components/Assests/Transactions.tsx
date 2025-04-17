import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getTransactionCurrency } from "@/utils/queries/appQueries";
import LoadingIndicator from "@/components/LoadingIndicator";
import { getFromStorage } from "@/utils/storage";

const BASE_URL = "https://earlybaze.hmstech.xyz/storage/";

const Transactions = ({ assetName }) => {
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

    return (
        <View style={styles.activityContainer}>
            <Text style={styles.activityDate}>Activity</Text>
            {transactions.length > 0 ? (
                <FlatList
                    data={transactions}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => {
                        console.log("icon", item.icon);
                        const imageUrl = item.icon
                            ? `${BASE_URL}${item.icon}`
                            : "https://via.placeholder.com/30"; // Default image

                        return (
                            <View style={styles.transactionItem}>
                                {/* Profile Image */}
                                <View style={styles.transactionImageWrapper}>
                                    <Image source={{ uri: imageUrl }} style={styles.transactionImage} />
                                </View>


                                {/* Transaction Details */}
                                <View style={styles.transactionDetails}>
                                    <Text style={styles.transactionType}>
                                        {item.type.toUpperCase()}
                                    </Text>
                                    <Text style={styles.transactionAmount}>
                                        {item.amount} {item.currency}
                                    </Text>
                                </View>
                                <Text style={styles.transactionPrice}>
                                    {item.amount_usd ? `$${item.amount_usd}` : "N/A"}
                                </Text>
                            </View>
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
        padding:5,
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
});

export default Transactions;
