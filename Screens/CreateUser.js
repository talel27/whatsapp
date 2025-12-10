import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

const CreateUser = ({ route, navigation }) => {
  const { phoneNumber, isDevelopment } = route.params;
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('📱 Numéro reçu:', phoneNumber);
    console.log('🔧 Mode développement:', isDevelopment);
  }, []);

  const handleCreateAccount = async () => {
    if (username.length < 2) {
      Alert.alert('Erreur', 'Le nom d\'utilisateur doit contenir au moins 2 caractères');
      return;
    }

    setIsLoading(true);
    try {
      console.log('🔧 Création de compte développement');
      
      // Créer un email temporaire
      const tempEmail = `${phoneNumber.replace('+', '')}@dev.whatsapp.com`;
      const tempPassword = '123456';
      
      console.log('📧 Email temporaire:', tempEmail);
      
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        tempEmail, 
        tempPassword
      );
      
      // Mettre à jour le profil
      await updateProfile(userCredential.user, {
        displayName: username
      });
      
      console.log('✅ Compte développement créé:', userCredential.user);
      Alert.alert('Succès', `Bienvenue ${username}!`);
      navigation.navigate('MainHome');
      
    } catch (error) {
      console.log('❌ Erreur création compte:', error);
      
      if (error.code === 'auth/email-already-in-use') {
        // Simuler la connexion si le compte existe déjà
        console.log('🔧 Compte existant, simulation de connexion');
        Alert.alert('Succès', `Bon retour ${username}!`);
        navigation.navigate('MainHome');
      } else {
        Alert.alert('Erreur', `Impossible de créer le compte: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Créez votre profil</Text>
        <Text style={styles.subtitle}>
          Choisissez un nom d'utilisateur pour {phoneNumber}
        </Text>

        {isDevelopment && (
          <View style={styles.devBanner}>
            <Text style={styles.devBannerText}>🔧 MODE DÉVELOPPEMENT</Text>
          </View>
        )}

        <TextInput
          style={styles.input}
          placeholder="Votre nom d'utilisateur"
          value={username}
          onChangeText={setUsername}
          maxLength={20}
          autoCapitalize="words"
        />

        <TouchableOpacity 
          style={[
            styles.createButton,
            username.length < 2 && styles.createButtonDisabled
          ]}
          onPress={handleCreateAccount}
          disabled={username.length < 2 || isLoading}
        >
          <Text style={styles.createButtonText}>
            {isLoading ? 'Création...' : 'Créer le compte'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    padding: 30,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 30,
  },
  devBanner: {
    backgroundColor: '#FFF3CD',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FFC107',
  },
  devBannerText: {
    color: '#856404',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#25D366',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    width: '100%',
    marginBottom: 30,
  },
  createButton: {
    backgroundColor: '#25D366',
    padding: 15,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
  },
  createButtonDisabled: {
    backgroundColor: '#90EE90',
    opacity: 0.6,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateUser;