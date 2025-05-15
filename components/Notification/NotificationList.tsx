import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import NotificationItem from '@/components/Notification/NotificationItem';

import { useQuery } from '@tanstack/react-query';
import { getFromStorage } from '@/utils/storage';
import { getAllNotifications } from '@/utils/queries/appQueries';

const BASE_URL = "https://earlybaze.hmstech.xyz/storage/";

interface NotificationListProps {
  selectedTab: string; // 'All' | 'System Notification' | 'Announcement'
}

const NotificationList: React.FC<NotificationListProps> = ({ selectedTab }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const fetchedToken = await getFromStorage("authToken");
      setToken(fetchedToken);
      console.log("🔹 Retrieved Token:", fetchedToken);
    };
    fetchUserData();
  }, []);

  const { data: notificationResponse, error, isLoading } = useQuery({
    queryKey: ["notifications", token],
    queryFn: () => getAllNotifications({ token }),
    enabled: !!token,
  });

  const allNotifications = notificationResponse?.data || [];

  // ✅ Filter based on selected tab
  const filteredNotifications = allNotifications.filter((item: any) => {
    if (selectedTab === 'All') return true;
    if (selectedTab === 'System Notification') return item.type === 'system';
    if (selectedTab === 'Announcement') return item.type === 'announcement';
    return false;
  });

  const mappedNotifications = filteredNotifications.map((item: any) => ({
    id: item.id,
    title: item.title,
    message: item.message,
    timestamp: new Date(item.created_at).toLocaleString(),
    isUnread: item.status === "active",
    imageUrl: item.attachment ? { uri: `${BASE_URL}${item.attachment}` } : null,
  }));

  return (
    <View style={styles.listContainer}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#25AE7A" />
      ) : error ? (
        <Text style={styles.errorText}>Failed to load notifications</Text>
      ) : mappedNotifications.length === 0 ? (
        <Text style={styles.errorText}>No {selectedTab.toLowerCase()} available</Text>
      ) : (
        mappedNotifications.map((notification) => (
          <NotificationItem key={notification.id} {...notification} />
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
});

export default NotificationList;
