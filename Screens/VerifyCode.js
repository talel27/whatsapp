import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { auth } from '../firebase';
import { signInWithCredential, PhoneAuthProvider } from 'firebase/auth';

const VerifyCode = ({ route, navigation }) => {
  const { verificationId, phoneNumber } = route.params; // Changé de confirmation à verificationId
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [testCode, setTestCode] = useState('');

  // Pour le développement - simuler un code reçu
  useEffect(() => {
    // Générer un code de test (en développement)
    const generatedCode = '123456'; // Code de test
    setTestCode(generatedCode);
    console.log('🎯 CODE DE TEST POUR DÉVELOPPEMENT:', generatedCode);
    console.log('📞 Numéro:', phoneNumber);
    console.log('🔑 Verification ID:', verificationId);
  }, []);

  const verifyCode = async () => {
    if (code.length === 6) {
      setIsLoading(true);
      try {
        console.log('🔐 Tentative de vérification avec le code:', code);
        
        // Méthode correcte pour Firebase v9+
        const credential = PhoneAuthProvider.credential(verificationId, code);
        await signInWithCredential(auth, credential);
        
        console.log('✅ Code vérifié avec succès!');
        navigation.navigate('CreateUser', { phoneNumber });
        
      } catch (error) {
        console.log('❌ Erreur de vérification:', error);
        Alert.alert('Erreur', `Code invalide: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    } else {
      Alert.alert('Erreur', 'Le code doit contenir 6 chiffres');
    }
  };

  // Remplir automatiquement avec le code de test
  const useTestCode = () => {
    setCode(testCode);
    Alert.alert('Code de test', `Code ${testCode} rempli automatiquement`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Vérification</Text>
        <Text style={styles.subtitle}>
          Entrez le code envoyé au {phoneNumber}
        </Text>

        {/* Affichage du code de test en développement */}
        <TouchableOpacity onPress={useTestCode} style={styles.testCodeContainer}>
          <Text style={styles.testCodeText}>
            🎯 CODE DE TEST: {testCode} (Toucher pour remplir)
          </Text>
        </TouchableOpacity>
        
        <TextInput
          style={styles.codeInput}
          placeholder="123456"
          keyboardType="number-pad"
          value={code}
          onChangeText={setCode}
          maxLength={6}
          autoFocus={true}
        />
        
        <TouchableOpacity 
          style={[
            styles.verifyButton,
            code.length !== 6 && styles.verifyButtonDisabled
          ]}
          onPress={verifyCode}
          disabled={code.length !== 6 || isLoading}
        >
          <Text style={styles.verifyButtonText}>
            {isLoading ? 'Vérification...' : 'Vérifier'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.resendButton}
          onPress={() => Alert.alert('Info', 'Fonctionnalité à implémenter')}
        >
          <Text style={styles.resendText}>Renvoyer le code</Text>
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
    marginBottom: 20,
  },
  testCodeContainer: {
    backgroundColor: '#FFF3CD',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFC107',
  },
  testCodeText: {
    color: '#856404',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  codeInput: {
    borderWidth: 2,
    borderColor: '#25D366',
    borderRadius: 10,
    padding: 15,
    fontSize: 18,
    textAlign: 'center',
    width: 200,
    marginBottom: 30,
  },
  verifyButton: {
    backgroundColor: '#25D366',
    padding: 15,
    borderRadius: 25,
    width: 200,
    alignItems: 'center',
    marginBottom: 15,
  },
  verifyButtonDisabled: {
    backgroundColor: '#90EE90',
    opacity: 0.6,
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendButton: {
    padding: 10,
  },
  resendText: {
    color: '#25D366',
    fontSize: 14,
  },
});

export default VerifyCode;