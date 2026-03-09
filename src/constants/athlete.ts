import type { AthleteCategory, AthleteLevel } from '../types/domain';

export const ATHLETE_CATEGORIES: { id: AthleteCategory; label: string }[] = [
  { id: 'general_fitness', label: 'General Fitness' },
  { id: 'powerlifting', label: 'Powerlifting' },
  { id: 'football', label: 'Fútbol' },
  { id: 'running', label: 'Running' },
];

export const ATHLETE_LEVELS: { id: AthleteLevel; label: string }[] = [
  { id: 'beginner', label: 'Principiante' },
  { id: 'intermediate', label: 'Intermedio' },
  { id: 'advanced', label: 'Avanzado' },
];
