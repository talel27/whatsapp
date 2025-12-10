import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Group = () => {
  const [groups, setGroups] = useState([
    { id: '1', name: 'Famille', members: 8, lastMessage: 'Bonne nuit', time: '22:30' },
    { id: '2', name: 'Les potos', members: 15, lastMessage: 'Ce soir on sort ?', time: '20:15' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  const renderGroupItem = ({ item }) => (
    <TouchableOpacity style={styles.groupItem}>
      <View style={styles.groupAvatar}>
        <Ionicons name="people" size={40} color="#25D366" />
      </View>
      <View style={styles.groupInfo}>
        <Text style={styles.groupName}>{item.name}</Text>
        <Text style={styles.groupMembers}>{item.members} membres</Text>
        <Text style={styles.lastMessage}>{item.lastMessage}</Text>
      </View>
      <Text style={styles.time}>{item.time}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="gray" />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un groupe..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <TouchableOpacity style={styles.createGroupButton}>
        <Ionicons name="add-circle" size={24} color="#25D366" />
        <Text style={styles.createGroupText}>Nouveau groupe</Text>
      </TouchableOpacity>

      <FlatList
        data={groups}
        renderItem={renderGroupItem}
        keyExtractor={item => item.id}
        style={styles.list}
      />
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
  createGroupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  createGroupText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#2550d3',
    fontWeight: '500',
  },
  groupItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  groupAvatar: {
    marginRight: 15,
    color:'#2550d3',
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  groupMembers: {
    fontSize: 14,
    color: 'gray',
  },
  lastMessage: {
    fontSize: 14,
    color: 'gray',
    marginTop: 5,
  },
  time: {
    fontSize: 12,
    color: 'gray',
  },
  list: {
    flex: 1,
  },
});

export default Group;