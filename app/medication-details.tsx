import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMedications } from '../context/MedicationsContext';

export default function MedicationDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { medications } = useMedications();
  
  const medication = medications.find(med => med.id === id);

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
        <Text style={styles.headerTitle}>{medication.name}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dosage Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Dosage:</Text>
            <Text style={styles.value}>{medication.dosage}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Frequency:</Text>
            <Text style={styles.value}>{medication.frequency} times per day</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Amount per Dose:</Text>
            <Text style={styles.value}>{medication.amountPerDose}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Total Available:</Text>
            <Text style={styles.value}>{medication.totalAmount}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Schedule</Text>
          {medication.times.map((time, index) => (
            <View key={index} style={styles.timeItem}>
              <Ionicons name="time-outline" size={20} color="#007AFF" />
              <Text style={styles.timeText}>{time}</Text>
            </View>
          ))}
        </View>

        {medication.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.notesText}>{medication.notes}</Text>
          </View>
        )}
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
  content: {
    padding: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  notesText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
}); 