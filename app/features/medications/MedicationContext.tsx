import React, { createContext, useState, ReactNode, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: number;
  amountPerDose: number;
  totalAmount: number;
  times?: string[];
  notes?: string;
}

interface MedicationContextType {
  medications: Medication[];
  selectedMedication: Medication | null;
  setSelectedMedication: (medication: Medication | null) => void;
  setMedications: React.Dispatch<React.SetStateAction<Medication[]>>;
  updateMedication: (id: string, updatedMedication: Medication) => Promise<void>;
  deleteMedication: (id: string) => Promise<void>;
}

export const MedicationContext = createContext<MedicationContextType | undefined>(undefined);

export const useMedication = () => {
  const context = useContext(MedicationContext);
  if (!context) {
    throw new Error('useMedication must be used within a MedicationProvider');
  }
  return context;
};

interface MedicationProviderProps {
  children: ReactNode;
}

export const MedicationProvider: React.FC<MedicationProviderProps> = ({ children }) => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);

  const updateMedication = async (id: string, updatedMedication: Medication) => {
    try {
      const newMedications = medications.map(med => 
        med.id === id ? updatedMedication : med
      );
      setMedications(newMedications);
      await AsyncStorage.setItem('medications', JSON.stringify(newMedications));
    } catch (error) {
      console.error('Error updating medication:', error);
    }
  };

  const deleteMedication = async (id: string) => {
    try {
      const newMedications = medications.filter(med => med.id !== id);
      setMedications(newMedications);
      await AsyncStorage.setItem('medications', JSON.stringify(newMedications));
    } catch (error) {
      console.error('Error deleting medication:', error);
    }
  };

  return (
    <MedicationContext.Provider 
      value={{ 
        medications, 
        selectedMedication,
        setSelectedMedication,
        setMedications, 
        updateMedication, 
        deleteMedication 
      }}
    >
      {children}
    </MedicationContext.Provider>
  );
}; 