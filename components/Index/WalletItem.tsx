import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import icons from "@/constants/icons"; // Assuming icons contains default icons

type WalletItemProps = {
  label: string;
  value: string;
  icon: string; // Can be a URL or local icon key
};

const WalletItem: React.FC<WalletItemProps> = ({ label, value, icon }) => {
  // Determine whether the icon is a URL or a local asset
  const isUrl = icon.startsWith("http");
  
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
      <View style={styles.iconWrapper}>
        <Image 
          source={isUrl ? { uri: icon } : icons.bitCoin} 
          style={styles.icon} 
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

export default WalletItem;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    margin: 4,
    width: 92, // Adjust as needed
    height: 88, // Adjust as needed
  },
  card: {
    width: "100%",
    height: "100%",
    backgroundColor: "#15655B",
    borderRadius: 16,
    alignItems: "center",
    paddingTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  label: {
    fontSize: 10,
    color: "#FFF",
    marginBottom: 8,
    fontFamily: 'Caprasimo'

  },
  value: {
    fontSize: 12,
    color: "#FFF",
    fontFamily: 'Caprasimo'

  },
  iconWrapper: {
    position: "absolute",
    bottom: -10, // Position the icon outside the card
    width: 36,
    height: 36,
    borderRadius: 24,
    backgroundColor: "#FF9900", // Icon background color
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FF9900", // Glowing effect
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  icon: {
    width: 32,
    height: 32,
  },
});
