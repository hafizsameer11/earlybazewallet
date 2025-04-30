import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    Platform,
    Text
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useLocalSearchParams } from 'expo-router';
import Header from '@/components/Header';
import TicketDetails from '@/components/Setting/Support/TicketDetails';
import ChatMessage from '@/components/Setting/Support/ChatMessage';
import { Ionicons, Entypo } from '@expo/vector-icons';


//Code related to the integration:
import { getSingleTicket } from "@/utils/queries/accountQueries";
import { useQuery } from "@tanstack/react-query";
import { getFromStorage } from "@/utils/storage";
import { createReplyTicket } from "@/utils/mutations/accountMutations";
import { useMutation } from '@tanstack/react-query';


interface IReply {
    id: number;
    ticket_id: number;
    message: string;
    attachment: string | null;
    sender_type: "user" | "support"; // Ensure sender type is valid
    created_at: string;
    updated_at: string;
}

const TicketChat: React.FC = () => {
    const [token, setToken] = useState<string | null>(null);
    const backgroundColor = useThemeColor({ light: '#EFFEF9', dark: '#000000' }, 'background');
    const inputBackground = useThemeColor({ light: '#E5E5E5', dark: '#1A1A1A' }, 'inputBackground');
    const textColor = useThemeColor({ light: '#222222', dark: '#FFFFFF' }, 'text');
    const chatBackgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#1A1A1A' }, 'card');

    const { id } = useLocalSearchParams();
    const [messages, setMessages] = useState<IReply[]>([]);
    const [messageText, setMessageText] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const fetchedToken = await getFromStorage("authToken");
            setToken(fetchedToken);
            console.log("🔹 Retrieved Token:", fetchedToken);
        };
        fetchUserData();
    }, []);

    const { data: ticket, error: ticketError, isLoading: ticketLoading, refetch } = useQuery({
        queryKey: ["ticket", id],
        queryFn: () => getSingleTicket(token, id),
        enabled: !!token, // ✅ Keeps query disabled if token is missing
    });

    // ✅ Use `useEffect` to handle API response
    useEffect(() => {
        if (ticket?.data?.replies && Array.isArray(ticket.data.replies)) {
            console.log("🔹 Full Ticket Data:", ticket);
            console.log("🔹 Ticket Replies:", ticket.data.replies);

            setMessages(ticket.data.replies); // ✅ Updates messages
        } else {
            setMessages([]); // ✅ Ensure messages are not undefined
        }
    }, [ticket]); // ✅ Runs whenever `ticket` changes


    console.log("🔹 Ticket Data:", ticket);

    const { mutate: createReply } = useMutation({
        mutationFn: createReplyTicket,
        onSuccess: (_, variables) => {
            console.log("✅ Reply created successfully");

            const newReply: IReply = {
                id: Date.now(),
                ticket_id: parseInt(id as string, 10),
                message: variables.data.message,
                attachment: null,
                sender_type: "user",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };

            setMessages((prevMessages) => [...prevMessages, newReply]);
            setMessageText('');
            setSelectedImage(null);
            setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
            refetch(); // Refresh ticket data
        },
        onError: (error) => {
            console.error("❌ Reply creation failed:", error);
        },
    });

    const sendMessage = () => {
        if (messageText.trim().length > 0 && token) {
            createReply({
                data: { ticket_id: id as string, message: messageText },
                token: token,
            });
        }
    };

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Header title={`Ticket ${id}`} />

            {ticketLoading ? (
                <Text>Loading...</Text>
            ) : ticketError ? (
                <Text>Error fetching ticket details</Text>
            ) : (
                ticket?.data && (
                    <TicketDetails
                        status={ticket.data.status}
                        name={ticket?.data.user?.name}
                        subject={ticket.data.subject}
                        priority="High"
                        dateCreated={new Date(ticket.data.created_at).toLocaleString()}
                    />
                )
            )}

            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <ScrollView
                    ref={scrollViewRef}
                    contentContainerStyle={[styles.chatContainer, { backgroundColor: chatBackgroundColor }]}
                    onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                >
                    {messages.length > 0 ? (
                        messages.map((msg) => (
                            <ChatMessage
                                key={msg.id}
                                sender={msg.sender_type}
                                text={msg.message}
                                time={new Date(msg.created_at).toLocaleTimeString()}
                                isUser={msg.sender_type === "user"}
                            />
                        ))
                    ) : (
                        <Text style={{ textAlign: 'center', color: textColor, marginTop: 20 }}>
                            No replies yet.
                        </Text>
                    )}

                    {selectedImage && <Image source={{ uri: selectedImage }} style={styles.previewImage} />}
                </ScrollView>

                <View style={[styles.inputContainer, { backgroundColor: inputBackground }]}>
                    <TextInput
                        style={[styles.input, { color: textColor }]}
                        placeholder="Type a message..."
                        placeholderTextColor="#666"
                        value={messageText}
                        onChangeText={setMessageText}
                    />
                    <TouchableOpacity onPress={sendMessage}>
                        <Ionicons name="send" size={20} color="#333" style={styles.icon} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 25,
    },
    chatContainer: {
        padding: 16,
        flexGrow: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 25,
        marginHorizontal: 10,
        marginBottom: 10,
    },
    input: {
        flex: 1,
        fontSize: 14,
        paddingHorizontal: 10,
    },
    icon: {
        paddingHorizontal: 10,
    },
    previewImage: {
        width: 200,
        height: 150,
        borderRadius: 10,
        alignSelf: 'flex-end', // Align to the right like user messages
        marginVertical: 10,
    },
});

export default TicketChat;
