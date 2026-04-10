import React, { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths 
} from 'date-fns';
import { ChevronLeft, ChevronRight, Circle } from 'lucide-react';
import { Task } from '../types';
import { cn } from '../lib/utils';

interface CalendarTabProps {
  tasks: Task[];
}

export default function CalendarTab({ tasks }: CalendarTabProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const getTasksForDay = (day: Date) => {
    return tasks.filter(task => task.deadline && isSameDay(new Date(task.deadline), day));
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between bg-[#2B2930] p-4 rounded-3xl border border-[#49454F] shadow-sm">
        <h2 className="text-lg font-semibold text-[#E6E1E5]">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 hover:bg-[#49454F] rounded-full transition-colors text-[#CAC4D0]"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 hover:bg-[#49454F] rounded-full transition-colors text-[#CAC4D0]"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-[#2B2930] rounded-3xl border border-[#49454F] overflow-hidden shadow-sm">
        <div className="grid grid-cols-7 border-b border-[#49454F]">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-3 text-center text-[10px] font-bold uppercase text-[#CAC4D0] tracking-wider">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {calendarDays.map((day, i) => {
            const dayTasks = getTasksForDay(day);
            const isToday = isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, monthStart);

            return (
              <div 
                key={day.toString()} 
                className={cn(
                  "min-h-[80px] p-2 border-r border-b border-[#49454F]/30 last:border-r-0 flex flex-col items-center gap-1",
                  !isCurrentMonth && "bg-[#49454F]/10 opacity-30"
                )}
              >
                <span className={cn(
                  "text-xs font-medium w-7 h-7 flex items-center justify-center rounded-full",
                  isToday ? "bg-[#C15F3C] text-white" : "text-[#E6E1E5]"
                )}>
                  {format(day, 'd')}
                </span>
                
                <div className="flex flex-wrap justify-center gap-0.5 mt-auto pb-1">
                  {dayTasks.slice(0, 3).map(task => (
                    <div 
                      key={task.id} 
                      className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        task.completed ? "bg-green-400" : 
                        task.priority === 'high' ? "bg-red-500" :
                        task.priority === 'medium' ? "bg-amber-500" : "bg-blue-500"
                      )}
                    />
                  ))}
                  {dayTasks.length > 3 && (
                    <span className="text-[8px] font-bold text-[#CAC4D0]">+{dayTasks.length - 3}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 text-[10px] font-medium text-[#CAC4D0] uppercase tracking-wide">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500" /> High
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-amber-500" /> Medium
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-blue-500" /> Low
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-400" /> Completed
        </div>
      </div>
    </div>
  );
}
