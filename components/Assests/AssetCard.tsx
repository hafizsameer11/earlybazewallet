import React from "react";
import { View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity } from "react-native";
import { images } from "@/constants"; // Assuming images.assestBg is imported here
import { icons } from "@/constants";
import { useLocalSearchParams, useRouter } from "expo-router"; // Ensure correct router import
// Sample actions array
const actions = [
    { name: "send", label: "Send", bgColor: "#C6FFC7", color: "#22A45D" },
    { name: "receive", label: "Receive", bgColor: "#FFCAEE", color: "#9B59B6" },
    { name: "buy", label: "Buy", bgColor: "#E0D6FF", color: "#4688F1" },
    { name: "swap", label: "Swap", bgColor: "#FFDFDF", color: "#E74C3C" },
];


const Actions = ({ balance, assestId, assetName, fullName, icon }) => {
    const router = useRouter();

    const handleActionPress = (type) => {
        if (type === "receive") {
            router.push({
                pathname: "/Receive",
                params: { assestId, assetName, fullName, icon },
            });
        } else if (type === "send") {
            if (Number(balance.replace(/[^0-9.-]+/g, "")) > 0) { // Removing currency symbols for comparison
                router.push({
                    pathname: "/Send",
                    params: { assestId, assetName, fullName, icon },
                });
            } else {
                console.log(`❌ Cannot send ${assetName} - Balance is zero`);
                alert("You don't have balance in this asset. Please buy it first.");

            }
        } else if (type === 'buy') {
            router.push('/Buy');
        }
        else if (type === 'swap') {
            router.push('/Swap');
        }
    };
    return (
        <ImageBackground
            source={images.assestBg}
            style={styles.actionsBackground}
        >
            {/* My Balance Section */}
            <View style={styles.balanceContainer}>
                <Text style={styles.balanceText}>My balance</Text>
                <Text style={styles.balanceAmount}>
                    {parseFloat(balance || "0").toFixed(4)}
                </Text>s
            </View>

            <View style={styles.actionsContainer}>
                {actions.map((action, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.actionButton}
                        onPress={() => handleActionPress(action.name)}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: action.bgColor }]}>
                            <Image
                                source={icons[action.name]}
                                style={[styles.icon, { tintColor: action.color }]}
                            />
                        </View>
                        <Text style={styles.actionText}>{action.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </ImageBackground>
    );

};


interface AssetCardProps {
    iconUrl: string;
    balance: string;
    percentage: string;
    assestId: string;
    assetName: string;
    fullName: string;
    icon: string;
}
const AssetCard: React.FC<AssetCardProps> = ({ iconUrl, balance, percentage, assestId, assetName, fullName, icon }) => {
    return (
        <View style={styles.card}>
            <View style={styles.iconContainer}>
                <Image source={{ uri: iconUrl }} style={styles.iconMain} />
            </View>
            <View style={{ marginTop: 25, marginBottom: 15, }}>
                <Text style={styles.balance}>{balance}</Text>
            </View>
            {/* <Text style={styles.percentage}>{percentage}</Text> */}

            {/* Pass data to Actions component */}
            <Actions balance={balance} assestId={assestId} assetName={assetName} fullName={fullName} icon={icon} />
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 20,
        alignItems: "center",
        backgroundColor: "#22A45D",
        marginBottom: 20,
        height: 300,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 40,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 10,
        marginTop: 20,
    },
    iconMain: {
        width: 90,
        height: 90,
        resizeMode: "contain",
        marginTop: 20,
    },
    icon: {
        width: 20,
        height: 20,
        resizeMode: "contain",
    },
    balance: {
        fontSize: 24,
        color: "white",
        fontFamily: 'Caprasimo',

    },
    percentage: {
        fontSize: 18,
        color: "white",
        marginBottom: 10,

    },
    actionsBackground: {
        width: "100%",
        paddingVertical: 25, // Optional padding
        paddingHorizontal: 10,
        marginLeft: 20,

    },
    balanceContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20, // reduced from 50 to 20
        marginBottom: 10,
        position: 'absolute',
        top: 2,
    },

    balanceText: {
        fontSize: 12,
        color: "gray",
        marginLeft: 50,

    },
    balanceAmount: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#22A45D",
        marginLeft: 100,
    },
    actionsContainer: {
        flexDirection: "row",
        gap: 20,
        marginHorizontal: 10,
        width: "100%",
    },
    actionButton: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 20,
        paddingHorizontal: 10,
        borderRadius: 50,
        width: 60,
        height: 60,
    },
    actionText: {
        fontSize: 10,
        fontFamily: 'Caprasimo',

    },
});

export default AssetCard;
