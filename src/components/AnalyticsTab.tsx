import React from 'react';
import { 
  format, 
  subDays, 
  eachDayOfInterval, 
  isSameDay, 
  startOfToday,
  subWeeks,
  startOfWeek
} from 'date-fns';
import { Task, Habit } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface AnalyticsTabProps {
  tasks: Task[];
  habits: Habit[];
}

export default function AnalyticsTab({ tasks, habits }: AnalyticsTabProps) {
  const today = startOfToday();
  const startDate = startOfWeek(subWeeks(today, 12)); // 12 weeks of data
  
  const days = eachDayOfInterval({
    start: startDate,
    end: today
  });

  const getIntensity = (day: Date) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    
    // Count completed tasks for this day
    const completedTasks = tasks.filter(t => 
      t.completed && t.deadline && isSameDay(new Date(t.deadline), day)
    ).length;

    // Count completed habits for this day
    const completedHabits = habits.filter(h => 
      h.completedDates.includes(dayStr)
    ).length;

    const total = completedTasks + completedHabits;
    
    if (total === 0) return 0;
    if (total <= 2) return 1;
    if (total <= 4) return 2;
    if (total <= 6) return 3;
    return 4;
  };

  const stats = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.completed).length,
    totalHabits: habits.length,
    activeStreaks: habits.reduce((acc, h) => acc + (h.completedDates.length > 0 ? 1 : 0), 0)
  };

  const completionRate = stats.totalTasks > 0 
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100) 
    : 0;

  return (
    <div className="space-y-8 pb-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#2B2930] p-5 rounded-3xl border border-[#49454F] shadow-sm space-y-1">
          <p className="text-[10px] font-bold text-[#CAC4D0] uppercase tracking-wider">Completion Rate</p>
          <p className="text-3xl font-light text-[#C15F3C]">{completionRate}%</p>
        </div>
        <div className="bg-[#2B2930] p-5 rounded-3xl border border-[#49454F] shadow-sm space-y-1">
          <p className="text-[10px] font-bold text-[#CAC4D0] uppercase tracking-wider">Active Habits</p>
          <p className="text-3xl font-light text-[#C15F3C]">{stats.activeStreaks}</p>
        </div>
      </div>

      {/* Heatmap Section */}
      <div className="bg-[#2B2930] p-6 rounded-3xl border border-[#49454F] shadow-sm space-y-4 overflow-hidden">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold text-[#E6E1E5]">Activity Heatmap</h3>
          <span className="text-[10px] text-[#CAC4D0] font-medium uppercase">Last 12 Weeks</span>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex gap-1 overflow-x-auto pb-2 no-scrollbar">
            {/* Group days by week for the grid */}
            {Array.from({ length: 13 }).map((_, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {Array.from({ length: 7 }).map((_, dayIndex) => {
                  const day = subDays(today, (12 - weekIndex) * 7 + (6 - dayIndex));
                  if (day > today) return <div key={dayIndex} className="w-3 h-3" />;
                  
                  const intensity = getIntensity(day);
                  return (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: (weekIndex * 7 + dayIndex) * 0.002 }}
                      key={dayIndex}
                      title={format(day, 'MMM d, yyyy')}
                      className={cn(
                        "w-3 h-3 rounded-[2px] transition-colors",
                        intensity === 0 ? "bg-[#161B22]" :
                        intensity === 1 ? "bg-[#0E4429]" :
                        intensity === 2 ? "bg-[#006D32]" :
                        intensity === 3 ? "bg-[#26A641]" : "bg-[#39D353]"
                      )}
                    />
                  );
                })}
              </div>
            ))}
          </div>
          
          <div className="flex justify-end items-center gap-2 pt-2">
            <span className="text-[10px] text-[#CAC4D0]">Less</span>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map(i => (
                <div 
                  key={i} 
                  className={cn(
                    "w-2.5 h-2.5 rounded-[2px]",
                    i === 0 ? "bg-[#161B22]" :
                    i === 1 ? "bg-[#0E4429]" :
                    i === 2 ? "bg-[#006D32]" :
                    i === 3 ? "bg-[#26A641]" : "bg-[#39D353]"
                  )} 
                />
              ))}
            </div>
            <span className="text-[10px] text-[#CAC4D0]">More</span>
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-[#E6E1E5] px-2">Task Breakdown</h3>
        <div className="bg-[#2B2930] rounded-3xl border border-[#49454F] divide-y divide-[#49454F]/30 shadow-sm overflow-hidden">
          <StatRow label="Total Tasks Created" value={stats.totalTasks} />
          <StatRow label="Tasks Completed" value={stats.completedTasks} />
          <StatRow label="Pending Tasks" value={stats.totalTasks - stats.completedTasks} />
          <StatRow label="Habit Check-ins" value={habits.reduce((acc, h) => acc + h.completedDates.length, 0)} />
        </div>
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex justify-between items-center p-4">
      <span className="text-sm text-[#CAC4D0]">{label}</span>
      <span className="font-semibold text-[#E6E1E5]">{value}</span>
    </div>
  );
}
