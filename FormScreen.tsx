import React from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet } from 'react-native';
import LogoPipm from './assets/logo-pipm-photo.png';

type FormScreenProps = {
  projet: string;
  setProjet: (text: string) => void;
  equipement: string;
  setEquipement: (text: string) => void;
  onStart: () => void;
  onResetAll: () => void;
};

export function FormScreen({
  projet,
  setProjet,
  equipement,
  setEquipement,
  onStart,
  onResetAll,
}: FormScreenProps) {
  // -----------------------
  // Rendu du formulaire Projet / Équipement avec boutons Démarrer et Réinitialiser
  // -----------------------
  return (
    <View style={styles.formContainer}>
      {/* Logo PIPM en haut */}
      <Image source={LogoPipm} style={styles.logo} resizeMode="contain" />

      {/* Champ Projet */}
      <Text style={styles.label}>Projet</Text>
      <TextInput
        style={styles.input}
        value={projet}
        onChangeText={setProjet}
        autoCapitalize="words"
        autoCorrect={false}
        keyboardAppearance="light"
      />

      {/* Champ Équipement */}
      <Text style={styles.label}>Équipement</Text>
      <TextInput
        style={styles.input}
        value={equipement}
        onChangeText={setEquipement}
        autoCapitalize="words"
        autoCorrect={false}
        keyboardAppearance="light"
      />

      {/* Bouton Démarrer */}
      <TouchableOpacity style={styles.startButton} onPress={onStart}>
        <Text style={styles.startButtonText}>Démarrer</Text>
      </TouchableOpacity>

      {/* Bouton Réinitialiser */}
      <TouchableOpacity style={styles.resetButton} onPress={onResetAll}>
        <Text style={styles.resetButtonText}>Réinitialiser tout</Text>
      </TouchableOpacity>
    </View>
  );
}

// -----------------------
// Styles du formulaire et boutons
// -----------------------
const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
    backgroundColor: '#f5f5f5',
  },
  logo: {
    width: '80%',
    height: 120,
    marginBottom: 30,
    alignSelf: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: '#333',
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    marginBottom: 20,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    color: 'black',
  },
  startButton: {
    backgroundColor: '#00aaff',
    padding: 15,
    borderRadius: 25,
    marginTop: 10,
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  resetButton: {
    marginTop: 30,
    backgroundColor: '#cc0000',
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  resetButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
