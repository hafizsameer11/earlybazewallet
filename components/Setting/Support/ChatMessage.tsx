import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Pressable
} from 'react-native';

interface ChatMessageProps {
  sender: string;
  text: string;
  time: string;
  isUser: boolean;
  attachment?: string | null;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  sender,
  text,
  time,
  isUser,
  attachment,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const backgroundColor = isUser ? '#25AE7A' : '#E5E5E5';
  const textColor = isUser ? '#FFFFFF' : '#222222';
  const imageUri = attachment ? `https://earlybaze.hmstech.xyz/storage/${attachment}` : null;

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.otherContainer]}>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.otherBubble, { backgroundColor }]}>
        {!isUser && <Text style={styles.sender}>{sender}</Text>}
        
        {text ? (
          <Text style={[styles.message, { color: textColor }]}>{text}</Text>
        ) : null}

        {attachment && (
          <>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Image source={{ uri: imageUri }} style={styles.attachmentImage} resizeMode="cover" />
            </TouchableOpacity>

            <Modal visible={modalVisible} transparent animationType="fade">
              <Pressable style={styles.modalContainer} onPress={() => setModalVisible(false)}>
                <Image source={{ uri: imageUri }} style={styles.fullImage} resizeMode="contain" />
              </Pressable>
            </Modal>
          </>
        )}

        <Text style={[styles.time, isUser ? styles.userTime : styles.otherTime]}>{time}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  userContainer: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  otherContainer: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  sender: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#25AE7A',
  },
  bubble: {
    paddingVertical: 20,
    paddingHorizontal: 27,
    borderRadius: 18,
    maxWidth: '75%',
    position: 'relative',
    minHeight: 50,
  },
  userBubble: {
    borderTopRightRadius: 5,
  },
  otherBubble: {
    borderTopLeftRadius: 5,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
  },
  time: {
    fontSize: 10,
    position: 'absolute',
    top: 6,
    right: 10,
    opacity: 0.6,
  },
  userTime: {
    color: '#D6F8C6',
  },
  otherTime: {
    color: '#666666',
  },
  attachmentImage: {
    width: 200,
    height: 150,
    borderRadius: 10,
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '100%',
    height: '80%',
  },
});

export default ChatMessage;
