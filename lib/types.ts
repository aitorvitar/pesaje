export interface WeightEntry {
  id: string;
  date: string;
  time: string;
  weight: number;
  bmi: number;
  bodyFat: number;
  muscle: number;
  rm: number;
  visceral: number;
  notes?: string;
}

export interface Goal {
  targetWeight: number;
  targetDate: string;
  createdAt: string;
}

export interface Reminder {
  enabled: boolean;
  time: string;
  frequency: 'daily' | 'every-other-day' | 'weekly';
}

export type CompositionType = 'obese' | 'overweight' | 'normal' | 'fit' | 'athletic' | 'muscular';

export interface StorageData {
  entries: WeightEntry[];
  goal?: Goal;
  reminder: Reminder;
  lastUpdated: string;
}
