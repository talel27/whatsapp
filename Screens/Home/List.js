import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  TextInput,
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth, firestore } from '../../firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';

const List = ({ navigation }) => {
  const [contacts, setContacts] = useState([
    { id: 'user1', name: 'Jean Dupont', status: 'En ligne', lastSeen: 'Maintenant' },
    { id: 'user2', name: 'Marie Curie', status: 'Hier', lastSeen: '20:30' },
    { id: 'user3', name: 'Paul Martin', status: 'En ligne', lastSeen: 'Maintenant' },
    { id: 'user4', name: 'Sophie Bernard', status: 'Il y a 2h', lastSeen: '18:15' },
    { id: 'user5', name: 'Lucas Moreau', status: 'En ligne', lastSeen: 'Maintenant' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return unsubscribe;
  }, []);

  const startChat = async (contact) => {
    try {
      if (!user) {
        Alert.alert('Erreur', 'Vous devez être connecté pour chatter');
        return;
      }

      const chatId = [user.uid, contact.id].sort().join('_');
      
      // Créer le chat s'il n'existe pas
      const chatRef = doc(firestore, 'chats', chatId);
      const chatSnap = await getDoc(chatRef);
      
      if (!chatSnap.exists()) {
        await setDoc(chatRef, {
          participants: [user.uid, contact.id],
          participantNames: {
            [user.uid]: user.displayName || 'Moi',
            [contact.id]: contact.name
          },
          createdAt: Timestamp.now(),
          lastMessage: '',
          lastMessageTime: Timestamp.now()
        });
      }
      
      navigation.navigate('Chat', { 
        chatId, 
        contactName: contact.name 
      });
    } catch (error) {
      console.error('Erreur startChat:', error);
      Alert.alert('Erreur', 'Impossible de démarrer la conversation');
    }
  };

  const renderContactItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.contactItem}
      onPress={() => startChat(item)}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.name.split(' ').map(n => n[0]).join('')}
        </Text>
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactStatus}>{item.status}</Text>
      </View>
      {item.status === 'En ligne' && <View style={styles.onlineIndicator} />}
    </TouchableOpacity>
  );

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="gray" />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un contact..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredContacts}
        renderItem={renderContactItem}
        keyExtractor={item => item.id}
        style={styles.list}
      />

      <TouchableOpacity 
        style={styles.newChatButton}
        onPress={() => Alert.alert('Nouveau chat', 'Fonctionnalité à venir')}
      >
        <Ionicons name="chatbubble-ellipses" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6f6f6',
    margin: 10,
    padding: 10,
    borderRadius: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  contactItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#25D366',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactStatus: {
    fontSize: 14,
    color: 'gray',
  },
  onlineIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#25D366',
  },
  list: {
    flex: 1,
  },
  newChatButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#25D366',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default List;