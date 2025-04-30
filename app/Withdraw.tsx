import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import PrimaryButton from '@/components/Buy/PrimaryButton';
import Header from '@/components/Header';
import BuyHead from '@/components/BuyHead';
import PaymentMethodModal from '@/components/Buy/PaymentMethodModal';
import { useRouter, router } from 'expo-router';


//Code related to the integration: 
import { createWithdrawal } from '@/utils/mutations/paymentMutations';
import { useMutation } from '@tanstack/react-query';
import { getFromStorage } from '@/utils/storage';
import { useUserBalanceContext } from '../contexts/UserBalanceContext'
import Toast from "react-native-toast-message"; // ✅ Import Toast



const Withdraw: React.FC = () => {
    const { refetchBalance } = useUserBalanceContext(); // Get context values

    // Theme Colors
    const backgroundColor = useThemeColor({ light: '#EFFEF9', dark: '#000000' }, 'background');
    const cardBackgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#1A1A1A' }, 'card');
    const textColor = useThemeColor({ light: '#000000', dark: '#FFFFFF' }, 'text');
    const placeholderColor = useThemeColor({ light: '#A0A0A0', dark: '#CCCCCC' }, 'placeholder');
    const borderColor = useThemeColor({ light: '#22A45D', dark: '#157347' }, 'border');
    const noteBackgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#000000' }, 'noteBackground');
    const [modalVisible, setModalVisible] = useState(false);
    const [token, setToken] = useState<string | null>(null); // State to hold the token

    const [amount, setAmount] = useState('');
    const [selectedAccount, setSelectedAccount] = useState<{ id: string; account_name: string } | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const fetchedToken = await getFromStorage("authToken");
            setToken(fetchedToken);
            console.log("🔹 Retrieved Token: Payment Modal", fetchedToken);
        };

        fetchUserData();
    }, []);

    // ✅ Mutation for Withdrawal
    const { isPending: isPendingWithdrawal, mutate: mutateWithdrawal } = useMutation({
        mutationFn: (data: { amount: string, fee: string, bank_account_id: string }) => createWithdrawal({ data, token }),
        onSuccess: async (response) => {
            try {
                console.log("✅ Withdrawal Successful:", response);
                refetchBalance(); // Refetch balance after withdrawal

                // ✅ Show Success Toast
                Toast.show({
                    type: "success",
                    text1: "Success ✅",
                    text2: "Withdrawal Successful!",
                    visibilityTime: 3000,
                });
                const transactionId = response.data?.id;

                // ✅ Navigate after a delay
                setTimeout(() => {
                    router.push({
                        pathname: '/TransactionPage',
                        params: {
                            type: 'withdraw',
                            id: transactionId?.toString(), // ensure it's passed as string
                        },
                    });
                }, 3000);
            } catch (error) {
                console.error("❌ Error creating withdrawal:", error);
            }
        },
        onError: (error) => {
            console.error("❌ Withdrawal Failed:", error);

            // ✅ Show Error Toast
            Toast.show({
                type: "error",
                text1: "Error ❌",
                text2: error.message || "Withdrawal failed, please try again.",
                visibilityTime: 3000,
            });
        }
    });


    return (
        <ScrollView style={[styles.container, { backgroundColor }]}>
            {/* Header */}
            <Header />

            {/* Withdraw Button Section */}
            <BuyHead buttonText="Withdraw" />

            {/* Scrollable Content */}
            <View style={styles.content}>

                <View>
                    {/* Form Container */}
                    <View style={[styles.formContainer, { backgroundColor: cardBackgroundColor }]}>
                        {/* Amount Input */}
                        <Text style={[styles.label, { color: textColor }]}>Amount</Text>
                        <TextInput
                            style={[styles.input, { color: textColor, backgroundColor: cardBackgroundColor }]}
                            placeholder="Enter amount to withdraw"
                            placeholderTextColor={placeholderColor}
                            keyboardType="numeric"
                            value={amount}
                            onChangeText={setAmount}
                        />

                        {/* Receiving Account Dropdown */}
                        <Text style={[styles.label, { color: textColor }]}>Receiving Account</Text>
                        <TouchableOpacity style={[styles.dropdown, { backgroundColor: cardBackgroundColor }]} onPress={() => setModalVisible(true)}>
                            <Text style={{ color: selectedAccount ? textColor : placeholderColor }}>
                                {selectedAccount?.account_name || 'Choose Receiving Account'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Note Box */}
                    <View style={[styles.noteContainer, { borderColor, backgroundColor: noteBackgroundColor }]}>
                        <Text style={[styles.noteTitle, { color: textColor }]}>Note</Text>
                        <View style={styles.noteDivider} />
                        <Text style={[styles.noteText, { color: textColor }]}>
                            Withdrawals can take up to 2 days depending on the bank{'\n'}
                            Withdrawal account must match wallet name
                        </Text>
                    </View>
                </View>
            </View>


            <PaymentMethodModal
                title="Choose Account"
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSelectPaymentMethod={(method) => {
                    const { id, account_name } = method; // Destructure the passed object
                    setSelectedAccount({ id, account_name }); // Set both id and account_name
                    setModalVisible(false);
                }}
            />

            <Toast /> {/* ✅ Add Toast Component to Render */}
            <View style={styles.fixedButtonContainer}>
            {/* // Inside JSX: */}
                <PrimaryButton
                    title={isPendingWithdrawal ? "Processing..." : "Proceed"}
                    disabled={isPendingWithdrawal}
                    onPress={() => {
                        if (!amount || !selectedAccount) {
                            Toast.show({
                                type: "error",
                                text1: "Error",
                                text2: "Please enter an amount and select an account.",
                            });
                            return;
                        }

                        mutateWithdrawal({
                            amount,
                            fee: "0", // Adjust fee as needed
                            bank_account_id: selectedAccount?.id.toString() || "" // Convert `id` to string if it's a number
                        });
                    }}
                />

            </View>
        </ScrollView>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 100, // Ensures full height for absolute positioning
        marginTop: 25,

    },
    scrollContent: {

    },
    content: {
        justifyContent: 'space-between',
        marginTop: 20,
    },
    formContainer: {
        flexGrow: 1, // Expands to fill space
        borderRadius: 10,
        padding: 16,
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        marginHorizontal: 18,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        height: 45,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    dropdown: {
        height: 45,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 10,
        justifyContent: 'center',
    },

    // Note Box Styling
    noteContainer: {
        borderWidth: 1,
        borderRadius: 15, // Rounded edges
        marginHorizontal: 18,
        marginTop: 15,
    },
    noteTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
        paddingLeft: 12,
        paddingTop: 6,
    },

    noteDivider: {
        height: 1,
        backgroundColor: '#22A45D', // Green Divider
        marginBottom: 8,
    },
    noteText: {
        fontSize: 11,
        paddingVertical: 4,
        paddingLeft: 8,
        marginBottom: 2,
    },

    fixedButtonContainer: {
        position: 'absolute',
        bottom: -280,
        width: '90%',
        alignSelf: 'center', // Centers the button horizontally
    }
});

export default Withdraw;
