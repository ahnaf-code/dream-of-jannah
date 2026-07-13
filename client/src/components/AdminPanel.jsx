import React, { useState } from 'react';
import { AVATARS } from '../utils/avatars';
import { Settings, ShieldCheck, UserPlus, Trash2, ListPlus, RotateCcw, AlertTriangle, Calendar, Users } from 'lucide-react';

export default function AdminPanel({ 
  kids, tasks, assignments,
  onAddKid, onDeleteKid, onAddTask, onDeleteTask, 
  onAddAssignment, onDeleteAssignment, onDeclareChampion 
}) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');

  // Kid addition state
  const [kidName, setKidName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0].id);

  // Task addition state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPoints, setTaskPoints] = useState(10);

  // Assignment state
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [selectedKidIds, setSelectedKidIds] = useState([]);
  const [assignAllKids, setAssignAllKids] = useState(true);
  const [assignDate, setAssignDate] = useState('');
  const [assignAllDates, setAssignAllDates] = useState(true);

  // Declaration state
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date();
    return d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  });
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pin === 'AzmainAhnaf') {
      setIsAdmin(true);
      setPinError('');
    } else {
      setPinError('Wrong secret word! Please try again. 🗝️');
    }
  };

  const handleCreateKid = (e) => {
    e.preventDefault();
    if (!kidName.trim()) return;
    onAddKid(kidName.trim(), selectedAvatar);
    setKidName('');
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!taskTitle.trim() || !taskPoints) return;
    onAddTask(taskTitle.trim(), parseInt(taskPoints, 10));
    setTaskTitle('');
    setTaskPoints(10);
  };

  const handleCreateAssignment = (e) => {
    e.preventDefault();
    if (!selectedTaskId) {
      alert('Please select a task!');
      return;
    }

    const kidId = assignAllKids ? null : (selectedKidIds.length > 0 ? selectedKidIds[0] : null);
    const assignedDate = assignAllDates ? null : (assignDate || null);

    if (!assignAllKids && selectedKidIds.length === 0) {
      alert('Please select at least one kid!');
      return;
    }

    if (!assignAllDates && !assignDate) {
      alert('Please select a date!');
      return;
    }

    // If assigning to multiple specific kids, create multiple assignments
    if (!assignAllKids && selectedKidIds.length > 1) {
      selectedKidIds.forEach(kidId => {
        onAddAssignment(parseInt(selectedTaskId), kidId, assignedDate);
      });
    } else {
      onAddAssignment(parseInt(selectedTaskId), kidId, assignedDate);
    }

    // Reset form
    setSelectedTaskId('');
    setSelectedKidIds([]);
    setAssignDate('');
    alert('Task assigned successfully! ✨');
  };

  const handleResetClick = () => {
    if (kids.length === 0) {
      alert('You need to add some kids first! 😊');
      return;
    }
    setShowResetConfirm(true);
  };

  const handleConfirmReset = async () => {
    await onDeclareChampion(selectedMonth);
    setShowResetConfirm(false);
    alert(`🎉 Success! Declared Champions for ${selectedMonth} and reset points for the new month! Check the Hall of Fame!`);
  };

  const toggleKidSelection = (kidId) => {
    setSelectedKidIds(prev => 
      prev.includes(kidId) 
        ? prev.filter(id => id !== kidId)
        : [...prev, kidId]
    );
  };

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        <div className="bubble-card p-8 bg-white">
          <div className="w-16 h-16 rounded-full bg-jannah-lavender flex items-center justify-center text-3xl mx-auto mb-4 text-indigo-950">
            <Settings size={32} />
          </div>
          <h2 className="text-2xl font-bold text-indigo-950 mb-2">Ahnaf Zone 🛡️</h2>
          <p className="text-slate-500 text-sm mb-6">
            Enter your secret word to access the admin panel.
          </p>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            {pinError && (
              <div className="bg-orange-50 border-2 border-orange-200 text-orange-700 px-4 py-2 rounded-xl text-sm font-semibold">
                {pinError}
              </div>
            )}
            <div>
              <label className="block text-left text-sm font-bold text-slate-600 mb-1">
                Enter Secret Word:
              </label>
              <input
                type="password"
                placeholder="Secret word..."
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full px-4 py-2 rounded-2xl border-2 border-jannah-lavender focus:outline-none focus:ring-4 focus:ring-jannah-lavender-light text-center text-lg font-bubble"
              />
            </div>
            <button type="submit" className="w-full bubble-btn-sky text-sm">
              Unlock Admin Panel 🗝️
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
      {/* Admin Header */}
      <div className="bubble-card p-6 bg-gradient-to-r from-teal-900 to-indigo-900 text-white flex items-center justify-between border-none">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-300">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Ahnaf Dashboard</h2>
            <p className="text-teal-200 text-xs">Manage kids, tasks, and assignments! 🌟</p>
          </div>
        </div>
        <button
          onClick={() => setIsAdmin(false)}
          className="bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-1.5 rounded-full text-xs font-bold transition-all"
        >
          Lock Panel 🔒
        </button>
      </div>

      {/* Task Assignments Section - NEW */}
      <div className="bubble-card p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-indigo-200">
        <h3 className="text-xl font-bold text-indigo-950 mb-4 flex items-center gap-2">
          <Calendar className="text-indigo-600" /> Task Assignments
        </h3>
        <p className="text-sm text-slate-600 mb-4">
          Assign tasks to specific kids and dates. Leave options unchecked to make it apply to all kids/dates.
        </p>

        <form onSubmit={handleCreateAssignment} className="space-y-4 mb-6">
          {/* Select Task */}
          <div>
            <label className="block text-sm font-bold text-indigo-950 mb-2">Select Task:</label>
            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border-2 border-indigo-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
            >
              <option value="">-- Choose a task --</option>
              {tasks.map(task => (
                <option key={task.id} value={task.id}>
                  {task.title} (+{task.points} ⭐)
                </option>
              ))}
            </select>
          </div>

          {/* Select Kids */}
          <div>
            <label className="block text-sm font-bold text-indigo-950 mb-2">Assign To:</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={assignAllKids}
                  onChange={(e) => {
                    setAssignAllKids(e.target.checked);
                    if (e.target.checked) setSelectedKidIds([]);
                  }}
                  className="w-4 h-4 accent-indigo-600"
                />
                <span className="text-sm font-semibold text-indigo-950">All Kids</span>
              </label>
              {!assignAllKids && (
                <div className="ml-6 space-y-1 max-h-32 overflow-y-auto">
                  {kids.map(kid => {
                    const av = AVATARS.find(a => a.id === kid.avatar) || AVATARS[0];
                    return (
                      <label key={kid.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedKidIds.includes(kid.id)}
                          onChange={() => toggleKidSelection(kid.id)}
                          className="w-4 h-4 accent-indigo-600"
                        />
                        <span className="text-lg">{av.emoji}</span>
                        <span className="text-sm font-semibold text-slate-700">{kid.name}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Select Date */}
          <div>
            <label className="block text-sm font-bold text-indigo-950 mb-2">Assign Date:</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={assignAllDates}
                  onChange={(e) => {
                    setAssignAllDates(e.target.checked);
                    if (e.target.checked) setAssignDate('');
                  }}
                  className="w-4 h-4 accent-indigo-600"
                />
                <span className="text-sm font-semibold text-indigo-950">All Dates (Recurring Daily)</span>
              </label>
              {!assignAllDates && (
                <input
                  type="date"
                  value={assignDate}
                  onChange={(e) => setAssignDate(e.target.value)}
                  className="ml-6 px-3 py-1.5 rounded-xl border-2 border-indigo-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              )}
            </div>
          </div>

          <button type="submit" className="w-full bubble-btn-periwinkle py-2 text-sm font-bold">
            Assign Task ✨
          </button>
        </form>

        {/* Existing Assignments */}
        <div className="border-t border-indigo-200 pt-4">
          <h4 className="text-sm font-bold text-indigo-950 mb-3">Current Assignments:</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {assignments && assignments.length > 0 ? (
              assignments.map(assignment => {
                const task = tasks.find(t => t.id === assignment.task_id);
                const kid = kids.find(k => k.id === assignment.kid_id);
                const av = kid ? (AVATARS.find(a => a.id === kid.avatar) || AVATARS[0]) : null;
                
                return (
                  <div key={assignment.id} className="flex items-center justify-between p-2.5 bg-white border border-indigo-100 rounded-xl">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{task?.title || 'Unknown Task'}</p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-semibold">
                          {kid ? `${av.emoji} ${kid.name}` : '👥 All Kids'}
                        </span>
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold">
                          {assignment.assigned_date ? `📅 ${assignment.assigned_date}` : '🔄 Daily'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm('Remove this assignment?')) {
                          onDeleteAssignment(assignment.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors ml-2"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 italic">No assignments yet. Create one above!</p>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid split into Kid management and Task management */}
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Kids Management Section */}
        <div className="bubble-card p-6 bg-white flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-indigo-950 mb-4 flex items-center gap-2">
              <UserPlus className="text-teal-600" /> Manage Kids
            </h3>

            {/* List of current kids with delete option */}
            <div className="space-y-3 max-h-52 overflow-y-auto mb-6 pr-2">
              {kids.map(kid => {
                const av = AVATARS.find(a => a.id === kid.avatar) || AVATARS[0];
                return (
                  <div key={kid.id} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{av.emoji}</span>
                      <span className="font-bold text-indigo-950">{kid.name}</span>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${kid.name}? All points will be lost.`)) {
                          onDeleteKid(kid.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete kid"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                );
              })}
              {kids.length === 0 && (
                <p className="text-xs text-slate-400 italic">No kids registered yet.</p>
              )}
            </div>
          </div>

          {/* Form to add a kid */}
          <form onSubmit={handleCreateKid} className="space-y-4 border-t pt-4">
            <h4 className="font-bold text-sm text-indigo-950">Add Another Child:</h4>
            <div>
              <input
                type="text"
                placeholder="Enter child's name..."
                value={kidName}
                onChange={(e) => setKidName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-jannah-periwinkle"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Select Avatar:</label>
              <div className="grid grid-cols-4 gap-2">
                {AVATARS.map(av => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setSelectedAvatar(av.id)}
                    className={`w-9 h-9 rounded-xl ${av.bg} flex items-center justify-center text-xl border-2 transition-all ${
                      selectedAvatar === av.id ? 'border-indigo-950 scale-105 shadow-sm' : 'border-transparent opacity-80'
                    }`}
                  >
                    {av.emoji}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" className="w-full bubble-btn-mint py-2 text-xs">
              Add Kid Profile 🌟
            </button>
          </form>
        </div>


        {/* Tasks Management Section */}
        <div className="bubble-card p-6 bg-white flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-indigo-950 mb-4 flex items-center gap-2">
              <ListPlus className="text-indigo-600" /> Create Tasks
            </h3>

            {/* List of current tasks with delete option */}
            <div className="space-y-3 max-h-52 overflow-y-auto mb-6 pr-2">
              {tasks.map(task => (
                <div key={task.id} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="font-bold text-slate-800 text-sm truncate">{task.title}</p>
                    <span className="text-[10px] bg-jannah-gold px-2 py-0.5 rounded-full font-black text-indigo-950">+{task.points} Stars</span>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete the task: "${task.title}"?`)) {
                        onDeleteTask(task.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete task"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              {tasks.length === 0 && (
                <p className="text-xs text-slate-400 italic">No tasks created yet.</p>
              )}
            </div>
          </div>

          {/* Form to add a task */}
          <form onSubmit={handleCreateTask} className="space-y-4 border-t pt-4">
            <h4 className="font-bold text-sm text-indigo-950">Add Custom Deed Task:</h4>
            <div>
              <input
                type="text"
                placeholder="e.g. Help make breakfast, Do prayers, etc..."
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-jannah-periwinkle"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Points Gained ({taskPoints} Stars):</label>
              <input
                type="range"
                min="5"
                max="30"
                step="5"
                value={taskPoints}
                onChange={(e) => setTaskPoints(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-950"
              />
            </div>
            <button type="submit" className="w-full bubble-btn-sky py-2 text-xs">
              Add Deed to Checklist ✨
            </button>
          </form>
        </div>
      </div>


      {/* Monthly Reset Zone */}
      <div className="bubble-card p-6 bg-amber-50/40 border-amber-200 max-w-2xl mx-auto">
        <h3 className="text-xl font-bold text-amber-800 mb-2 flex items-center gap-2">
          <RotateCcw className="text-amber-600" /> End of Month Coronation 👑
        </h3>
        <p className="text-slate-600 text-sm mb-4">
          Once a month is complete, declare the Jannah Champions! This resets all monthly scores to 0, deletes checking logs to give kids a fresh start, and preserves the Champion and Runner-up in the Hall of Fame forever!
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-slate-500 mb-1">Select Month / Season Label:</label>
            <input
              type="text"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
            />
          </div>
          <button
            onClick={handleResetClick}
            className="w-full sm:w-auto bubble-btn-gold text-xs h-10 flex items-center justify-center bg-jannah-gold border-jannah-gold-dark"
          >
            Declare Champions & Reset Scores 🏆
          </button>
        </div>
      </div>

      {/* Confirmation Modal overlay */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bubble-card max-w-md w-full bg-white p-6 shadow-2xl animate-float-slow text-center">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 mx-auto mb-4 border-2 border-amber-200">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-2xl font-bold text-indigo-950 mb-2">Are you absolutely sure?</h3>
            <p className="text-slate-500 text-sm mb-6">
              You are declaring the champions for <span className="font-extrabold text-indigo-950 underline">{selectedMonth}</span>. 
              This will reset all kids' points to 0! This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleConfirmReset}
                className="flex-1 bubble-btn-gold text-sm"
              >
                Yes, Crown Winners! 🎉
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 bubble-btn-periwinkle text-sm bg-slate-200 border-slate-300 shadow-[4px_4px_0px_0px_#cbd5e1]"
              >
                No, Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
