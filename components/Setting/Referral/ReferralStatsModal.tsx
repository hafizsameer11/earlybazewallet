import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Modal,
    TouchableWithoutFeedback,
} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';

type ReferralStatsModalProps = {
    totalEarnings: number;
    totalWithdrawals: number;
    numberOfReferrals: number;
    totalTrades: number;
    visible: boolean;
    onClose: () => void;
};

const ReferralStatsModal: React.FC<ReferralStatsModalProps> = ({
    totalEarnings,
    totalWithdrawals,
    numberOfReferrals,
    totalTrades,
    visible,
    onClose,
}) => {
    const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'year'>('month');
    const [showDropdown, setShowDropdown] = useState(false);

    const backgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#1A1A1A' }, 'background');
    const headerColor = useThemeColor({ light: '#22A45D', dark: '#22A45D' }, 'text');
    const textColor = useThemeColor({ light: '#000', dark: '#fff' }, 'text');

    const toggleDropdown = () => {
        setShowDropdown((prev) => !prev);
    };

    const handleSelect = (period: 'month' | 'year') => {
        setSelectedPeriod(period);
        setShowDropdown(false);
    };

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay} />
            </TouchableWithoutFeedback>

            <View style={[styles.modalContainer, { backgroundColor }]}>
                <ScrollView contentContainerStyle={styles.container}>
                    {/* Header */}
                    <View style={styles.headerContainer}>
                        <Text style={[styles.headerText, { color: headerColor }]}>Referral Stats</Text>

                        <View style={styles.headerRight}>
                            <View>
                                <TouchableOpacity style={styles.dropdown} onPress={toggleDropdown}>
                                    <Text style={[styles.dropdownText, { color: textColor }]}>
                                        {selectedPeriod === 'month' ? 'This Month' : 'This Year'}
                                    </Text>
                                    <Ionicons name="chevron-down" size={16} color="#000" />
                                </TouchableOpacity>

                                {showDropdown && (
                                    <View style={styles.dropdownMenu}>
                                        <TouchableOpacity onPress={() => handleSelect('month')}>
                                            <Text style={styles.dropdownItem}>This Month</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handleSelect('year')}>
                                            <Text style={styles.dropdownItem}>This Year</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>

                            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                                <Ionicons name="close" size={20} color="#000" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Divider */}
                    <View style={styles.divider} />

                    {/* Stats */}
                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={[styles.label, { color: textColor }]}>Total Earnings</Text>
                            <Text style={[styles.value, { color: textColor }]}>${totalEarnings}</Text>
                        </View>

                        <View style={styles.statItem}>
                            <Text style={[styles.label, { color: textColor }]}>Total Withdrawals</Text>
                            <Text style={[styles.value, { color: textColor }]}>${totalWithdrawals}</Text>
                        </View>

                        <View style={styles.statItem}>
                            <Text style={[styles.label, { color: textColor }]}>No of referrals</Text>
                            <Text style={[styles.value, { color: textColor }]}>{numberOfReferrals}</Text>
                        </View>

                        <View style={styles.statItem}>
                            <Text style={[styles.label, { color: textColor }]}>
                                Total Trades completed by referrals
                            </Text>
                            <Text style={[styles.value, { color: textColor }]}>{totalTrades}</Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        maxHeight: '80%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 16,
    },
    container: {
        paddingBottom: 32,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        marginRight: 10,
    },
    dropdownText: {
        fontSize: 14,
        marginRight: 5,
        color: '#000',
    },
    closeButton: {
        backgroundColor: '#F0F0F0',
        borderRadius: 999,
        padding: 6,
    },
    divider: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginVertical: 12,
    },
    statsContainer: {
        gap: 20,
    },
    statItem: {
        marginBottom: 4,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 4,
    },
    value: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    dropdownMenu: {
        position: 'absolute',
        top: 40,
        left: 0,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 999,
    },
    dropdownItem: {
        padding: 10,
        fontSize: 14,
        color: '#000',
    },
});

export default ReferralStatsModal;
