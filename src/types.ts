export type Priority = 'low' | 'medium' | 'high';
export type Recurrence = 'none' | 'daily' | 'weekly' | 'monthly';

export interface Task {
  id: string;
  title: string;
  description?: string;
  deadline?: string; // ISO date string
  priority: Priority;
  completed: boolean;
  createdAt: string;
  recurrence: Recurrence;
  parentTaskId?: string; // To track instances of the same recurring task
}

export interface Habit {
  id: string;
  title: string;
  completedDates: string[]; // Array of YYYY-MM-DD strings
}

export type TabType = 'tasks' | 'habits' | 'calendar' | 'analytics';
