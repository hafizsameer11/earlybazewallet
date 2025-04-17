import React, { useEffect, useRef, useState } from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    AppState,
    Linking,
    Dimensions,
    Image,
    BackHandler, // Import for handling the back button
} from "react-native";
import { Camera, CameraView } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useCameraPermissions } from "expo-camera";
import Overlay from "./Overlay";
import { images } from "@/constants";

const { width, height } = Dimensions.get("window");

interface QrModalProps {
    isVisible: boolean;
    onClose: () => void;
    onAddressScanned?: (address: string) => void; // ✅ Add this line
}

const QrModal: React.FC<QrModalProps> = ({ isVisible, onClose, onAddressScanned }) => {
    const [permission, requestPermission] = useCameraPermissions();
    const qrLock = useRef(false);
    const appState = useRef(AppState.currentState);

    useEffect(() => {
        const subscription = AppState.addEventListener("change", (nextAppState) => {
            if (appState.current.match(/inactive|background/) && nextAppState === "active") {
                qrLock.current = false;
            }
            appState.current = nextAppState;
        });

        return () => {
            subscription.remove();
        };
    }, []);

    useEffect(() => {
        const backAction = () => {
            if (isVisible) {
                onClose();
                return true; // Prevents default behavior (app exit)
            }
            return false;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove(); // Cleanup on unmount
    }, [isVisible]);

    const isPermissionGranted = Boolean(permission?.granted);

    const handleBarCodeScanned = ({ data }: { data: string }) => {
        if (data && !qrLock.current) {
            qrLock.current = true;
            setTimeout(() => {
                onAddressScanned?.(data); // ✅ Use callback
                onClose(); // ✅ Auto-close
                qrLock.current = false;
            }, 500);
        }
    };


    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            onClose(); // Auto-close modal when an image is selected
        }
    };

    return (
        <Modal visible={isVisible} animationType="slide" transparent>
            {/* Close Button */}
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Image source={images.cross_white} style={styles.closeIcon} />
            </TouchableOpacity>
            <View style={styles.scannerContainer}>
                <Text style={styles.scannerText}>Scan the QR Code or Choose an Image</Text>

                {/* Camera View */}
                {permission === null ? (
                    <Text style={styles.permissionText}>Requesting camera permission...</Text>
                ) : !isPermissionGranted ? (
                    <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
                        <Text style={styles.permissionText}>Grant Camera Permission</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.cameraWrapper}>
                        <CameraView
                            style={styles.qrScanner}
                            facing="back"
                            onBarcodeScanned={handleBarCodeScanned}
                        />
                        <Overlay />
                    </View>
                )}

                {/* Choose Image Button */}
                <TouchableOpacity onPress={pickImage} style={styles.chooseImageButton}>
                    <Image source={images.gallery} style={styles.chooseImageIcon} />
                    <Text style={styles.chooseImageText}>Choose Image</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

export default QrModal;

const styles = StyleSheet.create({
    scannerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#2E2E2E", // Matches the UI color from the image
    },
    scannerText: {
        color: "#FFFFFF",
        fontSize: 16,
        marginBottom: 20,
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 10,
        backgroundColor: '#FFFFFF20',
        borderRadius: 20,
        padding: 5,
    },
    closeIcon: {
        width: 18,
        height: 18,
        tintColor: '#FFFFFF',
    },

    permissionButton: {
        backgroundColor: "#007AFF",
        padding: 12,
        borderRadius: 8,
        marginTop: 20,
    },
    permissionText: {
        fontSize: 14,
        color: "#FFFFFF",
    },
    cameraWrapper: {
        width: width * 0.70,
        height: height * 0.35,
        borderRadius: 10,
        overflow: "hidden",
    },
    qrScanner: {
        width: width * 0.8,
        height: height * 0.5,
        borderRadius: 10,
    },
    chooseImageButton: {
        alignItems: "center",
        marginTop: 20,
    },
    chooseImageIcon: {
        width: 30,
        height: 30,
        marginBottom: 5,
    },
    chooseImageText: {
        fontSize: 14,
        color: "#FFFFFF",
    },
});
