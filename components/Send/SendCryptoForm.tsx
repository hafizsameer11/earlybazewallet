import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    Modal,
    Alert
} from 'react-native';
// import { BarCodeScanner } from 'expo-barcode-scanner';
import { useThemeColor } from '@/hooks/useThemeColor';
import { images } from '@/constants';

interface SendCryptoFormProps {
    selectedTab: 'Crypto Address' | 'Internal Transfer';
    setSelectedTab: (tab: 'Crypto Address' | 'Internal Transfer') => void;
}
import TabSwitcher from './TabSwitcher';
import QrModal from './QrModal';

import SelectionBox from '@/components/Buy/SelectionBox';
import InputField from '@/components/Buy/InputField';
import networkOptions from '@/constants/networkOptions.json';
import NetworkSelectionModal from '../Receive/NetworkSelectionModal';


//Code realted to the integration:

import { useMutation } from '@tanstack/react-query';
import { calculateExchangeRate } from "@/utils/mutations/accountMutations";
import { getFromStorage } from "@/utils/storage";



const SendCryptoForm: React.FC<{
    selectedTab: 'Internal Transfer';
    setSelectedTab: React.Dispatch<React.SetStateAction<'Crypto Address' | 'Internal Transfer'>>;
    selectedCoin: any;
    setSelectedCoin: React.Dispatch<React.SetStateAction<any>>;
    selectedNetwork: any;
    setSelectedNetwork: React.Dispatch<React.SetStateAction<any>>;
    usdAmount: string;
    setUsdAmount: React.Dispatch<React.SetStateAction<string>>;
    scannedAddress: string;
    setScannedAddress: React.Dispatch<React.SetStateAction<string>>;
    assetData: { assestId: string; icon: string; assetName: string; balance: string };
    setConverted: React.Dispatch<React.SetStateAction<string>>;
    converted: string;

    // ✅ New prop to lift fee data up to parent
    onFeeChange: (fee: {
        platform_fee_usd: string;
        blockchain_fee_usd: string;
        total_fee_usd: string;
        amount_after_fee: string;
    }) => void;
}> = ({
    selectedTab,
    setSelectedTab,
    selectedCoin,
    setSelectedCoin,
    selectedNetwork,
    setSelectedNetwork,
    usdAmount,
    setUsdAmount,
    scannedAddress,
    setScannedAddress,
    assetData,
    onFeeChange, // ✅ Receive prop,
    setConverted,
    converted,
}) => {
        const [token, setToken] = useState<string | null>(null);
        const cardBackgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#1A1A1A' }, 'card');
        const textColor = useThemeColor({ light: '#222222', dark: '#FFFFFF' }, 'text');
        const borderColor = useThemeColor({ light: '#E5E5E5', dark: '#333333' }, 'border');
        const [lastEditedField, setLastEditedField] = useState<'usd' | 'coin'>('usd');
        const lastCalledAmountRef = useRef<string | null>(null);
        const lastUpdatedByRef = useRef<'usd' | 'coin' | null>(null);

        const [feeData, setFeeData] = useState({
            platform_fee_usd: "0.00",
            blockchain_fee_usd: "0.00",
            total_fee_usd: "0.00",
            amount_after_fee: "0.00"
        });

        const { assestId, icon, assetName } = assetData;  // Access individual properties

        const [convertedAmount, setConvertedAmount] = useState("0.00");
        const convertedAmountRef = useRef("0.00");
        const ngnAmountRef = useRef("0.00");


        const [isScannerOpen, setIsScannerOpen] = useState(false);
        const [modalType, setModalType] = useState<string | null>(null);
        const [modalVisible, setModalVisible] = useState(false);

        const scan = useThemeColor({ light: images.scan, dark: images.scan_black }, 'scan');
        const didMountRef = useRef(false); // ⬅️ Add this at the top of your component
        const feeLabelColor = useThemeColor({ light: '#666', dark: '#aaa' }, 'text');
        const feeValueColor = useThemeColor({ light: '#111', dark: '#fff' }, 'text');
        const feeTitleColor = useThemeColor({ light: '#222', dark: '#fff' }, 'text');

        // Ensure selectedCoin and selectedNetwork are never null
        const coinId = selectedCoin?.id?.toString() || assestId || undefined;

        const handleSelectNetwork = (network: any) => {
            if (modalType === "coin") {
                setSelectedCoin(network);
            } else if (modalType === "network") {
                setSelectedNetwork(network);
            }
            setModalVisible(false);
        };

        // Fetch the token and user data when the component mounts
        useEffect(() => {
            const fetchUserData = async () => {
                const fetchedToken = await getFromStorage("authToken");
                setToken(fetchedToken);
                // console.log("🔹 Retrieved Token:", fetchedToken);
            };

            fetchUserData();
        }, []);

        const { mutate: getExchangeRate } = useMutation({
            mutationFn: ({
                data,
                token,
            }: {
                data: { currency: string; amount: string, type: string, to: string, amount_in: string };
                token: string;
            }) => calculateExchangeRate({ data, token }),

            onSuccess: (response) => {
                const { amount_usd, fee_summary } = response.data;
                const updatedUsd = amount_usd ?? "0.00";

                // Prevent loop: only update the field NOT responsible for current input
                if (lastEditedField === "usd") {
                    setConvertedAmount(updatedUsd);
                    console.log("The updated usd amount", updatedUsd);
                    setConverted(updatedUsd);
                } else if (lastEditedField === "coin") {
                    console.log("The updated coin amount", updatedUsd);
                    if (lastUpdatedByRef.current !== "usd") {
                        setUsdAmount(updatedUsd);
                    }
                }

                if (fee_summary) {
                    const updatedFees = {
                        platform_fee_usd: fee_summary.platform_fee_usd ?? "0.00",
                        blockchain_fee_usd: fee_summary.blockchain_fee_usd ?? "0.00",
                        total_fee_usd: fee_summary.total_fee_usd ?? "0.00",
                        amount_after_fee: fee_summary.amount_after_fee ?? "0.00",
                    };
                    setFeeData(updatedFees);
                    onFeeChange?.(updatedFees);
                }
            },

            onError: (error: any) => {
                console.error('❌ Error fetching exchange rate:', error);
            },
        });

        const openModal = (type: string) => {
            setModalType(type);
            setModalVisible(true);
        };
        useEffect(() => {
            if (assetName && assestId && icon) {
                setSelectedCoin({
                    id: assestId,
                    name: assetName,
                    icon: icon,
                });
                setModalType("coin");
                setModalVisible(true);
            }
        }, [assetName, assestId, icon]);

        useEffect(() => {
            if (!didMountRef.current) {
                didMountRef.current = true;
                return;
            }

            if (!token || !selectedCoin?.name) return;

            const amountToSend = lastEditedField === 'usd' ? usdAmount : convertedAmount;

            // Avoid triggering if same amount is already used
            if (lastCalledAmountRef.current === amountToSend) return;
            if (!amountToSend || isNaN(Number(amountToSend)) || parseFloat(amountToSend) <= 0) return;

            lastCalledAmountRef.current = amountToSend;

            getExchangeRate({
                data: {
                    currency: selectedCoin.name.toLowerCase(),
                    amount: amountToSend,
                    type: "send",
                    to: scannedAddress,
                    amount_in: lastEditedField,
                },
                token,
            });
        }, [usdAmount, convertedAmount, token, selectedCoin?.name, scannedAddress, lastEditedField]);

        const validateBalance = () => {
            const enteredAmount = parseFloat(usdAmount || "0");
            const availableBalance = parseFloat(assetData.balance || "0");

            if (enteredAmount > availableBalance) {
                Alert.alert(
                    "Insufficient Balance",
                    "You don't have enough balance. Please buy crypto first.",
                    [{ text: "OK" }]
                );
                return false;
            }

            return true;
        };


        function formatSmartDecimal(value: string | number): string {
            const num = parseFloat(String(value));
            if (isNaN(num)) return '0.00';

            const fixed = num.toFixed(8); // Max 8 decimal places
            const trimmed = fixed
                .replace(/(\.\d*?[1-9])0+$/g, '$1') // remove trailing zeros after last significant digit
                .replace(/\.0+$/, '.00'); // if only .0 or .00 etc., convert to .00

            const [intPart, decPart] = trimmed.split('.');
            if (!decPart) return `${intPart}.00`;
            if (decPart.length === 1) return `${intPart}.${decPart}0`;

            return trimmed;
        }

        return (
            <View style={styles.container}>
                <TabSwitcher selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

                {/* Main Card Container */}
                <View style={[styles.mainContainer, { backgroundColor: cardBackgroundColor, borderColor }]}>
                    {/* ✅ Input Address Field */}
                    <View style={[styles.inputContainer, { borderColor }]}>
                        <TextInput
                            placeholder={selectedTab === "Internal Transfer" ? "Enter Email" : "Input Address"}
                            placeholderTextColor="#A1A1A1"
                            style={[styles.inputField, { color: textColor }]}
                            value={scannedAddress}
                            onChangeText={setScannedAddress}
                        />
                        {/* <TouchableOpacity onPress={() => setIsScannerOpen(true)}>
                            <Image source={scan} style={styles.scanIcon} />
                        </TouchableOpacity> */}
                    </View>

                    {/* ✅ Amount and Currency Selection */}
                    <View style={styles.exchangeContainer}>


                        <SelectionBox
                            label="Coin"
                            id={selectedCoin?.id || assestId}
                            value={selectedCoin?.name || assetName}
                            icon={selectedCoin?.icon || icon}
                        // onPress={() => {
                        //     openModal("coin");
                        // }}
                        />
                        <SelectionBox
                            label="Network"
                            id={selectedNetwork.id}
                            value={selectedNetwork.name || "Select"}
                            icon={selectedNetwork?.icon || images.dummy}
                            onPress={coinId ? () => openModal("network") : undefined}
                            disabled={!coinId}
                            style={!coinId ? { opacity: 0.5 } : undefined}
                        />

                    </View>

                    {/* ✅ Network Selection */}
                    <View style={styles.selectionContainer}>
                        <View style={{ flex: 1 }}>
                            <InputField
                                label={"Amount in USD Dollars"}
                                value={usdAmount}
                                onChange={(val) => {
                                    setUsdAmount(val)
                                    lastUpdatedByRef.current = "usd";
                                    lastCalledAmountRef.current = null; // ✅ reset here too


                                }}
                                onEndEditing={() => {
                                    const entered = parseFloat(convertedAmount || "0");
                                    const available = parseFloat(assetData.balance || "0");

                                    if (entered > available) {
                                        Alert.alert(
                                            "Insufficient Balance",
                                            "You don't have enough balance. Resetting to your available balance.",
                                            [{ text: "OK" }]
                                        );

                                        const adjusted = available.toFixed(10);
                                        setConvertedAmount(adjusted);
                                        setConverted(adjusted);

                                        const currentRate = parseFloat(usdAmount) / parseFloat(convertedAmount || "1");
                                        const adjustedUsd = (parseFloat(adjusted) * currentRate).toFixed(2);
                                        setUsdAmount(adjustedUsd);
                                    }
                                }}
                            />

                        </View>
                        <View>
                            <InputField
                                label={`Amount in ${selectedCoin?.name}`}
                                value={convertedAmount}
                                onChange={(val) => {
                                    setConvertedAmount(val);
                                    setLastEditedField('coin'); // Mark as coin input
                                    lastUpdatedByRef.current = "coin";
                                    lastCalledAmountRef.current = null; // ✅ Reset to force API re-call when switching back

                                }} editable={true}
                            />
                        </View>
                    </View>

                </View>

                {coinId && (
                    <NetworkSelectionModal
                        visible={modalVisible}
                        onClose={() => setModalVisible(false)}
                        onSelectNetwork={handleSelectNetwork}
                        selectedNetwork={selectedNetwork}
                        networks={networkOptions}
                        modelType={modalType}
                        coinId={selectedCoin?.id || assestId}
                        assetName={assetName}
                    />
                )}

                {/* ✅ Fee Summary Section */}
                <View style={[styles.feeSummaryBox, { backgroundColor: cardBackgroundColor, borderColor }]}>
                    <Text style={[styles.feeTitle, { color: feeTitleColor }]}>Fee Breakdown</Text>

                    {/* <View style={styles.feeRow}>
                        <Text style={[styles.feeLabel, { color: feeLabelColor }]}>Platform Fee</Text>
                        <Text style={[styles.feeValue, { color: feeValueColor }]}>${feeData.platform_fee_usd}</Text>
                    </View>

                    <View style={styles.feeRow}>
                        <Text style={[styles.feeLabel, { color: feeLabelColor }]}>Network Fee</Text>
                        <Text style={[styles.feeValue, { color: feeValueColor }]}>${feeData.blockchain_fee_usd}</Text>
                    </View> */}

                    <View style={styles.feeRow}>
                        <Text style={[styles.feeLabel, { color: feeLabelColor }]}>Total Fee</Text>
                        <Text style={[styles.feeValue, { color: feeValueColor }]}>
                            ${formatSmartDecimal(feeData.total_fee_usd)}
                        </Text>
                    </View>

                    <View style={[styles.feeRow, { marginTop: 10 }]}>
                        <Text style={[styles.feeLabel, { fontWeight: 'bold', color: feeLabelColor }]}>You Will Send</Text>
                        <Text style={[styles.feeValue, { fontWeight: 'bold', color: feeValueColor }]}>
                            ${formatSmartDecimal(feeData.amount_after_fee)}
                        </Text>

                    </View>
                </View>


                {/* ✅ QR Scanner Modal */}
                <QrModal
                    isVisible={isScannerOpen}
                    onClose={() => setIsScannerOpen(false)}
                    onAddressScanned={(address: string) => {
                        setScannedAddress(address);           // ✅ Set scanned address
                        setIsScannerOpen(false);              // ✅ Close modal after scanning
                    }}
                />
            </View>
        );
    };


const styles = StyleSheet.create({
    feeSummaryBox: {
        marginHorizontal: 16,
        marginTop: -7,
        // backgroundColor: cardBackgroundColor,
        borderRadius: 10,
        padding: 12,
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    feeTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        color: '#222',
    },
    feeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 3,
    },
    feeLabel: {
        fontSize: 12,
        color: '#666',
    },
    feeValue: {
        fontSize: 12,
        color: '#111',
    },

    container: {
        marginTop: 27,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#F6F6F6',
        borderRadius: 12,
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 4,
    },
    exchangeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        gap: 8,
        paddingHorizontal: 16,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 10,
    },
    mainContainer: {
        borderRadius: 12,
        marginHorizontal: 16,
        paddingVertical: 16,
        marginBottom: 16,
        borderWidth: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 14,
        borderRadius: 10,
        marginHorizontal: 12,
        borderWidth: 1,
    },
    inputField: {
        fontSize: 14,
        flex: 1,
    },
    scanIcon: {
        width: 20,
        height: 20,
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
    },
    amountBox: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 10,
        // alignItems: 'center',
        borderWidth: 1,
    },
    amountLabel: {
        fontSize: 12,
        color: '#999',
        alignSelf: 'flex-start',
    },
    amountValue: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 4,
    },
    maxText: {
        fontSize: 12,
        color: '#25AE7A',
        position: 'absolute',
        right: 2,
        top: 17,

    },
    swapButton: {
        padding: 14,
        borderRadius: 50,
        marginHorizontal: 8,
        borderWidth: 2,
        position: 'absolute',
        zIndex: 1,
        top: '70%',
    },

    swapIcon: {
        width: 28,
        height: 28,
    },
    selectionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        gap: 1,
        paddingHorizontal: 16,
    },
    selectionBox: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 10,
        marginHorizontal: 6,
        borderWidth: 1,
    },
    selectionLabel: {
        fontSize: 12,
        color: '#999',
        marginBottom: 4,
    },
    coinWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    coinText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    coinIcon: {
        width: 28,
        height: 28,
    },
});

export default SendCryptoForm;
