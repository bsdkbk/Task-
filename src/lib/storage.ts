import { Task, Habit } from '../types';

const TASKS_KEY = 'dailypulse_tasks';
const HABITS_KEY = 'dailypulse_habits';

export const storage = {
  getTasks: (): Task[] => {
    const data = localStorage.getItem(TASKS_KEY);
    return data ? JSON.parse(data) : [];
  },
  setTasks: (tasks: Task[]) => {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  },
  getHabits: (): Habit[] => {
    const data = localStorage.getItem(HABITS_KEY);
    return data ? JSON.parse(data) : [];
  },
  setHabits: (habits: Habit[]) => {
    localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
  }
};
