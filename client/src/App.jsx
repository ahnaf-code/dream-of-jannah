import React, { useState, useEffect } from 'react';
import { 
  fetchKids, addKid, deleteKid, 
  fetchTasks, addTask, deleteTask, 
  fetchAssignments, fetchTasksForKid, addAssignment, deleteAssignment,
  fetchCompletions, toggleCompletion, 
  fetchChampions, declareChampion 
} from './utils/api';

import KidSelector from './components/KidSelector';
import Dashboard from './components/Dashboard';
import Leaderboard from './components/Leaderboard';
import HallOfFame from './components/HallOfFame';
import AdminPanel from './components/AdminPanel';

import { Sparkles, Trophy, Award, Settings, User } from 'lucide-react';

// Helper function to get local date string in YYYY-MM-DD format
const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function App() {
  const [kids, setKids] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [kidTasks, setKidTasks] = useState([]);
  const [completions, setCompletions] = useState([]);
  const [champions, setChampions] = useState([]);
  
  const [activeKid, setActiveKid] = useState(null);
  const [activeTab, setActiveTab] = useState('deeds'); // 'deeds', 'leaderboard', 'hall', 'admin'
  const [loading, setLoading] = useState(true);

  // Load baseline data (kids, tasks, assignments, champions)
  const loadData = async () => {
    try {
      setLoading(true);
      const [kidsData, tasksData, assignmentsData, championsData] = await Promise.all([
        fetchKids(),
        fetchTasks(),
        fetchAssignments(),
        fetchChampions()
      ]);
      setKids(kidsData);
      setTasks(tasksData);
      setAssignments(assignmentsData);
      setChampions(championsData);

      // If activeKid was already selected, update their state with freshest data from db
      if (activeKid) {
        const freshKid = kidsData.find(k => k.id === activeKid.id);
        if (freshKid) {
          setActiveKid(freshKid);
        } else {
          setActiveKid(null); // was deleted
        }
      }
    } catch (error) {
      console.error('Error loading baseline data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Whenever the activeKid changes, load their tasks and completions for today
  useEffect(() => {
    if (activeKid) {
      const todayStr = getLocalDateString();
      
      // Load tasks assigned to this kid
      fetchTasksForKid(activeKid.id, todayStr)
        .then(data => setKidTasks(data))
        .catch(err => console.error('Error loading kid tasks:', err));
      
      // Load completions for this kid
      fetchCompletions(activeKid.id, todayStr)
        .then(data => setCompletions(data))
        .catch(err => console.error('Error loading completions:', err));
    }
  }, [activeKid]);

  // Handles adding a new kid
  const handleAddKid = async (name, avatar) => {
    try {
      const newKid = await addKid(name, avatar);
      setKids(prev => [...prev, newKid]);
      // Auto-select the newly added kid profile!
      setActiveKid(newKid);
      setActiveTab('deeds');
    } catch (err) {
      console.error(err);
    }
  };

  // Handles deleting a kid
  const handleDeleteKid = async (id) => {
    try {
      await deleteKid(id);
      if (activeKid && activeKid.id === id) {
        setActiveKid(null);
      }
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  // Handles adding a task
  const handleAddTask = async (title, points) => {
    try {
      const newTask = await addTask(title, points);
      setTasks(prev => [...prev, newTask]);
    } catch (err) {
      console.error(err);
    }
  };

  // Handles deleting a task
  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
      // Refresh completions
      if (activeKid) {
        const todayStr = getLocalDateString();
        const updatedCompletions = await fetchCompletions(activeKid.id, todayStr);
        setCompletions(updatedCompletions);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handles adding an assignment
  const handleAddAssignment = async (taskId, kidId, assignedDate) => {
    try {
      const newAssignment = await addAssignment(taskId, kidId, assignedDate);
      setAssignments(prev => [...prev, newAssignment]);
      // Refresh kid tasks if active
      if (activeKid) {
        const todayStr = getLocalDateString();
        const updatedTasks = await fetchTasksForKid(activeKid.id, todayStr);
        setKidTasks(updatedTasks);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handles deleting an assignment
  const handleDeleteAssignment = async (id) => {
    try {
      await deleteAssignment(id);
      setAssignments(prev => prev.filter(a => a.id !== id));
      // Refresh kid tasks if active
      if (activeKid) {
        const todayStr = getLocalDateString();
        const updatedTasks = await fetchTasksForKid(activeKid.id, todayStr);
        setKidTasks(updatedTasks);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handles toggling task completion status
  const handleToggleTask = async (kidId, taskId, date) => {
    try {
      const result = await toggleCompletion(kidId, taskId, date);
      
      // Update completion logs local state
      if (result.completed) {
        // Add to checklist completions
        setCompletions(prev => [...prev, { kid_id: kidId, task_id: taskId, completed_date: date }]);
      } else {
        // Remove from checklist completions
        setCompletions(prev => prev.filter(c => !(c.kid_id === kidId && c.task_id === taskId && c.completed_date === date)));
      }

      // Update local kids state to reflect point additions or subtractions
      setKids(prev => prev.map(k => k.id === kidId ? { ...k, points: result.points } : k));
      
      // Update activeKid profile so the points bubble matches
      setActiveKid(prev => prev && prev.id === kidId ? { ...prev, points: result.points } : prev);

      return result;
    } catch (err) {
      console.error(err);
    }
  };

  // Handles end-of-month coronation reset
  const handleDeclareChampion = async (month) => {
    try {
      await declareChampion(month);
      setActiveKid(null); // return to logins
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading && kids.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-jannah-cream text-indigo-950 font-bubble">
        <div className="text-4xl animate-bounce">🌟</div>
        <h2 className="text-xl font-bold mt-4">Loading Jannah Skies...</h2>
      </div>
    );
  }

  // If no kid profile is selected yet, show the beautiful Kid Selector dashboard
  if (!activeKid) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-jannah-lavender-light to-jannah-cream pb-12">
        <KidSelector 
          kids={kids} 
          onSelectKid={(kid) => {
            setActiveKid(kid);
            setActiveTab('deeds');
          }} 
          onAddKid={handleAddKid} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-jannah-cream flex flex-col justify-between pb-24 md:pb-6">
      
      {/* Scrollable Main Area */}
      <main className="flex-grow pb-8">
        {activeTab === 'deeds' && (
          <Dashboard 
            activeKid={activeKid} 
            tasks={kidTasks} 
            completions={completions} 
            onToggleTask={handleToggleTask} 
            onLogOut={() => setActiveKid(null)}
          />
        )}
        {activeTab === 'leaderboard' && (
          <Leaderboard kids={kids} />
        )}
        {activeTab === 'hall' && (
          <HallOfFame champions={champions} />
        )}
        {activeTab === 'admin' && (
          <AdminPanel 
            kids={kids}
            tasks={tasks}
            assignments={assignments}
            onAddKid={handleAddKid}
            onDeleteKid={handleDeleteKid}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
            onAddAssignment={handleAddAssignment}
            onDeleteAssignment={handleDeleteAssignment}
            onDeclareChampion={handleDeclareChampion}
          />
        )}
      </main>

      {/* Developer Copyright Footer */}
      <footer className="text-center py-3 mb-20 text-xs text-slate-400 font-bubble select-none">
        &copy; 2026 Mir Muhammad Azmain Ahnaf. Developed by <span className="font-bold text-slate-500">Mir Muhammad Azmain Ahnaf</span>
      </footer>

      {/* Floating Bottom Bubbly Navigation Bar (Highly Kid-Friendly and Thumb-Optimized) */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 border-4 border-jannah-lavender-dark rounded-full shadow-2xl backdrop-blur-md px-6 py-3 flex items-center justify-between gap-6 max-w-lg w-[90%] z-40 select-none">
        
        <button
          onClick={() => setActiveTab('deeds')}
          className={`flex flex-col items-center justify-center transition-all ${
            activeTab === 'deeds' 
              ? 'text-indigo-950 scale-110 font-bold' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Sparkles size={24} className={activeTab === 'deeds' ? 'text-indigo-950 animate-pulse' : ''} />
          <span className="text-[10px] mt-0.5">My Deeds</span>
        </button>

        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex flex-col items-center justify-center transition-all ${
            activeTab === 'leaderboard' 
              ? 'text-indigo-950 scale-110 font-bold' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Trophy size={24} className={activeTab === 'leaderboard' ? 'text-amber-500' : ''} />
          <span className="text-[10px] mt-0.5">Leaderboard</span>
        </button>

        {/* Quick character switcher */}
        <button
          onClick={() => setActiveKid(null)}
          className="w-12 h-12 bg-indigo-950 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white hover:scale-110 active:scale-95 transition-all -translate-y-2"
          title="Switch Kid Account"
        >
          <User size={22} />
        </button>

        <button
          onClick={() => setActiveTab('hall')}
          className={`flex flex-col items-center justify-center transition-all ${
            activeTab === 'hall' 
              ? 'text-indigo-950 scale-110 font-bold' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Award size={24} className={activeTab === 'hall' ? 'text-purple-600' : ''} />
          <span className="text-[10px] mt-0.5">Hall of Fame</span>
        </button>

        <button
          onClick={() => setActiveTab('admin')}
          className={`flex flex-col items-center justify-center transition-all ${
            activeTab === 'admin' 
              ? 'text-indigo-950 scale-110 font-bold' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Settings size={24} className={activeTab === 'admin' ? 'text-slate-800' : ''} />
          <span className="text-[10px] mt-0.5">Ahnaf</span>
        </button>

      </nav>
    </div>
  );
}
