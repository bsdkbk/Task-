import React, { useState } from 'react';
import { Plus, Trash2, Calendar as CalendarIcon, AlertCircle, CheckCircle2, Circle, ListTodo, RefreshCcw } from 'lucide-react';
import { Task, Priority, Recurrence } from '../types';
import { cn } from '../lib/utils';
import { format, addDays, addWeeks, addMonths } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';

interface TaskTabProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export default function TaskTab({ tasks, setTasks }: TaskTabProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    deadline: '',
    priority: 'medium' as Priority,
    recurrence: 'none' as Recurrence
  });

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    const task: Task = {
      id: crypto.randomUUID(),
      title: newTask.title,
      description: newTask.description,
      deadline: newTask.deadline || undefined,
      priority: newTask.priority,
      completed: false,
      createdAt: new Date().toISOString(),
      recurrence: newTask.recurrence
    };

    setTasks([task, ...tasks]);
    setNewTask({ title: '', description: '', deadline: '', priority: 'medium', recurrence: 'none' });
    setIsAdding(false);
  };

  const toggleTask = (id: string) => {
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) return;

    const task = tasks[taskIndex];
    const isCompleting = !task.completed;

    // Update the current task
    const updatedTasks = tasks.map(t => t.id === id ? { ...t, completed: isCompleting } : t);

    // If completing a recurring task, create the next instance
    if (isCompleting && task.recurrence !== 'none') {
      const nextDeadline = task.deadline ? new Date(task.deadline) : new Date();
      let newDeadline: Date;

      switch (task.recurrence) {
        case 'daily':
          newDeadline = addDays(nextDeadline, 1);
          break;
        case 'weekly':
          newDeadline = addWeeks(nextDeadline, 1);
          break;
        case 'monthly':
          newDeadline = addMonths(nextDeadline, 1);
          break;
        default:
          newDeadline = nextDeadline;
      }

      const nextTask: Task = {
        ...task,
        id: crypto.randomUUID(),
        completed: false,
        deadline: newDeadline.toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        parentTaskId: task.parentTaskId || task.id
      };

      setTasks([nextTask, ...updatedTasks]);
    } else {
      setTasks(updatedTasks);
    }
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const priorityMap = { high: 0, medium: 1, low: 2 };
    return priorityMap[a.priority] - priorityMap[b.priority];
  });

  return (
    <div className="space-y-6">
      {/* Add Task Button */}
      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full py-4 px-6 rounded-2xl bg-[#C15F3C] text-white flex items-center justify-center gap-2 font-medium hover:bg-[#D1704D] transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add New Task
        </button>
      )}

      {/* Add Task Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={addTask}
            className="bg-[#2B2930] p-6 rounded-3xl border border-[#49454F] space-y-4 overflow-hidden shadow-lg"
          >
            <input
              autoFocus
              type="text"
              placeholder="Task title"
              className="w-full text-lg font-medium bg-transparent border-none focus:ring-0 placeholder-[#CAC4D0]/50 text-[#E6E1E5]"
              value={newTask.title}
              onChange={e => setNewTask({ ...newTask, title: e.target.value })}
            />
            <textarea
              placeholder="Description (optional)"
              className="w-full text-sm bg-transparent border-none focus:ring-0 placeholder-[#CAC4D0]/50 text-[#CAC4D0] resize-none"
              value={newTask.description}
              onChange={e => setNewTask({ ...newTask, description: e.target.value })}
            />
            
            <div className="flex flex-wrap gap-4 items-center justify-between pt-2">
              <div className="flex flex-col gap-3 w-full">
                <div className="flex gap-2">
                  {(['low', 'medium', 'high'] as Priority[]).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewTask({ ...newTask, priority: p })}
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium capitalize transition-all",
                        newTask.priority === p 
                          ? "bg-[#C15F3C] text-white" 
                          : "bg-[#49454F] text-[#CAC4D0] hover:bg-[#C15F3C]/10"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-[10px] font-bold text-[#CAC4D0] uppercase tracking-wider mr-1">Repeat:</span>
                  {(['none', 'daily', 'weekly', 'monthly'] as Recurrence[]).map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setNewTask({ ...newTask, recurrence: r })}
                      className={cn(
                        "px-2 py-1 rounded-lg text-[10px] font-medium capitalize transition-all",
                        newTask.recurrence === r 
                          ? "bg-[#C15F3C]/20 text-[#C15F3C] border border-[#C15F3C]" 
                          : "bg-[#49454F]/30 text-[#CAC4D0] border border-transparent hover:bg-[#49454F]"
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 w-full pt-2">
                <CalendarIcon className="w-4 h-4 text-[#CAC4D0]" />
                <input
                  type="date"
                  className="text-xs bg-[#49454F] text-[#CAC4D0] px-3 py-1 rounded-full border-none focus:ring-0 color-scheme-dark flex-1"
                  value={newTask.deadline}
                  onChange={e => setNewTask({ ...newTask, deadline: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-[#C15F3C] text-white py-2 rounded-full font-medium hover:bg-[#D1704D] transition-colors"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="flex-1 bg-transparent text-[#C15F3C] py-2 rounded-full font-medium hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Task List */}
      <div className="space-y-3">
        {sortedTasks.map(task => (
          <motion.div
            layout
            key={task.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              "group p-4 rounded-2xl border transition-all flex items-start gap-4",
              task.completed 
                ? "bg-[#49454F]/20 border-transparent opacity-60" 
                : "bg-[#2B2930] border-[#49454F] hover:border-[#D0BCFF] shadow-sm"
            )}
          >
            <button 
              onClick={() => toggleTask(task.id)}
              className="mt-1 text-[#C15F3C] hover:scale-110 transition-transform"
            >
              {task.completed ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
            </button>
            
            <div className="flex-1 space-y-1">
              <h3 className={cn(
                "font-medium transition-all text-[#E6E1E5]",
                task.completed && "line-through text-[#CAC4D0]"
              )}>
                {task.title}
              </h3>
              {task.description && (
                <p className="text-sm text-[#CAC4D0] line-clamp-2">{task.description}</p>
              )}
              
              <div className="flex flex-wrap gap-3 pt-1">
                {task.deadline && (
                  <div className="flex items-center gap-1 text-[10px] font-medium text-[#C15F3C] bg-[#49454F] px-2 py-0.5 rounded-full">
                    <CalendarIcon className="w-3 h-3" />
                    {format(new Date(task.deadline), 'MMM d')}
                  </div>
                )}
                {task.recurrence !== 'none' && (
                  <div className="flex items-center gap-1 text-[10px] font-medium text-[#C15F3C] bg-[#C15F3C]/10 px-2 py-0.5 rounded-full border border-[#C15F3C]/20">
                    <RefreshCcw className="w-3 h-3" />
                    {task.recurrence}
                  </div>
                )}
                <div className={cn(
                  "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                  task.priority === 'high' ? "text-red-400 bg-red-400/10" :
                  task.priority === 'medium' ? "text-amber-400 bg-amber-400/10" :
                  "text-blue-400 bg-blue-400/10"
                )}>
                  {task.priority}
                </div>
              </div>
            </div>

            <button
              onClick={() => deleteTask(task.id)}
              className="opacity-0 group-hover:opacity-100 p-2 text-red-400/70 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </motion.div>
        ))}

        {tasks.length === 0 && (
          <div className="py-12 text-center space-y-2">
            <div className="w-16 h-16 bg-[#2B2930] border border-[#49454F] rounded-full flex items-center justify-center mx-auto">
              <ListTodo className="w-8 h-8 text-[#C15F3C]" />
            </div>
            <p className="text-[#E6E1E5] font-medium">No tasks yet</p>
            <p className="text-xs text-[#CAC4D0]/60">Tap the button above to start your day</p>
          </div>
        )}
      </div>
    </div>
  );
}
