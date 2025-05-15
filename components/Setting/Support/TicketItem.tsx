import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useRouter } from 'expo-router';

interface TicketItemProps {
  id: string;
  title: string;
  date: string;
  status: 'Unanswered' | 'Answered';
  hasNotification: boolean;
  notificationCount?: number;
}

const TicketItem: React.FC<TicketItemProps> = ({ id, title, date, status, hasNotification, notificationCount }) => {
  const router = useRouter();

  const cardBackgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#1A1A1A' }, 'card');
  const textColor = useThemeColor({ light: '#222222', dark: '#FFFFFF' }, 'text');
  const borderColor = useThemeColor({ light: '#E5E5E5', dark: '#444444' }, 'border');
  const answeredColor = '#19D14A';
  const unansweredColor = '#D9D9D9';

  // Function to navigate and log ticket ID
  const handlePress = () => {
    console.log(`Navigating to Ticket ID: ${id}`);
    router.push(`/TicketChat?id=${id}`);
  };

  return (
    <TouchableOpacity style={[styles.container, { backgroundColor: cardBackgroundColor, borderColor }]} onPress={handlePress}>
      {/* Left Side (User Avatar Placeholder) */}
      <View style={styles.avatarPlaceholder} />

      {/* Ticket Details */}
      <View style={styles.content}>
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
        <Text style={[styles.date, { color: textColor }]}>{date}</Text>
      </View>

      {/* Right Side */}
      <View style={styles.rightSide}>
        {/* Status Badge */}
        <View style={[styles.statusBadge, { backgroundColor: status === 'Answered' ? answeredColor : unansweredColor }]}>
          <Text style={styles.statusText}>{status}</Text>
        </View>

        {/* Notification Badge */}
        {/* {hasNotification && (
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationText}>{notificationCount}</Text>
          </View>
        )} */}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D3D3D3',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 10,
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  rightSide: {
    alignItems: 'flex-end',
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  notificationBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    marginTop: 8,
  },
  notificationText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default TicketItem;
