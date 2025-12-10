import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MyAccount = ({ navigation }) => {
  const user = {
    name: 'Talel Raboudi',
    phone: '+216 23456788',
    status: 'Disponible',
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header avec infos utilisateur */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user.name.split(' ').map(n => n[0]).join('')}
          </Text>
        </View>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userPhone}>{user.phone}</Text>
        <Text style={styles.userStatus}>{user.status}</Text>
        
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Modifier le profil</Text>
        </TouchableOpacity>
      </View>    

      

      {/* Déconnexion */}
      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>Déconnexion</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2550d3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userPhone: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 5,
  },
  userStatus: {
    fontSize: 14,
    color: '#2550d3',
    marginBottom: 15,
  },
  editButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#2550d3',
    borderRadius: 20,
  },
  editButtonText: {
    color: '#2550d3',
    fontWeight: '500',
  },
  section: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'gray',
    marginBottom: 10,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 5,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 15,
  },
  logoutButton: {
    margin: 20,
    padding: 15,
    backgroundColor: '#ff3b30',
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MyAccount;