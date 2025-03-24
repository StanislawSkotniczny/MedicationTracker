import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMedications } from '../context/MedicationsContext';

export default function EditMedicationScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { medications, updateMedication } = useMedications();
  
  const medication = medications.find(med => med.id === id);

  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: '',
    amountPerDose: '',
    totalAmount: '',
    times: [''] as string[],
    notes: '',
  });

  useEffect(() => {
    if (medication) {
      setFormData({
        name: medication.name,
        dosage: medication.dosage,
        frequency: medication.frequency.toString(),
        amountPerDose: medication.amountPerDose.toString(),
        totalAmount: medication.totalAmount.toString(),
        times: medication.times || [''],
        notes: medication.notes || '',
      });
    }
  }, [medication]);

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
    if (!medication) return;

    // Validate form data
    if (!formData.name || !formData.dosage || !formData.frequency || 
        !formData.amountPerDose || !formData.totalAmount) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Validate times
    const validTimes = formData.times.filter(time => time.trim() !== '');
    if (validTimes.length === 0) {
      Alert.alert('Error', 'Please add at least one time for medication');
      return;
    }

    // Convert string values to numbers
    const updatedMedication = {
      ...medication,
      name: formData.name,
      dosage: formData.dosage,
      frequency: parseInt(formData.frequency),
      amountPerDose: parseInt(formData.amountPerDose),
      totalAmount: parseInt(formData.totalAmount),
      times: validTimes,
      notes: formData.notes.trim() || undefined,
    };

    updateMedication(medication.id, updatedMedication);
    router.back();
  };

  if (!medication) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Medication not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Medication</Text>
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
          <Text style={styles.label}>Times per Day *</Text>
          <TextInput
            style={styles.input}
            value={formData.frequency}
            onChangeText={(text) => setFormData({ ...formData, frequency: text })}
            placeholder="e.g., 3"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Amount per Dose *</Text>
          <TextInput
            style={styles.input}
            value={formData.amountPerDose}
            onChangeText={(text) => setFormData({ ...formData, amountPerDose: text })}
            placeholder="e.g., 1"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Total Amount Available *</Text>
          <TextInput
            style={styles.input}
            value={formData.totalAmount}
            onChangeText={(text) => setFormData({ ...formData, totalAmount: text })}
            placeholder="e.g., 30"
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
          <Text style={styles.saveButtonText}>Save Changes</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 16,
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
  errorText: {
    fontSize: 16,
    color: '#ff3b30',
    textAlign: 'center',
    marginTop: 20,
  },
}); 