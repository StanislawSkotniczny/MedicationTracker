import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Medication } from '../types/medication';

interface MedicationListItemProps {
  medication: Medication;
  onPress: () => void;
}

export default function MedicationListItem({ medication, onPress }: MedicationListItemProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Ionicons name="medical-outline" size={24} color="#007AFF" />
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{medication.name}</Text>
        <Text style={styles.details}>{medication.dosage} • {medication.frequency}x/day</Text>
        <Text style={styles.amount}>Remaining: {medication.totalAmount} pills</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#ccc" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5F1FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  amount: {
    fontSize: 12,
    color: '#999',
  },
}); 