import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { getAvatar } from '../utils/avatars';
import { Check, ChevronLeft, Calendar } from 'lucide-react';

export default function Dashboard({ activeKid, tasks, completions, onToggleTask, onLogOut }) {
  const getLocalDateString = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState(() => getLocalDateString());
  const [weekDays, setWeekDays] = useState([]);

  // Filter tasks based on selected date
  const filteredTasks = tasks.filter(task => {
    if (task.assigned_date === null) return true;
    // Normalize both dates to YYYY-MM-DD format for comparison
    const taskDate = task.assigned_date.split('T')[0];
    const matches = taskDate === selectedDate;
    console.log('Task date check:', { taskTitle: task.title, taskDate, selectedDate, matches });
    return matches;
  });
  console.log('All tasks for kid:', tasks);
  console.log('Filtered tasks for', selectedDate, ':', filteredTasks);

  useEffect(() => {
    const days = [];
    const today = new Date();
    for (let i = -3; i <= 3; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      days.push({
        dateStr: `${year}-${month}-${day}`,
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: d.getDate(),
        isToday: i === 0
      });
    }
    setWeekDays(days);
  }, []);

  const avatarObj = getAvatar(activeKid.avatar);

  const triggerStarryConfetti = () => {
    const duration = 1.5 * 1000;
    const end = Date.now() + duration;
    const colors = ['#B2F7EF', '#A0C4FF', '#E6E6FA', '#FDFFB6', '#DCD0FF', '#7DB0FF'];

    (function frame() {
      confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    }());
  };

  const handleTaskToggle = async (taskId) => {
    const result = await onToggleTask(activeKid.id, taskId, selectedDate);
    if (result && result.completed) triggerStarryConfetti();
  };

  const formatDisplayDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'long' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Kid Header Profile Card */}
      <div className="bubble-card p-6 bg-gradient-to-r from-jannah-dark-card to-jannah-dark-hover border-jannah-periwinkle-dark text-white shadow-[0_0_20px_rgba(147,156,255,0.2)] flex flex-col sm:flex-row items-center justify-between gap-6 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <span className="absolute top-4 left-10 text-xl animate-twinkle">🌟</span>
          <span className="absolute top-16 right-16 text-sm animate-twinkle" style={{ animationDelay: '1s' }}>🌟</span>
          <span className="absolute bottom-6 left-1/3 text-lg animate-twinkle" style={{ animationDelay: '2s' }}>🌟</span>
          <span className="absolute bottom-12 right-12 text-sm animate-twinkle" style={{ animationDelay: '1.5s' }}>🌟</span>
        </div>

        <div className="flex items-center gap-4 z-10">
          <button 
            onClick={onLogOut}
            className="p-2 rounded-full bg-jannah-dark-bg/50 hover:bg-jannah-dark-bg transition-all text-jannah-lavender border border-jannah-dark-border"
            title="Switch Kid"
          >
            <ChevronLeft size={24} />
          </button>

          <div className={`w-20 h-20 rounded-full ${avatarObj.bg} flex items-center justify-center text-4xl shadow-[0_0_15px_rgba(216,180,254,0.4)] border-2 ${avatarObj.border} animate-bounce-slow`}>
            {avatarObj.emoji}
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2 glow-text">
              Assalamu Alaikum, {activeKid.name}! 👋
            </h2>
            <p className="text-jannah-lavender text-sm font-medium">
              Keep doing good deeds to fly higher in Jannah! 🕌🚀
            </p>
          </div>
        </div>

        <div className="bg-jannah-dark-bg/50 border-2 border-jannah-gold/50 backdrop-blur-md rounded-2xl px-6 py-4 flex flex-col items-center justify-center text-center min-w-[140px] z-10 shadow-[0_0_15px_rgba(249,248,113,0.2)]">
          <span className="text-xs font-bold text-jannah-gold uppercase tracking-wider">Jannah Stars</span>
          <span className="text-4xl font-extrabold text-jannah-gold animate-pulse glow-gold">
            🌟 {activeKid.points}
          </span>
        </div>
      </div>

      {/* Date Carousel Navigation */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="text-jannah-periwinkle" size={20} />
          <h3 className="text-lg font-bold text-white">Pick a Day to Track:</h3>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => {
            const isSelected = day.dateStr === selectedDate;
            return (
              <button
                key={day.dateStr}
                onClick={() => setSelectedDate(day.dateStr)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border-2 transition-all ${
                  isSelected
                    ? 'bg-jannah-periwinkle border-jannah-periwinkle-dark shadow-[0_0_15px_rgba(147,156,255,0.5)] text-indigo-950 font-bold scale-105'
                    : 'bg-jannah-dark-card border-jannah-dark-border text-jannah-lavender hover:border-jannah-periwinkle-dark'
                }`}
              >
                <span className="text-xs uppercase font-bold">{day.dayName}</span>
                <span className="text-lg font-extrabold mt-0.5">{day.dayNum}</span>
                {day.isToday && (
                  <span className="w-1.5 h-1.5 rounded-full bg-jannah-gold mt-1"></span>
                )}
              </button>
            );
          })}
        </div>

        <div className="text-center mt-3 text-jannah-lavender font-semibold bg-jannah-dark-card/50 py-2 rounded-xl border border-jannah-dark-border">
          📅 Showing checklist for: <span className="font-bold text-white underline">{formatDisplayDate(selectedDate)}</span>
        </div>
      </div>

      {/* Checklist Grid */}
      <div className="space-y-4">
        {[...filteredTasks].sort((a, b) => {
          const aCompleted = completions.some(c => c.task_id === a.id && c.completed_date === selectedDate);
          const bCompleted = completions.some(c => c.task_id === b.id && c.completed_date === selectedDate);
          if (aCompleted && !bCompleted) return 1;
          if (!aCompleted && bCompleted) return -1;
          return 0;
        }).map((task) => {
          const isCompleted = completions.some(c => c.task_id === task.id && c.completed_date === selectedDate);
          
          return (
            <div
              key={task.id}
              onClick={() => handleTaskToggle(task.id)}
              className={`bubble-card p-5 flex items-center justify-between gap-4 cursor-pointer select-none transition-all duration-300 ${
                isCompleted 
                  ? 'border-jannah-mint-dark shadow-[0_0_15px_rgba(141,241,228,0.3)]' 
                  : 'hover:border-jannah-periwinkle-dark'
              }`}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all ${
                  isCompleted 
                    ? 'bg-jannah-mint border-jannah-mint-dark text-indigo-950 scale-110 shadow-[0_0_15px_rgba(141,241,228,0.5)]' 
                    : 'bg-jannah-dark-bg border-jannah-dark-border text-transparent'
                }`}>
                  <Check size={28} className="stroke-[3]" />
                </div>

                <div>
                  <h4 className={`text-lg md:text-xl font-bold transition-all ${
                    isCompleted ? 'text-jannah-mint line-through opacity-80' : 'text-white'
                  }`}>
                    {task.title}
                  </h4>
                  <p className="text-xs font-semibold text-jannah-lavender/60 mt-0.5">
                    Tap to mark completed
                  </p>
                </div>
              </div>

              <div className={`px-4 py-2 rounded-2xl font-black border-2 transition-all ${
                isCompleted 
                  ? 'bg-jannah-mint border-jannah-mint-dark text-indigo-950 shadow-[0_0_10px_rgba(141,241,228,0.4)]' 
                  : 'bg-jannah-gold border-jannah-gold-dark text-indigo-950 shadow-[0_0_10px_rgba(249,248,113,0.4)]'
              }`}>
                +{task.points} 🌟
              </div>
            </div>
          );
        })}

        {filteredTasks.length === 0 && (
          <div className="text-center p-12 bubble-card border-dashed border-jannah-periwinkle-dark">
            <p className="text-lg text-jannah-lavender font-bold">No tasks for this date! ✨</p>
          </div>
        )}
      </div>
    </div>
  );
}
