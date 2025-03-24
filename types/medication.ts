export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: number;
  amountPerDose: number;
  totalAmount: number;
  times: string[]; // Array of times when medication should be taken (e.g., ["08:00", "14:00", "20:00"])
  notes?: string; // Optional notes about the medication
} 