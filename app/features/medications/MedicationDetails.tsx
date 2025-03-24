import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useMedication } from './MedicationContext';

export const MedicationDetails: React.FC = () => {
  const { selectedMedication, updateMedication, deleteMedication } = useMedication();
  const [isEditing, setIsEditing] = useState(false);

  if (!selectedMedication) {
    return <Text>No medication selected</Text>;
  }

  const handleDelete = () => {
    Alert.alert(
      "Delete Medication",
      "Are you sure you want to delete this medication?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => deleteMedication(selectedMedication.id)
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{selectedMedication.name}</Text>
      <Text>Dosage: {selectedMedication.dosage}</Text>
      <Text>Times per day: {selectedMedication.timesPerDay}</Text>
      <Text>Amount per dose: {selectedMedication.amountPerDose}</Text>
      <Text>Total amount: {selectedMedication.totalAmount}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.editButton]} 
          onPress={() => setIsEditing(true)}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.deleteButton]} 
          onPress={handleDelete}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
}); 