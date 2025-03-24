import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMedications } from '../context/MedicationsContext';
import { Medication } from '../types/medication';
import { registerForPushNotificationsAsync, scheduleMedicationNotifications, scheduleLowStockNotification } from '../services/notifications';

export default function IntakeTrackingScreen() {
  const router = useRouter();
  const { medications, updateMedication } = useMedications();
  const [selectedDate] = useState(new Date());
  const [notificationStatus, setNotificationStatus] = useState<string>('');

  // Request notification permissions when the screen loads
  useEffect(() => {
    const setupNotifications = async () => {
      try {
        console.log('Setting up notifications...');
        const token = await registerForPushNotificationsAsync();
        
        if (token) {
          console.log('Notification permissions granted');
          setNotificationStatus('Notifications enabled');
          
          // Schedule notifications for all medications
          for (const medication of medications) {
            console.log(`Scheduling notifications for ${medication.name}`);
            await scheduleMedicationNotifications(medication);
            await scheduleLowStockNotification(medication);
          }
        } else {
          console.log('Notification permissions not granted');
          setNotificationStatus('Notifications disabled');
        }
      } catch (error) {
        console.error('Error setting up notifications:', error);
        setNotificationStatus('Error setting up notifications');
      }
    };

    setupNotifications();
  }, [medications]);

  const handleTakeMedication = (medication: Medication) => {
    Alert.alert(
      "Take Medication",
      `Are you sure you want to mark ${medication.name} as taken?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Take", 
          onPress: async () => {
            const updatedMedication = {
              ...medication,
              totalAmount: medication.totalAmount - medication.amountPerDose,
            };
            await updateMedication(medication.id, updatedMedication);
            
            // Reschedule notifications after taking medication
            await scheduleMedicationNotifications(updatedMedication);
            await scheduleLowStockNotification(updatedMedication);
          }
        }
      ]
    );
  };

  const getMedicationsForCurrentTime = () => {
    const currentHour = selectedDate.getHours();
    const currentMinute = selectedDate.getMinutes();
    const currentTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;

    return medications.filter(medication => {
      return medication.times?.some(time => {
        const [medHour, medMinute] = time.split(':').map(Number);
        return medHour === currentHour && Math.abs(medMinute - currentMinute) <= 30;
      });
    });
  };

  const getUpcomingMedications = () => {
    const currentHour = selectedDate.getHours();
    const currentMinute = selectedDate.getMinutes();
    const currentTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;

    return medications.filter(medication => {
      return medication.times?.some(time => {
        const [medHour, medMinute] = time.split(':').map(Number);
        return medHour > currentHour || (medHour === currentHour && medMinute > currentMinute);
      });
    });
  };

  const currentMedications = getMedicationsForCurrentTime();
  const upcomingMedications = getUpcomingMedications();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Medication Schedule</Text>
        <Text style={styles.dateText}>
          {selectedDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>
        {notificationStatus && (
          <Text style={styles.notificationStatus}>{notificationStatus}</Text>
        )}
      </View>

      <View style={styles.content}>
        {currentMedications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Due Now</Text>
            {currentMedications.map(medication => (
              <View key={medication.id} style={styles.medicationCard}>
                <View style={styles.medicationInfo}>
                  <Text style={styles.medicationName}>{medication.name}</Text>
                  <Text style={styles.medicationDosage}>{medication.dosage}</Text>
                  <Text style={styles.medicationTimes}>
                    {medication.times?.join(', ')}
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.takeButton}
                  onPress={() => handleTakeMedication(medication)}
                >
                  <Ionicons name="checkmark-circle-outline" size={24} color="#4CAF50" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {upcomingMedications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upcoming</Text>
            {upcomingMedications.map(medication => (
              <View key={medication.id} style={styles.medicationCard}>
                <View style={styles.medicationInfo}>
                  <Text style={styles.medicationName}>{medication.name}</Text>
                  <Text style={styles.medicationDosage}>{medication.dosage}</Text>
                  <Text style={styles.medicationTimes}>
                    {medication.times?.join(', ')}
                  </Text>
                </View>
                <View style={styles.upcomingIndicator}>
                  <Ionicons name="time-outline" size={24} color="#666" />
                </View>
              </View>
            ))}
          </View>
        )}

        {currentMedications.length === 0 && upcomingMedications.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="time-outline" size={64} color="#ccc" />
            <Text style={styles.emptyStateText}>No medications scheduled</Text>
            <Text style={styles.emptyStateSubtext}>
              Add medications to see your schedule
            </Text>
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
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  medicationCard: {
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
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  medicationDosage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  medicationTimes: {
    fontSize: 14,
    color: '#666',
  },
  takeButton: {
    padding: 8,
  },
  upcomingIndicator: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  notificationStatus: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
}); 