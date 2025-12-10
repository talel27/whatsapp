import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Auth = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    console.log("Bouton continuer cliqué");
    
    if (phoneNumber.length >= 8) {
      setIsLoading(true);
      try {
        const fullPhoneNumber = `+33${phoneNumber}`;
        console.log("Numéro complet:", fullPhoneNumber);

        // 🚨 SOLUTION DÉVELOPPEMENT - Contournement reCAPTCHA
        console.log("🔧 MODE DÉVELOPPEMENT: Navigation directe");
        
        // Simulation d'un délai d'envoi
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Navigation directe vers CreateUser
        navigation.navigate('CreateUser', { 
          phoneNumber: fullPhoneNumber,
          isDevelopment: true
        });
        
      } catch (error) {
        console.log("Erreur détaillée:", error);
        Alert.alert('Erreur', 'Impossible de procéder');
      } finally {
        setIsLoading(false);
      }
    } else {
      Alert.alert('Erreur', 'Veuillez entrer un numéro valide (au moins 8 chiffres)');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Ionicons name="chatbubbles" size={80} color="#25D366" />
          <Text style={styles.appName}>WhatsApp Clone</Text>
          <Text style={styles.devBadge}>MODE DÉVELOPPEMENT</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Votre numéro de téléphone</Text>
          <Text style={styles.subtitle}>
            WhatsApp enverra un SMS pour vérifier votre numéro
          </Text>

          <View style={styles.phoneInputContainer}>
            <Text style={styles.countryCode}>+33</Text>
            <TextInput
              style={styles.phoneInput}
              placeholder="6 12 34 56 78"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              maxLength={9}
            />
          </View>

          <TouchableOpacity 
            style={[
              styles.continueButton,
              phoneNumber.length < 8 && styles.continueButtonDisabled
            ]}
            onPress={handleContinue}
            disabled={phoneNumber.length < 8 || isLoading}
          >
            {isLoading ? (
              <Text style={styles.continueButtonText}>Vérification...</Text>
            ) : (
              <Text style={styles.continueButtonText}>Continuer</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.devNote}>
            🔧 Mode développement: Navigation directe vers CreateUser
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 50,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2550d3',
    marginTop: 20,
  },
  devBadge: {
    fontSize: 12,
    color: 'orange',
    fontWeight: 'bold',
    marginTop: 5,
    backgroundColor: '#FFF3CD',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  formContainer: {
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#25D366',
    marginBottom: 30,
    paddingVertical: 10,
  },
  countryCode: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  phoneInput: {
    flex: 1,
    fontSize: 18,
    paddingVertical: 5,
  },
  continueButton: {
    backgroundColor: '#2550d3',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 10,
  },
  continueButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  devNote: {
    fontSize: 12,
    color: 'orange',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 10,
  },
});

export default Auth;