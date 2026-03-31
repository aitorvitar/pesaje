import { CompositionType } from './types';

export const getCompositionType = (bmi: number, bodyFat: number, muscle: number): CompositionType => {
  // Basado en BMI y composición corporal
  if (bmi < 18.5) {
    // Bajo peso
    if (muscle > 35) return 'athletic';
    if (muscle > 32) return 'fit';
    return 'normal';
  } else if (bmi < 25) {
    // Peso normal
    if (muscle > 35) return 'muscular';
    if (muscle > 32) return 'athletic';
    if (bodyFat < 20) return 'fit';
    return 'normal';
  } else if (bmi < 30) {
    // Sobrepeso
    if (muscle > 35) return 'muscular';
    if (muscle > 30) return 'fit';
    return 'overweight';
  } else {
    // Obeso
    if (muscle > 35) return 'muscular';
    return 'obese';
  }
};

export const getCompositionLabel = (type: CompositionType): string => {
  const labels: Record<CompositionType, string> = {
    'obese': 'Obesidad',
    'overweight': 'Sobrepeso',
    'normal': 'Peso Normal',
    'fit': 'En Forma',
    'athletic': 'Atlético',
    'muscular': 'Musculoso',
  };
  return labels[type];
};

export const getCompositionColor = (type: CompositionType): string => {
  const colors: Record<CompositionType, string> = {
    'obese': '#ef4444',
    'overweight': '#f97316',
    'normal': '#eab308',
    'fit': '#84cc16',
    'athletic': '#22c55e',
    'muscular': '#0ea5e9',
  };
  return colors[type];
};

export const getCompositionEmoji = (type: CompositionType): string => {
  const emojis: Record<CompositionType, string> = {
    'obese': '😔',
    'overweight': '😐',
    'normal': '😊',
    'fit': '💪',
    'athletic': '🏃',
    'muscular': '🦾',
  };
  return emojis[type];
};

export const getAvatarShape = (type: CompositionType): string => {
  const shapes: Record<CompositionType, string> = {
    'obese': 'translate(-50%, -50%) scale(1.4)',
    'overweight': 'translate(-50%, -50%) scale(1.2)',
    'normal': 'translate(-50%, -50%) scale(1)',
    'fit': 'translate(-50%, -50%) scale(0.9)',
    'athletic': 'translate(-50%, -50%) scale(0.85)',
    'muscular': 'translate(-50%, -50%) scale(0.8)',
  };
  return shapes[type];
};

export const calculateTrend = (entries: any[], days: number = 7): number => {
  if (entries.length < 2) return 0;
  
  const recentEntries = entries.slice(0, days);
  const oldestWeight = recentEntries[recentEntries.length - 1]?.weight || 0;
  const newestWeight = recentEntries[0]?.weight || 0;
  
  return newestWeight - oldestWeight;
};

export const getStats = (entries: any[]) => {
  if (entries.length === 0) {
    return {
      currentWeight: 0,
      avgWeight: 0,
      maxWeight: 0,
      minWeight: 0,
      trend7d: 0,
      trend30d: 0,
    };
  }

  const weights = entries.map(e => e.weight);
  const current = weights[0];
  const avg = weights.reduce((a, b) => a + b) / weights.length;
  const max = Math.max(...weights);
  const min = Math.min(...weights);

  return {
    currentWeight: current,
    avgWeight: avg,
    maxWeight: max,
    minWeight: min,
    trend7d: calculateTrend(entries, 7),
    trend30d: calculateTrend(entries, 30),
  };
};
