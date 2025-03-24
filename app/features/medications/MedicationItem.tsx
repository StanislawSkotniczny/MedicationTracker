import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMedication } from './MedicationContext';
import { Medication } from './MedicationContext';

interface MedicationItemProps {
  medication: Medication;
}

const MedicationItem: React.FC<MedicationItemProps> = ({ medication }) => {
  const { updateMedication, deleteMedication, setSelectedMedication } = useMedication();
  const [isEditing, setIsEditing] = useState(false);
  const [editedMedication, setEditedMedication] = useState(medication);

  const handleUpdate = () => {
    updateMedication(medication.id, editedMedication);
    setIsEditing(false);
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Medication",
      "Are you sure you want to delete this medication?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => deleteMedication(medication.id)
        }
      ]
    );
  };

  if (isEditing) {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          value={editedMedication.name}
          onChangeText={(text) => 
            setEditedMedication(prev => ({...prev, name: text}))}
          placeholder="Medication Name"
        />
        <TextInput
          style={styles.input}
          value={editedMedication.dosage}
          onChangeText={(text) => 
            setEditedMedication(prev => ({...prev, dosage: text}))}
          placeholder="Dosage (e.g., 500mg)"
        />
        <TextInput
          style={styles.input}
          value={editedMedication.frequency.toString()}
          onChangeText={(text) => 
            setEditedMedication(prev => ({...prev, frequency: parseInt(text) || 0}))}
          placeholder="Times per day"
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          value={editedMedication.amountPerDose.toString()}
          onChangeText={(text) => 
            setEditedMedication(prev => ({...prev, amountPerDose: parseInt(text) || 0}))}
          placeholder="Amount per dose"
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          value={editedMedication.totalAmount.toString()}
          onChangeText={(text) => 
            setEditedMedication(prev => ({...prev, totalAmount: parseInt(text) || 0}))}
          placeholder="Total amount"
          keyboardType="numeric"
        />
        <TextInput
          style={[styles.input, styles.notesInput]}
          value={editedMedication.notes}
          onChangeText={(text) => 
            setEditedMedication(prev => ({...prev, notes: text}))}
          placeholder="Notes (optional)"
          multiline
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleUpdate}>
            <Ionicons name="save-outline" size={20} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setIsEditing(false)}>
            <Ionicons name="close-outline" size={20} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => setSelectedMedication(medication)}
    >
      <Text style={styles.name}>{medication.name}</Text>
      <Text style={styles.detail}>Dosage: {medication.dosage}</Text>
      <Text style={styles.detail}>Times per day: {medication.frequency}</Text>
      <Text style={styles.detail}>Amount per dose: {medication.amountPerDose}</Text>
      <Text style={styles.detail}>Total amount: {medication.totalAmount}</Text>
      {medication.notes && (
        <Text style={styles.notes} numberOfLines={2}>{medication.notes}</Text>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.editButton]} 
          onPress={() => setIsEditing(true)}
        >
          <Ionicons name="create-outline" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.deleteButton]} 
          onPress={handleDelete}
        >
          <Ionicons name="trash-outline" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  detail: {
    fontSize: 16,
    marginBottom: 4,
    color: '#666',
  },
  notes: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
    fontSize: 16,
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 5,
    minWidth: 120,
  },
  buttonIcon: {
    marginRight: 8,
  },
  editButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  saveButton: {
    backgroundColor: '#2196F3',
  },
  cancelButton: {
    backgroundColor: '#757575',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default MedicationItem; 