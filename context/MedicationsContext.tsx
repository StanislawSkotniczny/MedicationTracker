import React, { createContext, useContext, useState } from 'react';
import { Medication } from '../types/medication';

interface MedicationsContextType {
  medications: Medication[];
  addMedication: (medication: Omit<Medication, 'id'>) => void;
  updateMedication: (id: string, medication: Medication) => void;
  deleteMedication: (id: string) => void;
}

const MedicationsContext = createContext<MedicationsContextType | undefined>(undefined);

export function MedicationsProvider({ children }: { children: React.ReactNode }) {
  const [medications, setMedications] = useState<Medication[]>([]);

  const addMedication = (medication: Omit<Medication, 'id'>) => {
    const newMedication: Medication = {
      ...medication,
      id: Date.now().toString(), // Simple ID generation
    };
    setMedications(prev => [...prev, newMedication]);
  };

  const updateMedication = (id: string, updatedMedication: Medication) => {
    setMedications(prev => 
      prev.map(med => med.id === id ? updatedMedication : med)
    );
  };

  const deleteMedication = (id: string) => {
    setMedications(prev => prev.filter(med => med.id !== id));
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