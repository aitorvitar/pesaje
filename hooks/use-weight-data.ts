import { useEffect, useState, useCallback } from 'react';
import { WeightEntry, Goal, Reminder } from '@/lib/types';
import { getWeightEntries, getGoal, getReminder } from '@/lib/storage';

export function useWeightData() {
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [goal, setGoal] = useState<Goal | undefined>();
  const [reminder, setReminder] = useState<Reminder>({
    enabled: false,
    time: '08:00',
    frequency: 'daily',
  });
  const [loaded, setLoaded] = useState(false);

  const loadData = useCallback(() => {
    const allEntries = getWeightEntries();
    setEntries(allEntries);

    const currentGoal = getGoal();
    setGoal(currentGoal);

    const currentReminder = getReminder();
    setReminder(currentReminder);

    setLoaded(true);
  }, []);

  useEffect(() => {
    loadData();

    // Listen for storage changes in other tabs
    const handleStorageChange = () => {
      loadData();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadData]);

  return { entries, goal, reminder, loaded, reload: loadData };
}
