import React, { useState } from 'react';
import { Plus, Trash2, Flame, CheckCircle2, Circle } from 'lucide-react';
import { Habit } from '../types';
import { cn, formatDate } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface HabitsTabProps {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
}

export default function HabitsTab({ habits, setHabits }: HabitsTabProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const today = formatDate(new Date());

  const addHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitTitle.trim()) return;

    const habit: Habit = {
      id: crypto.randomUUID(),
      title: newHabitTitle,
      completedDates: []
    };

    setHabits([...habits, habit]);
    setNewHabitTitle('');
    setIsAdding(false);
  };

  const toggleHabit = (id: string) => {
    setHabits(habits.map(h => {
      if (h.id === id) {
        const isCompleted = h.completedDates.includes(today);
        return {
          ...h,
          completedDates: isCompleted 
            ? h.completedDates.filter(d => d !== today)
            : [...h.completedDates, today]
        };
      }
      return h;
    }));
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const getStreak = (habit: Habit) => {
    let streak = 0;
    const sortedDates = [...habit.completedDates].sort().reverse();
    let current = new Date();
    
    // Check if completed today or yesterday to start streak
    const todayStr = formatDate(current);
    const yesterday = new Date(current);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = formatDate(yesterday);

    if (!habit.completedDates.includes(todayStr) && !habit.completedDates.includes(yesterdayStr)) {
      return 0;
    }

    // Simple streak calculation (consecutive days)
    // For a more robust one, we'd iterate backwards through dates
    return habit.completedDates.length; // Placeholder: just showing total completions for now as "streak"
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#C15F3C] text-white p-6 rounded-3xl shadow-lg space-y-2">
        <h2 className="text-xl font-semibold">Daily Habits</h2>
        <p className="text-sm opacity-80">Consistency is key. Small steps every day lead to big results.</p>
      </div>

      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full py-4 px-6 rounded-2xl border-2 border-dashed border-[#49454F] text-[#CAC4D0] flex items-center justify-center gap-2 font-medium hover:bg-white/5 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add New Habit
        </button>
      )}

      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={addHabit}
            className="bg-[#2B2930] p-4 rounded-2xl border border-[#49454F] flex gap-2 shadow-md"
          >
            <input
              autoFocus
              type="text"
              placeholder="Habit name (e.g. Drink Water)"
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-[#E6E1E5] placeholder-[#CAC4D0]/50"
              value={newHabitTitle}
              onChange={e => setNewHabitTitle(e.target.value)}
            />
            <button
              type="submit"
              className="bg-[#C15F3C] text-white px-4 py-2 rounded-xl text-sm font-medium"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-[#CAC4D0] px-2"
            >
              Cancel
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {habits.map(habit => {
          const isCompletedToday = habit.completedDates.includes(today);
          return (
            <div
              key={habit.id}
              className={cn(
                "group p-4 rounded-2xl border flex items-center gap-4 transition-all",
                isCompletedToday 
                  ? "bg-[#C15F3C]/10 border-transparent" 
                  : "bg-[#2B2930] border-[#49454F]"
              )}
            >
              <button 
                onClick={() => toggleHabit(habit.id)}
                className="text-[#C15F3C] hover:scale-110 transition-transform"
              >
                {isCompletedToday ? <CheckCircle2 className="w-7 h-7" /> : <Circle className="w-7 h-7" />}
              </button>

              <div className="flex-1">
                <h3 className="font-medium text-[#E6E1E5]">{habit.title}</h3>
                <div className="flex items-center gap-1 text-[10px] font-bold text-orange-400 uppercase">
                  <Flame className="w-3 h-3 fill-orange-400" />
                  {habit.completedDates.length} Days Total
                </div>
              </div>

              <button
                onClick={() => deleteHabit(habit.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-red-400/70 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}

        {habits.length === 0 && (
          <div className="py-12 text-center text-[#CAC4D0]/60">
            <p>No habits tracked yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
