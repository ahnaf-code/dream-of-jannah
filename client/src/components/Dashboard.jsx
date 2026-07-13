import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { getAvatar } from '../utils/avatars';
import { Sparkles, Check, RefreshCw, ChevronLeft, Calendar } from 'lucide-react';

export default function Dashboard({ activeKid, tasks, completions, onToggleTask, onLogOut }) {
  // Helper function to get local date string in YYYY-MM-DD format
  const getLocalDateString = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState(() => {
    return getLocalDateString();
  });
  const [weekDays, setWeekDays] = useState([]);

  // Generate the current week days (7 days centered around today)
  useEffect(() => {
    const days = [];
    const today = new Date();
    // Start from 3 days ago to 3 days ahead to give a nice 7-day bubble row
    for (let i = -3; i <= 3; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      // Format as YYYY-MM-DD using local date to avoid timezone issues
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

  // Trigger beautiful starry custom confetti
  const triggerStarryConfetti = () => {
    const duration = 1.5 * 1000;
    const end = Date.now() + duration;

    // Pastel colors: mint, sky blue, lavender, gold (NO red, NO pink!)
    const colors = ['#B2F7EF', '#A0C4FF', '#E6E6FA', '#FDFFB6', '#DCD0FF', '#7DB0FF'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const handleTaskToggle = async (taskId) => {
    const wasCompleted = completions.some(c => c.task_id === taskId && c.completed_date === selectedDate);
    
    // Call the parent handler
    const result = await onToggleTask(activeKid.id, taskId, selectedDate);
    
    // If it was toggled on (completed), burst the confetti!
    if (result && result.completed) {
      triggerStarryConfetti();
    }
  };

  // Helper to format the display date (fixes timezone issue)
  const formatDisplayDate = (dateStr) => {
    // Parse as local date to avoid timezone shift
    const [year, month, day] = dateStr.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'long' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Kid Header Profile Card */}
      <div className="bubble-card p-6 bg-gradient-to-r from-indigo-950 to-purple-900 border-none text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 mb-8 relative overflow-hidden">
        {/* Twinkling background stars decoration */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <span className="absolute top-4 left-10 text-xl animate-twinkle">🌟</span>
          <span className="absolute top-16 right-16 text-sm animate-twinkle" style={{ animationDelay: '1s' }}>🌟</span>
          <span className="absolute bottom-6 left-1/3 text-lg animate-twinkle" style={{ animationDelay: '2s' }}>🌟</span>
          <span className="absolute bottom-12 right-12 text-sm animate-twinkle" style={{ animationDelay: '1.5s' }}>🌟</span>
        </div>

        <div className="flex items-center gap-4 z-10">
          <button 
            onClick={onLogOut}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white border border-white/20"
            title="Switch Kid"
          >
            <ChevronLeft size={24} />
          </button>

          <div className={`w-20 h-20 rounded-full ${avatarObj.bg} flex items-center justify-center text-4xl shadow-md border-4 border-white/50 animate-bounce-slow`}>
            {avatarObj.emoji}
          </div>

          <div>
            <h2 className="text-3xl font-extrabold flex items-center gap-2">
              Assalamu Alaikum, {activeKid.name}! 👋
            </h2>
            <p className="text-jannah-periwinkle text-sm font-medium">
              Keep doing good deeds to fly higher in Jannah! 🕌🚀
            </p>
          </div>
        </div>

        <div className="bg-white/10 border-2 border-white/20 backdrop-blur-md rounded-2xl px-6 py-4 flex flex-col items-center justify-center text-center shadow-inner min-w-[140px] z-10">
          <span className="text-xs font-bold text-jannah-gold uppercase tracking-wider">Jannah Stars</span>
          <span className="text-4xl font-extrabold text-jannah-gold animate-pulse drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
            🌟 {activeKid.points}
          </span>
        </div>
      </div>

      {/* Date Carousel Navigation */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="text-indigo-950" size={20} />
          <h3 className="text-lg font-bold text-indigo-950">Pick a Day to Track:</h3>
        </div>

        {/* 7-day Carousel */}
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => {
            const isSelected = day.dateStr === selectedDate;
            return (
              <button
                key={day.dateStr}
                onClick={() => setSelectedDate(day.dateStr)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border-2 transition-all ${
                  isSelected
                    ? 'bg-jannah-periwinkle border-jannah-periwinkle-dark shadow-md text-indigo-950 font-bold scale-105'
                    : 'bg-white border-slate-200 text-slate-500 hover:border-jannah-lavender-dark'
                }`}
              >
                <span className="text-xs uppercase font-bold">{day.dayName}</span>
                <span className="text-lg font-extrabold mt-0.5">{day.dayNum}</span>
                {day.isToday && (
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-950 mt-1"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Detailed Date Display */}
        <div className="text-center mt-3 text-indigo-950 font-semibold bg-jannah-lavender/40 py-2 rounded-xl border border-jannah-lavender">
          📅 Showing checklist for: <span className="font-bold underline">{formatDisplayDate(selectedDate)}</span>
        </div>
      </div>

      {/* Checklist Grid */}
      <div className="space-y-4">
        {[...tasks].sort((a, b) => {
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
                  ? 'bg-jannah-mint-light/40 border-jannah-mint-dark shadow-[4px_4px_0px_0px_#8df1e4]' 
                  : 'bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-4 flex-1">
                {/* Custom Checkbox */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-4 transition-all ${
                  isCompleted 
                    ? 'bg-jannah-mint border-jannah-mint-dark text-indigo-950 scale-110 shadow-md' 
                    : 'bg-slate-50 border-slate-200 text-transparent'
                }`}>
                  <Check size={28} className="stroke-[3]" />
                </div>

                <div>
                  <h4 className={`text-lg md:text-xl font-bold transition-all ${
                    isCompleted ? 'text-indigo-950 line-through opacity-80' : 'text-slate-800'
                  }`}>
                    {task.title}
                  </h4>
                  <p className="text-xs font-semibold text-slate-400 mt-0.5">
                    Tap to mark completed
                  </p>
                </div>
              </div>

              {/* Point badge */}
              <div className={`px-4 py-2 rounded-2xl font-black border-2 transition-all ${
                isCompleted 
                  ? 'bg-jannah-mint border-jannah-mint-dark text-indigo-950' 
                  : 'bg-jannah-gold border-jannah-gold-dark text-indigo-950 shadow-[2px_2px_0px_0px_#F9F871]'
              }`}>
                +{task.points} 🌟
              </div>
            </div>
          );
        })}

        {tasks.length === 0 && (
          <div className="text-center p-12 bg-white rounded-3xl border-4 border-dashed border-jannah-periwinkle-dark">
            <p className="text-lg text-slate-500 font-bold">No tasks added yet! Go to Admin Panel or ask Mom & Dad to add your good deeds list! ✨</p>
          </div>
        )}
      </div>
    </div>
  );
}
