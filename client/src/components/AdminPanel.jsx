import React, { useState } from 'react';
import { AVATARS } from '../utils/avatars';
import { Settings, ShieldCheck, UserPlus, Trash2, ListPlus, RotateCcw, AlertTriangle, Calendar } from 'lucide-react';

export default function AdminPanel({ 
  kids, tasks, assignments,
  onAddKid, onDeleteKid, onAddTask, onDeleteTask, 
  onAddAssignment, onDeleteAssignment, onDeclareChampion 
}) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [kidName, setKidName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0].id);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPoints, setTaskPoints] = useState(10);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [selectedKidIds, setSelectedKidIds] = useState([]);
  const [assignAllKids, setAssignAllKids] = useState(true);
  const [assignDate, setAssignDate] = useState('');
  const [assignAllDates, setAssignAllDates] = useState(true);
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
    if (!selectedTaskId) { alert('Please select a task!'); return; }
    const kidId = assignAllKids ? null : (selectedKidIds.length > 0 ? selectedKidIds[0] : null);
    const assignedDate = assignAllDates ? null : (assignDate || null);
    if (!assignAllKids && selectedKidIds.length === 0) { alert('Please select at least one kid!'); return; }
    if (!assignAllDates && !assignDate) { alert('Please select a date!'); return; }
    if (!assignAllKids && selectedKidIds.length > 1) {
      selectedKidIds.forEach(kidId => { onAddAssignment(parseInt(selectedTaskId), kidId, assignedDate); });
    } else {
      onAddAssignment(parseInt(selectedTaskId), kidId, assignedDate);
    }
    setSelectedTaskId('');
    setSelectedKidIds([]);
    setAssignDate('');
    alert('Task assigned successfully! ✨');
  };

  const handleResetClick = () => {
    if (kids.length === 0) { alert('You need to add some kids first! 😊'); return; }
    setShowResetConfirm(true);
  };

  const handleConfirmReset = async () => {
    await onDeclareChampion(selectedMonth);
    setShowResetConfirm(false);
    alert(`🎉 Success! Declared Champions for ${selectedMonth} and reset points for the new month!`);
  };

  const toggleKidSelection = (kidId) => {
    setSelectedKidIds(prev => prev.includes(kidId) ? prev.filter(id => id !== kidId) : [...prev, kidId]);
  };

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        <div className="bubble-card p-8">
          <div className="w-16 h-16 rounded-full bg-jannah-dark-bg flex items-center justify-center text-3xl mx-auto mb-4 text-jannah-periwinkle border-2 border-jannah-periwinkle-dark">
            <Settings size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 glow-text">Ahnaf Zone 🛡️</h2>
          <p className="text-jannah-lavender text-sm mb-6">Enter your secret word to access the admin panel.</p>
          <form onSubmit={handlePinSubmit} className="space-y-4">
            {pinError && (
              <div className="bg-red-900/30 border-2 border-red-500/50 text-red-300 px-4 py-2 rounded-xl text-sm font-semibold">{pinError}</div>
            )}
            <div>
              <label className="block text-left text-sm font-bold text-jannah-lavender mb-1">Enter Secret Word:</label>
              <input type="password" placeholder="Secret word..." value={pin} onChange={(e) => setPin(e.target.value)}
                className="w-full px-4 py-2 rounded-2xl border-2 border-jannah-dark-border bg-jannah-dark-bg text-white placeholder-jannah-lavender/50 focus:outline-none focus:ring-4 focus:ring-jannah-periwinkle/30 text-center text-lg font-bubble" />
            </div>
            <button type="submit" className="w-full bubble-btn-sky text-sm">Unlock Admin Panel 🗝️</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
      {/* Admin Header */}
      <div className="bubble-card p-6 bg-gradient-to-r from-jannah-dark-card to-jannah-dark-hover border-jannah-mint-dark text-white flex items-center justify-between shadow-[0_0_20px_rgba(141,241,228,0.2)]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-jannah-mint/20 flex items-center justify-center text-jannah-mint border border-jannah-mint-dark">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Ahnaf Dashboard</h2>
            <p className="text-jannah-mint text-xs">Manage kids, tasks, and assignments! 🌟</p>
          </div>
        </div>
        <button onClick={() => setIsAdmin(false)} className="bg-jannah-dark-bg/50 hover:bg-jannah-dark-bg border border-jannah-dark-border px-4 py-1.5 rounded-full text-xs font-bold transition-all text-jannah-lavender">
          Lock Panel 🔒
        </button>
      </div>

      {/* Task Assignments Section */}
      <div className="bubble-card p-6 border-jannah-periwinkle-dark">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Calendar className="text-jannah-periwinkle" /> Task Assignments
        </h3>
        <p className="text-sm text-jannah-lavender mb-4">Assign tasks to specific kids and dates. Leave options unchecked to make it apply to all kids/dates.</p>

        <form onSubmit={handleCreateAssignment} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-bold text-jannah-lavender mb-2">Select Task:</label>
            <select value={selectedTaskId} onChange={(e) => setSelectedTaskId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border-2 border-jannah-dark-border bg-jannah-dark-bg text-white text-sm focus:outline-none focus:ring-2 focus:ring-jannah-periwinkle/50">
              <option value="">-- Choose a task --</option>
              {tasks.map(task => (<option key={task.id} value={task.id}>{task.title} (+{task.points} ⭐)</option>))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-jannah-lavender mb-2">Assign To:</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={assignAllKids} onChange={(e) => { setAssignAllKids(e.target.checked); if (e.target.checked) setSelectedKidIds([]); }} className="w-4 h-4 accent-jannah-periwinkle" />
                <span className="text-sm font-semibold text-white">All Kids</span>
              </label>
              {!assignAllKids && (
                <div className="ml-6 space-y-1 max-h-32 overflow-y-auto">
                  {kids.map(kid => {
                    const av = AVATARS.find(a => a.id === kid.avatar) || AVATARS[0];
                    return (
                      <label key={kid.id} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={selectedKidIds.includes(kid.id)} onChange={() => toggleKidSelection(kid.id)} className="w-4 h-4 accent-jannah-periwinkle" />
                        <span className="text-lg">{av.emoji}</span>
                        <span className="text-sm font-semibold text-white">{kid.name}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-jannah-lavender mb-2">Assign Date:</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={assignAllDates} onChange={(e) => { setAssignAllDates(e.target.checked); if (e.target.checked) setAssignDate(''); }} className="w-4 h-4 accent-jannah-periwinkle" />
                <span className="text-sm font-semibold text-white">All Dates (Recurring Daily)</span>
              </label>
              {!assignAllDates && (
                <input type="date" value={assignDate} onChange={(e) => setAssignDate(e.target.value)}
                  className="ml-6 px-3 py-1.5 rounded-xl border-2 border-jannah-dark-border bg-jannah-dark-bg text-white text-sm focus:outline-none focus:ring-2 focus:ring-jannah-periwinkle/50" />
              )}
            </div>
          </div>

          <button type="submit" className="w-full bubble-btn-periwinkle py-2 text-sm font-bold">Assign Task ✨</button>
        </form>

        {/* Existing Assignments */}
        <div className="border-t border-jannah-dark-border pt-4">
          <h4 className="text-sm font-bold text-white mb-3">Current Assignments:</h4>
          {assignments && assignments.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {tasks.map(task => {
                const taskAssignments = assignments.filter(a => a.task_id === task.id);
                if (taskAssignments.length === 0) return null;
                return (
                  <div key={task.id} className="bg-jannah-dark-bg border border-jannah-dark-border rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-jannah-dark-border">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{task.title}</p>
                        <span className="text-xs bg-jannah-gold px-2 py-0.5 rounded-full font-black text-indigo-950">+{task.points} ⭐</span>
                      </div>
                      <button onClick={() => { if (confirm(`Delete "${task.title}" from ALL kids?`)) { taskAssignments.forEach(a => onDeleteAssignment(a.id)); } }}
                        className="ml-2 px-3 py-1 text-xs font-bold text-red-400 bg-red-900/30 hover:bg-red-900/50 rounded-lg border border-red-500/30 transition-colors" title="Delete from all kids">Delete All</button>
                    </div>
                    <div className="space-y-1.5">
                      {taskAssignments.map(assignment => {
                        const kid = kids.find(k => k.id === assignment.kid_id);
                        const av = kid ? (AVATARS.find(a => a.id === kid.avatar) || AVATARS[0]) : null;
                        return (
                          <div key={assignment.id} className="flex items-center justify-between p-2 bg-jannah-dark-hover rounded-lg">
                            <div className="flex-1 flex items-center gap-2">
                              <span className="text-xs font-semibold text-white">{kid ? `${av.emoji} ${kid.name}` : '👥 All Kids'}</span>
                              <span className="text-xs bg-jannah-periwinkle/20 text-jannah-periwinkle px-2 py-0.5 rounded-full font-semibold">{assignment.assigned_date ? `📅 ${assignment.assigned_date}` : '🔄 Daily'}</span>
                            </div>
                            <button onClick={() => { const target = kid ? kid.name : 'all kids'; if (confirm(`Remove "${task.title}" from ${target}?`)) { onDeleteAssignment(assignment.id); } }}
                              className="p-1 text-jannah-lavender/60 hover:text-red-400 rounded hover:bg-red-900/30 transition-colors" title={`Remove from ${kid ? kid.name : 'all kids'}`}><Trash2 size={14} /></button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-jannah-lavender/60 italic">No assignments yet. Create one above!</p>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Kids Management */}
        <div className="bubble-card p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><UserPlus className="text-jannah-mint" /> Manage Kids</h3>
            <div className="space-y-3 max-h-52 overflow-y-auto mb-6 pr-2">
              {kids.map(kid => {
                const av = AVATARS.find(a => a.id === kid.avatar) || AVATARS[0];
                return (
                  <div key={kid.id} className="flex items-center justify-between p-2.5 bg-jannah-dark-bg border border-jannah-dark-border rounded-2xl">
                    <div className="flex items-center gap-2"><span className="text-2xl">{av.emoji}</span><span className="font-bold text-white">{kid.name}</span></div>
                    <button onClick={() => { if (confirm(`Delete ${kid.name}? All points will be lost.`)) { onDeleteKid(kid.id); } }}
                      className="p-1.5 text-jannah-lavender/60 hover:text-red-400 rounded-lg hover:bg-red-900/30 transition-colors" title="Delete kid"><Trash2 size={18} /></button>
                  </div>
                );
              })}
              {kids.length === 0 && (<p className="text-xs text-jannah-lavender/60 italic">No kids registered yet.</p>)}
            </div>
          </div>
          <form onSubmit={handleCreateKid} className="space-y-4 border-t border-jannah-dark-border pt-4">
            <h4 className="font-bold text-sm text-white">Add Another Child:</h4>
            <input type="text" placeholder="Enter child's name..." value={kidName} onChange={(e) => setKidName(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl border-2 border-jannah-dark-border bg-jannah-dark-bg text-white placeholder-jannah-lavender/50 text-sm focus:outline-none focus:ring-2 focus:ring-jannah-periwinkle/50" />
            <div>
              <label className="block text-xs font-bold text-jannah-lavender mb-1">Select Avatar:</label>
              <div className="grid grid-cols-4 gap-2">
                {AVATARS.map(av => (
                  <button key={av.id} type="button" onClick={() => setSelectedAvatar(av.id)}
                    className={`w-9 h-9 rounded-xl ${av.bg} flex items-center justify-center text-xl border-2 transition-all ${selectedAvatar === av.id ? 'border-white scale-105 shadow-[0_0_10px_rgba(255,255,255,0.4)]' : 'border-transparent opacity-80'}`}>{av.emoji}</button>
                ))}
              </div>
            </div>
            <button type="submit" className="w-full bubble-btn-mint py-2 text-xs">Add Kid Profile 🌟</button>
          </form>
        </div>

        {/* Tasks Management */}
        <div className="bubble-card p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><ListPlus className="text-jannah-sky" /> Manage Tasks</h3>
            <div className="space-y-3 max-h-52 overflow-y-auto mb-6 pr-2">
              {tasks.map(task => (
                <div key={task.id} className="flex items-center justify-between p-2.5 bg-jannah-dark-bg border border-jannah-dark-border rounded-2xl">
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="font-bold text-white text-sm truncate">{task.title}</p>
                    <span className="text-[10px] bg-jannah-gold px-2 py-0.5 rounded-full font-black text-indigo-950">+{task.points} Stars</span>
                  </div>
                  <button onClick={() => { if (confirm(`Delete task: "${task.title}"?`)) { onDeleteTask(task.id); } }}
                    className="px-3 py-1.5 text-xs font-bold text-red-400 bg-red-900/30 hover:bg-red-900/50 rounded-lg border border-red-500/30 transition-colors" title="Delete this task permanently">Delete</button>
                </div>
              ))}
              {tasks.length === 0 && (<p className="text-xs text-jannah-lavender/60 italic">No tasks created yet.</p>)}
            </div>
          </div>
          <form onSubmit={handleCreateTask} className="space-y-4 border-t border-jannah-dark-border pt-4">
            <h4 className="font-bold text-sm text-white">Add Custom Deed Task:</h4>
            <input type="text" placeholder="e.g. Help make breakfast, Do prayers..." value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl border-2 border-jannah-dark-border bg-jannah-dark-bg text-white placeholder-jannah-lavender/50 text-sm focus:outline-none focus:ring-2 focus:ring-jannah-periwinkle/50" />
            <div>
              <label className="block text-xs font-bold text-jannah-lavender mb-1">Points Gained ({taskPoints} Stars):</label>
              <input type="range" min="5" max="30" step="5" value={taskPoints} onChange={(e) => setTaskPoints(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-jannah-dark-bg rounded-lg appearance-none cursor-pointer accent-jannah-periwinkle" />
            </div>
            <button type="submit" className="w-full bubble-btn-sky py-2 text-xs">Add Deed to Checklist ✨</button>
          </form>
        </div>
      </div>

      {/* Monthly Reset Zone */}
      <div className="bubble-card p-6 border-jannah-gold/30 max-w-2xl mx-auto shadow-[0_0_15px_rgba(249,248,113,0.1)]">
        <h3 className="text-xl font-bold text-jannah-gold mb-2 flex items-center gap-2"><RotateCcw className="text-jannah-gold" /> End of Month Coronation 👑</h3>
        <p className="text-jannah-lavender text-sm mb-4">Declare the Jannah Champions! This resets all monthly scores to 0 and preserves the Champion and Runner-up in the Hall of Fame!</p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-jannah-lavender mb-1">Select Month / Season Label:</label>
            <input type="text" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl border-2 border-jannah-dark-border bg-jannah-dark-bg text-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-jannah-gold/50" />
          </div>
          <button onClick={handleResetClick} className="w-full sm:w-auto bubble-btn-gold text-xs h-10 flex items-center justify-center">Declare Champions & Reset Scores 🏆</button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bubble-card max-w-md w-full p-6 shadow-[0_0_30px_rgba(249,248,113,0.3)] animate-float-slow text-center border-jannah-gold/30">
            <div className="w-16 h-16 bg-jannah-gold/20 rounded-full flex items-center justify-center text-jannah-gold mx-auto mb-4 border-2 border-jannah-gold/50"><AlertTriangle size={32} /></div>
            <h3 className="text-2xl font-bold text-white mb-2">Are you absolutely sure?</h3>
            <p className="text-jannah-lavender text-sm mb-6">You are declaring the champions for <span className="font-extrabold text-white underline">{selectedMonth}</span>. This will reset all kids' points to 0!</p>
            <div className="flex gap-4">
              <button onClick={handleConfirmReset} className="flex-1 bubble-btn-gold text-sm">Yes, Crown Winners! 🎉</button>
              <button onClick={() => setShowResetConfirm(false)} className="flex-1 px-4 py-2 rounded-full border-2 border-jannah-dark-border bg-jannah-dark-hover text-jannah-lavender font-bold text-sm hover:bg-jannah-dark-card transition-all">No, Go Back</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
