import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Group from './Screens/Home/Group';
import List from './Screens/Home/List';
import MyAccount from './Screens/Home/Myaccount';

const Tab = createBottomTabNavigator();

export default function MainHome() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          if (route.name === 'Group') iconName = focused ? 'people' : 'people-outline';
          else if (route.name === 'List') iconName = focused ? 'list' : 'list-outline';
          else if (route.name === 'MyAccount') iconName = focused ? 'person' : 'person-outline';
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#25D366',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Group" component={Group} options={{ title: 'Groupes' }} />
      <Tab.Screen name="List" component={List} options={{ title: 'Contacts' }} />
      <Tab.Screen name="MyAccount" component={MyAccount} options={{ title: 'Mon Compte' }} />
    </Tab.Navigator>
  );
}