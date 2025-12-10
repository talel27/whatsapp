import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Auth from './Screens/Auth';
import VerifyCode from './Screens/VerifyCode';
import CreateUser from './Screens/CreateUser';
import MainHome from './MainHome'
import Chat from './Screens/Home/Chat';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth">
        <Stack.Screen name="Auth" component={Auth} options={{ headerShown: false }} />
        <Stack.Screen name="VerifyCode" component={VerifyCode} options={{ headerShown: false }} />
        <Stack.Screen name="CreateUser" component={CreateUser} />
        <Stack.Screen name="MainHome" component={MainHome} options={{ headerShown: false }} />
        <Stack.Screen name="Chat" component={Chat} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}