import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { icons } from '@/constants';
interface AccountCardProps {
    accountName: string;
    bankName: string;
    accountNumber: string;
    title?: string;
    isDefault?: boolean;
    onEdit: () => void;
    onDelete: () => void;
}

const AccountCard: React.FC<AccountCardProps> = ({
    accountName,
    bankName,
    accountNumber,
    isDefault = false,
    title,
    onEdit,
    onDelete,
}) => {
    const cardBackgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#1A1A1A' }, 'card');
    const textColor = useThemeColor({ light: '#222222', dark: '#FFFFFF' }, 'text');
    const labelTextColor = useThemeColor({ light: '#777777', dark: '#AAAAAA' }, 'text');
    return (
        <View style={[styles.cardContainer, { backgroundColor: cardBackgroundColor }]}>
            {/* Header Section */}
            <View style={styles.header}>
                <View style={styles.tab}>
                    <Text style={styles.accountTitle}>{title}</Text>
                </View>
                {isDefault && <View style={styles.tabDefault}>
                    <Text style={styles.defaultTag}>Default</Text>
                </View>}
            </View>

            {/* Account Details */}
            <View style={styles.details}>
                <View style={styles.row}>
                    <Text style={[styles.label, { color: labelTextColor }]}>Bank Name</Text>
                    <Text style={[styles.value, { color: textColor }]}>{bankName}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={[styles.label, { color: labelTextColor }]}>Account Name</Text>
                    <Text style={[styles.value, { color: textColor }]}>{accountName}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={[styles.label, { color: labelTextColor }]}>Account Number</Text>
                    <Text style={[styles.value, { color: textColor }]}>{accountNumber}</Text>
                </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actions}>
                <TouchableOpacity style={styles.iconButton} onPress={onEdit}>
                    <Image source={icons.edit} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={onDelete}>
                    <Ionicons name="trash-outline" size={20} color="red" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        borderRadius: 10,
        padding: 15,
        marginBottom: 40,
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        backgroundColor: '#FFFFFF',
    },
    header: {
        position: 'absolute',
        top: -28,
        flexDirection: 'row',
        alignItems: 'center',
    },
    tab: {
        width: 110,
        backgroundColor: '#17A167',
        paddingHorizontal: 15,
        paddingVertical: 4,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 60,
        borderBottomLeftRadius: 0,  // Add this line if you want rounded corners on the bottom as well
        borderBottomRightRadius: 0, // Add this line if you want rounded corners on the bottom as well
    },
    accountTitle: {
        fontSize: 14,
        color: '#FFFFFF',
        fontFamily: 'Caprasimo'

    },
    tabDefault: {
        backgroundColor: '#C8C8C84D',
        alignSelf: 'center',
        width: 70,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        borderTopRightRadius: 90,
        borderBottomLeftRadius: 0,  // Add this line if you want rounded corners on the bottom as well
        borderBottomRightRadius: 0, // Add this line if you want rounded corners on the bottom as well
    },

    defaultTag: {
        fontSize: 12,
        fontWeight: '600',
        color: '#17A167',
    },
    details: {
        marginTop: 10,
        borderBottomColor: '#E5E5E5',
        borderBottomWidth: 1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    label: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#777',
    },
    value: {
        fontSize: 14,
        fontWeight: '500',
        color: '#000',
    },
    actions: {
        flexDirection: 'row',
        marginTop: 15,
    },
    iconButton: {
        backgroundColor: '#EFFEF9',
        padding: 10,
        borderRadius: 50,
        marginHorizontal: 5,
    },
});

export default AccountCard;
