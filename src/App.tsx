import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  Calendar as CalendarIcon, 
  BarChart3, 
  ListTodo, 
  Plus,
  Settings
} from 'lucide-react';
import { Task, Habit, TabType } from './types';
import { storage } from './lib/storage';
import { cn } from './lib/utils';

// Tabs
import TaskTab from './components/TaskTab';
import HabitsTab from './components/HabitsTab';
import CalendarTab from './components/CalendarTab';
import AnalyticsTab from './components/AnalyticsTab';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('tasks');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);

  // Load data on mount
  useEffect(() => {
    setTasks(storage.getTasks());
    setHabits(storage.getHabits());
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    storage.setTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    storage.setHabits(habits);
  }, [habits]);

  const renderTab = () => {
    switch (activeTab) {
      case 'tasks':
        return <TaskTab tasks={tasks} setTasks={setTasks} />;
      case 'habits':
        return <HabitsTab habits={habits} setHabits={setHabits} />;
      case 'calendar':
        return <CalendarTab tasks={tasks} />;
      case 'analytics':
        return <AnalyticsTab tasks={tasks} habits={habits} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#1C1B1F] text-[#E6E1E5] font-sans pb-24">
      {/* Header */}
      <header className="px-6 pt-8 pb-4 flex justify-between items-center sticky top-0 bg-[#1C1B1F]/80 backdrop-blur-md z-10">
        <h1 className="text-2xl font-semibold tracking-tight capitalize">
          {activeTab}
        </h1>
        <button className="p-2 rounded-full hover:bg-white/5 transition-colors">
          <Settings className="w-5 h-5 text-[#CAC4D0]" />
        </button>
      </header>

      {/* Main Content */}
      <main className="px-4 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderTab()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-8 left-0 right-0 px-6 flex flex-col items-end gap-4 max-w-2xl mx-auto z-20">
        {/* Floating Calendar Button */}
        <button
          onClick={() => setActiveTab('calendar')}
          className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300",
            activeTab === 'calendar' 
              ? "bg-[#C15F3C] text-white scale-110" 
              : "bg-white text-[#49454F] hover:bg-[#F2D8CF]"
          )}
        >
          <CalendarIcon className="w-6 h-6" />
        </button>

        {/* Pill Navbar */}
        <nav className="w-full bg-[#1C1B1F] rounded-full py-3 px-2 flex justify-around items-center shadow-xl border border-white/10">
          <NavButton 
            active={activeTab === 'tasks'} 
            onClick={() => setActiveTab('tasks')}
            icon={<ListTodo className="w-6 h-6" />}
            label="Task"
          />
          <NavButton 
            active={activeTab === 'habits'} 
            onClick={() => setActiveTab('habits')}
            icon={<CheckCircle2 className="w-6 h-6" />}
            label="Habits"
          />
          <NavButton 
            active={activeTab === 'analytics'} 
            onClick={() => setActiveTab('analytics')}
            icon={<BarChart3 className="w-6 h-6" />}
            label="Analytics"
          />
        </nav>
      </div>
    </div>
  );
}

function NavButton({ 
  active, 
  onClick, 
  icon, 
  label 
}: { 
  active: boolean; 
  onClick: () => void; 
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-0.5 py-1 px-4 transition-all duration-200",
        active ? "text-white" : "text-[#CAC4D0] hover:text-white"
      )}
    >
      <div className={cn(
        "transition-all duration-300",
        active ? "scale-110" : "scale-100 opacity-70"
      )}>
        {icon}
      </div>
      <span className={cn(
        "text-[10px] font-medium transition-all duration-200 uppercase tracking-wider",
        active ? "opacity-100" : "opacity-50"
      )}>
        {label}
      </span>
    </button>
  );
}
