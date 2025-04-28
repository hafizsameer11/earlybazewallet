import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface TabSwitcherProps {
    selectedTab: 'Internal Transfer' | 'Crypto Address';
    setSelectedTab: (tab: 'Crypto Address' | 'Internal Transfer') => void;
}

const TabSwitcher: React.FC<TabSwitcherProps> = ({ selectedTab, setSelectedTab }) => {
    // Theme-based colors
    const tabBackgroundColor = useThemeColor({ light: '#F6F6F6', dark: '#2A2A2A' }, 'tabBackground');
    const activeTabColor = useThemeColor({ light: '#25AE7A', dark: '#0B845B' }, 'activeTab');
    const tabTextColor = useThemeColor({ light: '#999', dark: '#FFFFFF' }, 'tabText'); // 🔥 White text in dark mode
    const activeTabTextColor = useThemeColor({ light: '#FFFFFF', dark: '#E5E5E5' }, 'activeTabText');

    return (
        <View style={[styles.tabContainer, { backgroundColor: tabBackgroundColor }]}>
            {/*
            <TouchableOpacity
                style={[styles.tabButton, selectedTab === 'Crypto Address' && { backgroundColor: activeTabColor }]}
                onPress={() => setSelectedTab('Crypto Address')}>
                <Text style={[styles.tabText, { color: selectedTab === 'Crypto Address' ? activeTabTextColor : tabTextColor }]}>
                    Crypto Address
                </Text>
            </TouchableOpacity>
            */}

            <TouchableOpacity
                style={[styles.tabButton, selectedTab === 'Internal Transfer' && { backgroundColor: activeTabColor }]}
                onPress={() => setSelectedTab('Internal Transfer')}>
                <Text style={[styles.tabText, { color: selectedTab === 'Internal Transfer' ? activeTabTextColor : tabTextColor }]}>
                    Internal Transfer
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        borderRadius: 12,
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 4,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 10,
    },
    tabText: {
        fontSize: 13,
        fontWeight: '600',
    },
});

export default TabSwitcher;
