import type { AthleteCategory, AthleteLevel } from '../types/domain';

export const ATHLETE_CATEGORIES: { id: AthleteCategory; label: string; enabled: boolean }[] = [
  { id: 'general_fitness', label: 'General Fitness', enabled: true },
  { id: 'powerlifting', label: 'Powerlifting', enabled: false },
  { id: 'football', label: 'Fútbol', enabled: false },
  { id: 'running', label: 'Running', enabled: false },
];

export const ATHLETE_LEVELS: { id: AthleteLevel; label: string }[] = [
  { id: 'beginner', label: 'Principiante' },
  { id: 'intermediate', label: 'Intermedio' },
  { id: 'advanced', label: 'Avanzado' },
];
