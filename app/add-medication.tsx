import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Medication } from '../types/medication';
import { useMedications } from '../context/MedicationsContext';

export default function AddMedicationScreen() {
  const router = useRouter();
  const { addMedication } = useMedications();
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: '',
    amountPerDose: '',
    totalAmount: '',
    times: [''] as string[],
    notes: '',
  });

  const handleAddTime = () => {
    setFormData(prev => ({
      ...prev,
      times: [...prev.times, '']
    }));
  };

  const handleTimeChange = (index: number, value: string) => {
    const newTimes = [...formData.times];
    newTimes[index] = value;
    setFormData(prev => ({
      ...prev,
      times: newTimes
    }));
  };

  const handleRemoveTime = (index: number) => {
    setFormData(prev => ({
      ...prev,
      times: prev.times.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    // Validate only name and dosage
    if (!formData.name || !formData.dosage) {
      Alert.alert('Error', 'Please fill in medication name and dosage');
      return;
    }

    // Convert string values to numbers, use default values for optional fields
    const medication = {
      name: formData.name,
      dosage: formData.dosage,
      frequency: parseInt(formData.frequency) || 1,
      amountPerDose: parseInt(formData.amountPerDose) || 1,
      totalAmount: parseInt(formData.totalAmount) || 30,
      times: formData.times.filter(time => time.trim() !== '') || ['08:00'],
      notes: formData.notes.trim() || undefined,
    };

    addMedication(medication);
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add Medication</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Medication Name *</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="e.g., Aspirin"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Dosage *</Text>
          <TextInput
            style={styles.input}
            value={formData.dosage}
            onChangeText={(text) => setFormData({ ...formData, dosage: text })}
            placeholder="e.g., 500mg"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Times per Day</Text>
          <TextInput
            style={styles.input}
            value={formData.frequency}
            onChangeText={(text) => setFormData({ ...formData, frequency: text })}
            placeholder="e.g., 3 (default: 1)"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Amount per Dose</Text>
          <TextInput
            style={styles.input}
            value={formData.amountPerDose}
            onChangeText={(text) => setFormData({ ...formData, amountPerDose: text })}
            placeholder="e.g., 1 (default: 1)"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Total Amount Available</Text>
          <TextInput
            style={styles.input}
            value={formData.totalAmount}
            onChangeText={(text) => setFormData({ ...formData, totalAmount: text })}
            placeholder="e.g., 30 (default: 30)"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Times to Take Medication *</Text>
          {formData.times.map((time, index) => (
            <View key={index} style={styles.timeInputContainer}>
              <TextInput
                style={[styles.input, styles.timeInput]}
                value={time}
                onChangeText={(text) => handleTimeChange(index, text)}
                placeholder="e.g., 08:00"
              />
              {formData.times.length > 1 && (
                <TouchableOpacity
                  style={styles.removeTimeButton}
                  onPress={() => handleRemoveTime(index)}
                >
                  <Text style={styles.removeTimeButtonText}>×</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
          <TouchableOpacity style={styles.addTimeButton} onPress={handleAddTime}>
            <Text style={styles.addTimeButtonText}>+ Add Time</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            value={formData.notes}
            onChangeText={(text) => setFormData({ ...formData, notes: text })}
            placeholder="Add any additional notes..."
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Medication</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeInput: {
    flex: 1,
    marginRight: 8,
  },
  removeTimeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ff3b30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeTimeButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  addTimeButton: {
    padding: 8,
    alignItems: 'center',
  },
  addTimeButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 