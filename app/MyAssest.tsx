import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Header from "@/components/Header";
import AssetCard from "@/components/Assests/AssetCard";
import Actions from "@/components/Assests/Actions";
import Transactions from "@/components/Assests/Transactions";


const MyAssets: React.FC = () => {
    const { assetName, icon, assestId, fullName, balance, title } = useLocalSearchParams();
    console.log("name", assetName);
    const percentage = "+24.35%"; // Replace with dynamic percentage if needed

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Header title={title || "Asset"} />
            <AssetCard
                iconUrl={icon || "https://example.com/default.png"}
                balance={balance}
                percentage={percentage}
                assestId={assestId}
                assetName={assetName}
                fullName={fullName}
                icon={icon}
                title={title}
            />
            <Transactions assetName={assetName} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingHorizontal: 16,
        paddingBottom: 20,
        paddingTop: 20,
    },
});

export default MyAssets;
