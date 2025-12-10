import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { firestore, auth, storage } from '../../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';

const Chat = ({ route, navigation }) => {
  const { chatId, contactName } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState(null);
  const flatListRef = useRef();

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    const messagesRef = collection(firestore, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    
    const unsubscribeMessages = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messagesData);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeMessages();
    };
  }, [chatId]);

  const sendMessage = async () => {
    if (newMessage.trim() === '') return;

    try {
      await addDoc(collection(firestore, 'chats', chatId, 'messages'), {
        text: newMessage,
        timestamp: Timestamp.now(),
        senderId: user.uid,
        senderName: user.displayName || 'Utilisateur',
        type: 'text'
      });
      setNewMessage('');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'envoyer le message');
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Nous avons besoin de la permission pour accéder à vos photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      await sendImage(result.assets[0].uri);
    }
  };

  const sendImage = async (imageUri) => {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      const imageName = `images/${chatId}/${Date.now()}.jpg`;
      const imageRef = ref(storage, imageName);
      
      await uploadBytes(imageRef, blob);
      const downloadURL = await getDownloadURL(imageRef);

      await addDoc(collection(firestore, 'chats', chatId, 'messages'), {
        imageUrl: downloadURL,
        timestamp: Timestamp.now(),
        senderId: user.uid,
        senderName: user.displayName || 'Utilisateur',
        type: 'image'
      });
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'envoyer l\'image');
    }
  };

  const renderMessage = ({ item }) => {
    const isMyMessage = item.senderId === user?.uid;

    return (
      <View style={[
        styles.messageContainer,
        isMyMessage ? styles.myMessage : styles.otherMessage
      ]}>
        {!isMyMessage && (
          <Text style={styles.senderName}>{item.senderName}</Text>
        )}
        
        {item.type === 'text' ? (
          <Text style={[
            styles.messageText,
            isMyMessage ? styles.myMessageText : styles.otherMessageText
          ]}>
            {item.text}
          </Text>
        ) : (
          <Image 
            source={{ uri: item.imageUrl }} 
            style={styles.messageImage}
            resizeMode="cover"
          />
        )}
        
        <Text style={styles.timestamp}>
          {item.timestamp?.toDate().toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{contactName}</Text>
        <Ionicons name="videocam" size={24} color="white" />
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        style={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachmentButton} onPress={pickImage}>
          <Ionicons name="attach" size={24} color="#25D366" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.cameraButton}>
          <Ionicons name="camera" size={24} color="#25D366" />
        </TouchableOpacity>

        <TextInput
          style={styles.textInput}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Tapez un message..."
          multiline
        />

        <TouchableOpacity 
          style={styles.sendButton} 
          onPress={sendMessage}
          disabled={newMessage.trim() === ''}
        >
          <Ionicons 
            name="send" 
            size={24} 
            color={newMessage.trim() === '' ? 'gray' : '#25D366'} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#25D366',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  messagesList: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  senderName: {
    fontSize: 12,
    color: '#25D366',
    marginBottom: 2,
    fontWeight: 'bold',
  },
  messageText: {
    fontSize: 16,
  },
  myMessageText: {
    color: 'black',
  },
  otherMessageText: {
    color: 'black',
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 10,
    marginVertical: 5,
  },
  timestamp: {
    fontSize: 10,
    color: 'gray',
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  textInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 10,
    maxHeight: 100,
  },
  attachmentButton: {
    padding: 5,
  },
  cameraButton: {
    padding: 5,
  },
  sendButton: {
    padding: 5,
  },
});

export default Chat;