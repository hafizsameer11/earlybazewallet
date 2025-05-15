import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import Header from '@/components/Header';
import NotificationTab from '@/components/Notification/NotificationTab';
import NotificationList from '@/components/Notification/NotificationList';

const Notification: React.FC = () => {
  const backgroundColor = useThemeColor({ light: '#EFFEF9', dark: '#000000' }, 'background');
  const [selectedTab, setSelectedTab] = useState('All');

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
      <Header title="Notification" />
      <NotificationTab selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <NotificationList selectedTab={selectedTab} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 20,
    paddingTop: 20,
  },
});

export default Notification;
