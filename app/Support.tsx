import React, { useEffect } from 'react';
import { View, ScrollView, StyleSheet, Image, Linking } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import Header from '@/components/Header';
import SupportOption from '@/components/Setting/Support/SupportOption';
import NewTicketForm from '@/components/Setting/Support/NewTicketForm';
import { images } from '@/constants';
import { useRouter, router } from 'expo-router';
import { getFromStorage } from '@/utils/storage';
import { getSingleTicket, getTickets } from '@/utils/queries/accountQueries';
import { useQuery } from '@tanstack/react-query';
const Support: React.FC = () => {
    const backgroundColor = useThemeColor({ light: '#EFFEF9', dark: '#000000' }, 'background');
    const [token, setToken] = React.useState<string | null>(null);
    useEffect(() => {
        const fetchToken = async () => {
            const fetchedToken = await getFromStorage("authToken");
            setToken(fetchedToken);
            console.log("🔹 Retrieved Token:", fetchedToken);
        };
        fetchToken();
    }, []);

    // Query to fetch tickets
    const { data: tickets, error: ticketsError, isLoading: ticketsLoading } = useQuery({
        queryKey: ["tickets"],
        queryFn: () => getTickets(token),
        enabled: !!token,
    });


    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
            <Header title="Support" />

            <View style={styles.subContainer}>
                {/* Image */}
                <Image source={images.support_girl} style={styles.image} />

                {/* Support Options */}
                <View style={styles.optionsContainer}>
                    <SupportOption title="Tickets" image={images.ticket} onPress={() => router.push("/Tickets")} notificationCount={tickets?.data?.length || 0} />
                    <SupportOption
                        title="Email Us"
                        image={images.email}
                        onPress={() => Linking.openURL('mailto:support@earlybazewallet.com')}
                    />
                    <SupportOption
                        title="Call Us"
                        image={images.call}
                        onPress={() => Linking.openURL('tel:+2348167258473')}
                    />
                </View>

                {/* New Ticket Form */}
                <NewTicketForm />
            </View>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingBottom: 20,
        paddingTop: 20,
    },
    subContainer: {
        paddingHorizontal: 16,
    },
    image: {
        width: '100%',
        height: 256,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
});

export default Support;
