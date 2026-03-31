import { StorageData, WeightEntry, Goal, Reminder } from './types';

const STORAGE_KEY = 'weight-tracker-data';

const defaultData: StorageData = {
  entries: [],
  reminder: {
    enabled: false,
    time: '08:00',
    frequency: 'daily',
  },
  lastUpdated: new Date().toISOString(),
};

export const getStorageData = (): StorageData => {
  if (typeof window === 'undefined') return defaultData;
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return defaultData;
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading storage:', error);
    return defaultData;
  }
};

export const saveStorageData = (data: StorageData): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving storage:', error);
  }
};

export const addWeightEntry = (entry: Omit<WeightEntry, 'id'>): WeightEntry => {
  const data = getStorageData();
  const newEntry: WeightEntry = {
    ...entry,
    id: Date.now().toString(),
  };
  
  data.entries.unshift(newEntry);
  data.lastUpdated = new Date().toISOString();
  saveStorageData(data);
  
  return newEntry;
};

export const updateWeightEntry = (id: string, updates: Partial<WeightEntry>): WeightEntry | null => {
  const data = getStorageData();
  const index = data.entries.findIndex(e => e.id === id);
  
  if (index === -1) return null;
  
  data.entries[index] = { ...data.entries[index], ...updates };
  data.lastUpdated = new Date().toISOString();
  saveStorageData(data);
  
  return data.entries[index];
};

export const deleteWeightEntry = (id: string): boolean => {
  const data = getStorageData();
  const index = data.entries.findIndex(e => e.id === id);
  
  if (index === -1) return false;
  
  data.entries.splice(index, 1);
  data.lastUpdated = new Date().toISOString();
  saveStorageData(data);
  
  return true;
};

export const getWeightEntries = (): WeightEntry[] => {
  return getStorageData().entries;
};

export const setGoal = (goal: Goal): void => {
  const data = getStorageData();
  data.goal = goal;
  data.lastUpdated = new Date().toISOString();
  saveStorageData(data);
};

export const getGoal = (): Goal | undefined => {
  return getStorageData().goal;
};

export const deleteGoal = (): void => {
  const data = getStorageData();
  delete data.goal;
  data.lastUpdated = new Date().toISOString();
  saveStorageData(data);
};

export const setReminder = (reminder: Reminder): void => {
  const data = getStorageData();
  data.reminder = reminder;
  data.lastUpdated = new Date().toISOString();
  saveStorageData(data);
};

export const getReminder = (): Reminder => {
  return getStorageData().reminder;
};

export const exportDataAsCSV = (): string => {
  const entries = getWeightEntries();
  
  if (entries.length === 0) {
    return 'No hay datos para exportar';
  }
  
  const headers = ['Fecha', 'Hora', 'Peso (kg)', 'BMI', 'Grasa Corporal (%)', 'Músculo (%)', 'RM', 'Visceral', 'Notas'];
  const rows = entries.map(entry => [
    entry.date,
    entry.time,
    entry.weight,
    entry.bmi,
    entry.bodyFat,
    entry.muscle,
    entry.rm,
    entry.visceral,
    entry.notes || '',
  ]);
  
  const csv = [headers, ...rows].map(row => 
    row.map(cell => `"${cell}"`).join(',')
  ).join('\n');
  
  return csv;
};

export const downloadCSV = (): void => {
  const csv = exportDataAsCSV();
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `weight-tracking-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
