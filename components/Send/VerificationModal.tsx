import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Modal,
    StyleSheet,
    Image
} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import PrimaryButton from '@/components/Buy/PrimaryButton';
import { Ionicons } from '@expo/vector-icons';
import { images } from '@/constants';


import { useMutation, useQuery } from '@tanstack/react-query';
import { createInternalTransfer } from "@/utils/mutations/accountMutations";
import { verifyPin } from "@/utils/mutations/authMutations";
import Toast from 'react-native-toast-message';
import { getFromStorage } from '@/utils/storage';
import { getUserDetails } from '@/utils/queries/appQueries';
import * as LocalAuthentication from 'expo-local-authentication';


import * as SecureStore from 'expo-secure-store';

interface VerificationModalProps {
    visible: boolean;
    onClose: () => void;
    onFail: () => void; // New prop to handle failure
}

const VerificationModal: React.FC<VerificationModalProps & { requestData: any; onSuccess: ({ reference, amount, currency }: { reference: string, amount: string, currency: string, transaction_id: string }) => void }> = ({ visible, onClose, onFail, requestData, onSuccess }) => {

    const [token, setToken] = useState<string | null>(null); // State to hold the token
    const [useFaceScan, setUseFaceScan] = useState(false);
    const [useFingerprint, setUseFingerprint] = useState(false);

    useEffect(() => {
        const loadSecurityPrefs = async () => {
            const faceScan = await SecureStore.getItemAsync('useFaceScan');
            const fingerprint = await SecureStore.getItemAsync('useFingerprint');

            if (faceScan !== null) setUseFaceScan(faceScan === 'true');
            if (fingerprint !== null) setUseFingerprint(fingerprint === 'true');
        };

        loadSecurityPrefs();
    }, []);
    
    useEffect(() => {
        const fetchUserData = async () => {
            const fetchedToken = await getFromStorage("authToken");
            setToken(fetchedToken);
            console.log("🔹 Retrieved Token:", fetchedToken);
        };

        fetchUserData();
    }, []);

    // Fetch user details when the token is available
    const { data: userDetails, error: userError, isLoading: userLoading } = useQuery({
        queryKey: ["userDetails"],
        queryFn: () => getUserDetails({ token }),
        enabled: !!token, // Only run the query when the token is available
    });

    console.log("🔹 User Details:", userDetails);

    const cardBackgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#1A1A1A' }, 'card');
    const textTitleColor = useThemeColor({ light: '#25AE7A', dark: '#25AE7A' }, 'textTitle');
    const textColor = useThemeColor({ light: '#222222', dark: '#FFFFFF' }, 'text');
    const backgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#2A2A2A' }, 'background');
    const borderColor = useThemeColor({ light: '#E5E5E5', dark: '#444' }, 'border');

    const close = useThemeColor({ light: images.cross_white, dark: images.cross_black }, 'close');

    const [otp, setOtp] = useState('');
    const [pin, setPin] = useState('');
    const [timer, setTimer] = useState(0);
    const [isOtpFocused, setIsOtpFocused] = useState(false);
    const [isPinFocused, setIsPinFocused] = useState(false);
    const [email, setEmail] = useState('');
    const calledTransferRef = useRef(false);

    // ✅ First mutation - Verify PIN
    console.log("fee_summary", requestData);
    const { isPending: isPendingPin, mutate: mutatePin } = useMutation({
        mutationFn: (data: { email: string; pin: string }) => verifyPin(data),
        // onSuccess: () => {
        //     console.log("✅ Pin Verification Successful");
        //     Toast.show({
        //         type: 'success',
        //         text1: 'Pin Verified!',
        //         text2: 'Transactions is in progress.',
        //     });
        //     console.log("🔸 Payload sent to mutateTransfer:", {
        //         data: {
        //             currency: requestData.currency,
        //             network: requestData.network,
        //             amount: requestData.amount,
        //             email: requestData.email || requestData.address,
        //             fee_summary: requestData.fee_summary,
        //         },
        //         token: requestData.token,
        //     });
        //     // If PIN is correct, proceed to transfer
        //     mutateTransfer(
        //         {
        //             data: {
        //                 currency: requestData.currency,
        //                 network: requestData.network,
        //                 amount: requestData.amount,
        //                 email: requestData.email || requestData.address,
        //                 fee_summary: requestData.fee_summary, // ✅ Add this line
        //             },
        //             token: requestData.token,
        //         },
        //         {
        //             onSuccess: (response) => {
        //                 console.log("✅ Transfer Successful:", response);

        //                 // Extract transaction reference
        //                 const reference = response?.data?.reference || "N/A";
        //                 const amount = requestData.amount; // Assuming `amount` is available in `requestData`

        //                 onSuccess(reference, amount);

        //                 onClose(); // ✅ Close verification modal
        //             },
        //             onError: (error) => {
        //                 console.error("❌ Transfer Failed:", error);
        //                 onFail(); // ✅ Show failure modal
        //             },
        //         }
        //     );
        // },
        // onError: (error) => {
        //     console.error("❌ Pin Verification Failed:", error);
        //     onFail(); // ✅ Show failure modal
        // },
    });

    // ✅ Second mutation - Create Internal Transfer
    const { isPending: isPendingTransfer, mutate: mutateTransfer } = useMutation({
        mutationFn: (data: { data: any; token: string }) => createInternalTransfer(data),
    });


    // ✅ Disable Proceed button if email or PIN is missing
    const isProceedDisabled =
        !pin.trim();

    // Start countdown when timer > 0
    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    // Handle resend button click
    const handleResendOtp = () => {
        setTimer(30); // Start 30-second timer
    };
    const handleBiometricAuth = async () => {
        try {
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();

            if (!hasHardware || !isEnrolled) {
                alert("Biometric authentication is not available.");
                return;
            }

            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: "Authenticate to proceed",
                fallbackLabel: "Use PIN instead",
            });

            if (result.success) {
                console.log("✅ Biometric Auth Success! Proceeding...");

                // Same logic as in your mutatePin.onSuccess block:
                mutateTransfer(
                    {
                        data: {
                            currency: requestData.currency,
                            network: requestData.network,
                            amount: requestData.amount,
                            email: requestData.email || requestData.address,
                            fee_summary: requestData.fee_summary,
                        },
                        token: requestData.token,
                    },
                    {
                        onSuccess: (response) => {
                            console.log("✅ Transfer Successful via Biometrics:", response);
                            const reference = response?.data.reference || "N/A";
                            const amount = requestData.amount;
                            const currency = requestData.currency;
                            const transaction_id = response?.data.transaction_id || "N/A";

                            onSuccess({ reference, amount, currency, transaction_id });
                            onClose();
                        },
                        onError: (error) => {
                            console.error("❌ Transfer Failed:", error);
                            onFail();
                        },
                    }
                );
            } else {
                alert("Biometric authentication failed.");
            }
        } catch (error) {
            console.error("❌ Biometric Auth Error:", error);
            alert("Biometric authentication failed.");
        }
    };


    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>
                <View style={[styles.modalContainer, { backgroundColor: cardBackgroundColor }]}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: textTitleColor }]}>Verification</Text>
                        <TouchableOpacity onPress={onClose} style={[styles.closeButton, { backgroundColor }]}>
                            <Image source={close} style={styles.closeIcon} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.horizontalLine} />

                    {/* OTP Input */}
                    <View style={styles.inputContainer}>
                        <Text style={[styles.label, { color: textColor }]}>Enter Your Email</Text>
                        <View style={[styles.inputRow, { borderColor: isOtpFocused ? '#25AE7A' : borderColor, }]}>
                            <TextInput
                                placeholder="Email"
                                placeholderTextColor="#A1A1A1"
                                style={[styles.inputField, { color: textColor }]}
                                value={userDetails?.data?.email} // Use userDetails.email if available
                                onChangeText={setEmail}
                                //make 
                                editable={false} // Disable editing
                                onFocus={() => setIsOtpFocused(true)}
                                onBlur={() => setIsOtpFocused(false)}
                            />
                            {/* <TouchableOpacity
                                style={styles.sendOtpButton}
                                onPress={handleResendOtp}
                                disabled={timer > 0}
                            >
                                <Text style={[styles.sendOtpText, timer > 0 && styles.disabledText]}>
                                    {timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
                                </Text>
                            </TouchableOpacity> */}
                        </View>

                        {/* Resend Timer Fix */}
                        {/* {timer > 0 && (
                            <Text style={styles.resendText}>
                                Resend in <Text style={styles.timer}>00 : {timer < 10 ? `0${timer}` : timer}</Text>
                            </Text>
                        )} */}

                        {/* PIN Input */}
                        <Text style={[styles.label, { color: textColor, marginTop: 20 }]}>Input Pin</Text>
                        <View style={styles.pinInputContainer}>
                            <View style={[styles.inputRow, { borderColor: isPinFocused ? '#25AE7A' : borderColor, width: '64%', }]}>
                                <TextInput
                                    placeholder="Input Pin"
                                    placeholderTextColor="#A1A1A1"
                                    style={[styles.inputField, { color: textColor }]}
                                    secureTextEntry
                                    value={pin}
                                    onChangeText={setPin}
                                    onFocus={() => setIsPinFocused(true)}
                                    onBlur={() => setIsPinFocused(false)}
                                />

                            </View>
                            <View style={styles.iconContainer}>
                                <TouchableOpacity
                                    style={[styles.authButton, !useFingerprint && styles.disabledAuthButton]}
                                    onPress={useFingerprint ? handleBiometricAuth : undefined}
                                    disabled={!useFingerprint}
                                >
                                    <Ionicons name="finger-print" size={28} color="#fff" />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.authButton, !useFaceScan && styles.disabledAuthButton]}
                                    onPress={useFaceScan ? handleBiometricAuth : undefined}
                                    disabled={!useFaceScan}
                                >
                                    <Image source={images.face} style={styles.authIcon} />
                                </TouchableOpacity>
                            </View>


                        </View>
                    </View>
                    <View style={styles.buttonContainer}>
                        {/* Proceed Button - Calls API Request */}
                        <PrimaryButton
                            title={isPendingTransfer || isPendingPin ? "Processing..." : "Proceed"}
                            onPress={() => {
                                console.log("🔹 Verifying PIN for:", email);

                                mutatePin(
                                    { email: userDetails?.data?.email, pin }, // ✅ Verify PIN first
                                    {
                                        onSuccess: () => {
                                            console.log("✅ PIN Verified! Proceeding with Transfer...");

                                            mutateTransfer(
                                                {
                                                    data: {
                                                        currency: requestData.currency,
                                                        network: requestData.network,
                                                        amount: requestData.amount,
                                                        email: requestData.email || requestData.address,
                                                        fee_summary: requestData.fee_summary, // ✅ Add this line
                                                    },
                                                    token: requestData.token,
                                                },
                                                {
                                                    onSuccess: (response) => {
                                                        console.log("✅ Transfer Successful:", response);

                                                        // Extract transaction reference and amount
                                                        const reference = response?.data.reference || "N/A";
                                                        const amount = requestData.amount; // Assuming `amount` is available in `requestData`
                                                        const currency = requestData.currency;
                                                        const transaction_id = response?.data.transaction_id || "N/A";
                                                        // Pass both reference and amount to onSuccess as an object
                                                        onSuccess({ reference, amount, currency, transaction_id });

                                                        onClose(); // ✅ Close verification modal
                                                    },
                                                    onError: (error) => {
                                                        console.error("❌ Transfer Failed:", error);
                                                        onFail(); // ✅ Show failure modal
                                                    },
                                                }
                                            );

                                        },
                                        onError: (error) => {
                                            console.error("❌ PIN Verification Failed:", error);
                                            onFail(); // ✅ Show failure modal
                                        },
                                    }
                                );
                            }}
                            disabled={isProceedDisabled} // ✅ Button disabled if email or PIN is empty
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};




const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        marginBottom: 3,
    },
    modalContainer: {
        width: '90%',
        borderRadius: 15,
        alignItems: 'center',
        marginBottom: 12,
        paddingBottom: 12,
    },
    horizontalLine: {
        width: '100%',
        height: 1,
        backgroundColor: '#0F714D',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    title: {
        fontSize: 18,
        fontFamily: 'Caprasimo'

    },
    label: {
        fontSize: 12,
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        marginBottom: 5,
    },
    inputContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    pinInputContainer: {
        flexDirection: 'row',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        borderRadius: 10,
        paddingHorizontal: 10,
        borderWidth: 1,
        height: 50,
    },
    inputField: {
        flex: 1,
        fontSize: 12,
        paddingVertical: 8,
    },
    sendOtpButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#25AE7A',
    },
    disabledAuthButton: {
        opacity: 0.5,
    },
    sendOtpText: {
        color: '#25AE7A',
        fontWeight: 'bold',
        fontSize: 12,
    },
    disabledText: {
        color: '#999',
    },
    resendText: {
        alignSelf: 'flex-end',
        marginTop: 5,
        fontSize: 12,
        color: '#555',
    },
    timer: {
        color: '#25AE7A',
        fontWeight: 'bold',
    },
    iconContainer: {
        flexDirection: 'row',
        gap: 8,
        marginLeft: 10,
    },
    authButton: {
        backgroundColor: '#25AE7A',
        borderRadius: 10,
        padding: 10,
    },
    buttonContainer: {
        width: '100%',
        marginTop: 20,
        paddingHorizontal: 16,
    },
    closeButton: {
        padding: 5,
        borderRadius: 25,
        borderWidth: 1,
    },
    closeIcon: {
        width: 20,
        height: 20,
    },
});

export default VerificationModal;
