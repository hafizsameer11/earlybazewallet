import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from '@/components/Buy/PrimaryButton';
import PrioritySelector from './PrioritySelector';
import SubjectSelectionModal from './SubjectSelectionModal'; // Import the new component
import { router } from 'expo-router';


//Code related to the integration:
import { createSupportTicket } from "@/utils/mutations/accountMutations";
import { useMutation } from "@tanstack/react-query";
import { getFromStorage } from "@/utils/storage";


const NewTicketForm: React.FC = () => {
  const [token, setToken] = useState<string | null>(null); // State to hold the token
  const cardBackgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#1A1A1A' }, 'card');
  const textColor = useThemeColor({ light: '#222222', dark: '#FFFFFF' }, 'text');
  const placeholderColor = useThemeColor({ light: '#888888', dark: '#CCCCCC' }, 'placeholder');
  const titleColor = useThemeColor({ light: '#0C5E3F', dark: '#FFFFFF' }, 'title');
  const borderColor = useThemeColor({ light: '#E5E5E5', dark: '#444444' }, 'border');

  const [priority, setPriority] = useState('Low');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [subjectError, setSubjectError] = useState<boolean>(false);
  const [messageError, setMessageError] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Track loading state



  // Fetch the token and user data when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      const fetchedToken = await getFromStorage("authToken");
      setToken(fetchedToken);
      console.log("🔹 Retrieved Token:", fetchedToken);
    };

    fetchUserData();
  }, []);

  // Mutation to create a new support ticket
  const { isPending, mutate: createTicket } = useMutation({
    mutationFn: (data: any) => createSupportTicket({ data, token }),
    onSuccess: () => {
      console.log("🔹 Ticket created successfully!");
      setIsSubmitting(false);
      router.push('/Tickets');
    },
    onError: (error) => {
      console.error("🔴 Error creating ticket:", error);
      setIsSubmitting(false);
    },
  });


  return (
    <View style={[styles.container, { backgroundColor: cardBackgroundColor }]}>

      {/* Title */}
      <Text style={[styles.title, { color: titleColor }]}>New Ticket</Text>

      {/* Subject Label */}
      <Text style={[styles.label, { color: textColor }]}>Subject</Text>
      <TouchableOpacity
        style={[
          styles.dropdownContainer,
          { borderColor: subjectError ? 'red' : borderColor },
        ]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.subjectText, { color: selectedSubject ? textColor : placeholderColor }]}>
          {selectedSubject || 'Enter subject'}
        </Text>
        <Ionicons name="chevron-down" size={20} color={textColor} />
      </TouchableOpacity>


      {/* Message Label */}
      <Text style={[styles.label, { color: textColor }]}>Message</Text>
      <TextInput
        style={[
          styles.textarea,
          { color: textColor, borderColor: messageError ? 'red' : borderColor },
        ]}
        placeholder="Type your message"
        placeholderTextColor={placeholderColor}
        multiline
        value={message}
        onChangeText={setMessage}
      />

      {/* Priority Label */}
      <Text style={[styles.label, { color: textColor }]}>Priority</Text>
      <PrioritySelector onSelect={setPriority} />

      {/* Submit Button */}
      <View style={{ marginTop: 20 }}>
        <PrimaryButton
          title={isSubmitting ? "Sending..." : "Send"}
          onPress={() => {
            if (!selectedSubject) {
              setSubjectError(true);
            } else {
              setSubjectError(false);
            }
            if (!message) {
              setMessageError(true);
            } else {
              setMessageError(false);
            }

            if (selectedSubject && message) {
              setIsSubmitting(true);
              createTicket({ subject: selectedSubject, issue: message });
            }
          }}
          disabled={isSubmitting}
        />

      </View>

      {/* Pass necessary props to the SubjectSelectionModal component */}
      <SubjectSelectionModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        selectedSubject={selectedSubject}
        setSelectedSubject={setSelectedSubject}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    alignSelf: 'center',
    fontFamily: 'Caprasimo',
  },
  label: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectText: {
    fontSize: 14,
  },
  textarea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    height: 100,
    marginBottom: 12,
    textAlignVertical: 'top',
  },
});

export default NewTicketForm;
