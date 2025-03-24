import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Medication } from '../types/medication';
import { scheduleMedicationNotifications, scheduleLowStockNotification, cancelMedicationNotifications } from '../services/notifications';

interface MedicationsContextType {
  medications: Medication[];
  addMedication: (medication: Omit<Medication, 'id'>) => Promise<void>;
  updateMedication: (id: string, medication: Medication) => Promise<void>;
  deleteMedication: (id: string) => Promise<void>;
}

const MedicationsContext = createContext<MedicationsContextType | undefined>(undefined);

const STORAGE_KEY = '@medications';

export function MedicationsProvider({ children }: { children: React.ReactNode }) {
  const [medications, setMedications] = useState<Medication[]>([]);

  // Load medications from storage on app start
  useEffect(() => {
    const loadMedications = async () => {
      try {
        const storedMedications = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedMedications) {
          const loadedMedications = JSON.parse(storedMedications);
          setMedications(loadedMedications);
          // Schedule notifications for all loaded medications
          for (const medication of loadedMedications) {
            await scheduleMedicationNotifications(medication);
            await scheduleLowStockNotification(medication);
          }
        }
      } catch (error) {
        console.error('Error loading medications:', error);
      }
    };
    loadMedications();
  }, []);

  const addMedication = async (medication: Omit<Medication, 'id'>) => {
    try {
      const newMedication: Medication = {
        ...medication,
        id: Date.now().toString(),
      };
      const updatedMedications = [...medications, newMedication];
      setMedications(updatedMedications);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMedications));
      
      // Schedule notifications for the new medication
      await scheduleMedicationNotifications(newMedication);
      await scheduleLowStockNotification(newMedication);
    } catch (error) {
      console.error('Error adding medication:', error);
    }
  };

  const updateMedication = async (id: string, updatedMedication: Medication) => {
    try {
      const updatedMedications = medications.map(med => 
        med.id === id ? updatedMedication : med
      );
      setMedications(updatedMedications);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMedications));
      
      // Cancel existing notifications and schedule new ones
      await cancelMedicationNotifications(id);
      await scheduleMedicationNotifications(updatedMedication);
      await scheduleLowStockNotification(updatedMedication);
    } catch (error) {
      console.error('Error updating medication:', error);
    }
  };

  const deleteMedication = async (id: string) => {
    try {
      const updatedMedications = medications.filter(med => med.id !== id);
      setMedications(updatedMedications);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMedications));
      
      // Cancel notifications for the deleted medication
      await cancelMedicationNotifications(id);
    } catch (error) {
      console.error('Error deleting medication:', error);
    }
  };

  return (
    <MedicationsContext.Provider value={{ 
      medications, 
      addMedication, 
      updateMedication, 
      deleteMedication 
    }}>
      {children}
    </MedicationsContext.Provider>
  );
}

export function useMedications() {
  const context = useContext(MedicationsContext);
  if (context === undefined) {
    throw new Error('useMedications must be used within a MedicationsProvider');
  }
  return context;
} 