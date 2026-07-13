import React, { useState } from 'react';
import { AVATARS } from '../utils/avatars';
import { Sparkles, UserPlus } from 'lucide-react';

export default function KidSelector({ kids, onSelectKid, onAddKid }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0].id);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please write a cute nickname! ✨');
      return;
    }
    if (name.length > 12) {
      setError('Nickname is a bit too long (max 12 letters) 🌟');
      return;
    }
    onAddKid(name.trim(), selectedAvatar);
    setName('');
    setSelectedAvatar(AVATARS[0].id);
    setShowAddForm(false);
    setError('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center">
      {/* Sparkly Header */}
      <div className="mb-8 animate-float-slow">
        <h1 className="text-4xl md:text-5xl font-bold text-white flex items-center justify-center gap-2 glow-text">
          🌟 Dream of Jannah 🌟
        </h1>
        <p className="text-jannah-lavender font-medium text-lg mt-2">
          Who is collecting Jannah Stars today? ✨
        </p>
      </div>

      {/* Grid of Kids */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-4xl w-full justify-center mb-8">
        {kids.map((kid) => {
          const avatarObj = AVATARS.find(a => a.id === kid.avatar) || AVATARS[0];
          return (
            <button
              key={kid.id}
              onClick={() => onSelectKid(kid)}
              className="bubble-card flex flex-col items-center justify-center p-6 text-center group hover:border-jannah-periwinkle-dark transition-all"
            >
              <div className={`w-20 h-20 rounded-full ${avatarObj.bg} flex items-center justify-center text-4xl shadow-[0_0_15px_rgba(216,180,254,0.3)] border-2 ${avatarObj.border} group-hover:scale-110 transition-transform duration-200`}>
                {avatarObj.emoji}
              </div>
              <h3 className="font-bold text-xl text-white mt-4 truncate w-full">
                {kid.name}
              </h3>
              <div className="mt-2 bg-jannah-gold border-2 border-jannah-gold-dark px-3 py-1 rounded-full text-xs font-bold text-indigo-950 flex items-center gap-1 shadow-[0_0_10px_rgba(249,248,113,0.4)]">
                🌟 {kid.points} Stars
              </div>
            </button>
          );
        })}

        {/* Add Kid Button */}
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="border-2 border-dashed border-jannah-periwinkle-dark rounded-3xl p-6 flex flex-col items-center justify-center hover:bg-jannah-dark-hover hover:border-jannah-periwinkle transition-all text-white font-bold group"
          >
            <div className="w-16 h-16 rounded-full bg-jannah-dark-card flex items-center justify-center text-3xl text-jannah-periwinkle group-hover:scale-110 transition-transform border-2 border-jannah-periwinkle-dark">
              <UserPlus size={32} />
            </div>
            <span className="mt-4 text-lg">Add New Kid</span>
          </button>
        )}
      </div>

      {/* Modal Form to Add a Kid */}
      {showAddForm && (
        <div className="bubble-card max-w-md w-full p-6 text-left animate-float-slow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="text-jannah-gold animate-spin" size={24} style={{ animationDuration: '6s' }} /> Create Kid Profile
            </h2>
            <button
              onClick={() => { setShowAddForm(false); setError(''); }}
              className="text-jannah-lavender/60 hover:text-white font-bold text-xl px-2"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-900/30 border-2 border-red-500/50 text-red-300 px-4 py-2 rounded-xl text-sm font-semibold">
                {error}
              </div>
            )}

            <div>
              <label className="block text-white font-bold mb-1">Nickname</label>
              <input
                type="text"
                placeholder="Enter nickname..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-2xl border-2 border-jannah-dark-border bg-jannah-dark-bg text-white placeholder-jannah-lavender/50 focus:outline-none focus:ring-4 focus:ring-jannah-periwinkle/30 text-lg font-bubble"
              />
            </div>

            <div>
              <label className="block text-white font-bold mb-2">Pick an Avatar! 🐾</label>
              <div className="grid grid-cols-4 gap-3">
                {AVATARS.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setSelectedAvatar(av.id)}
                    className={`w-14 h-14 rounded-2xl ${av.bg} flex items-center justify-center text-3xl border-2 transition-all ${
                      selectedAvatar === av.id
                        ? 'border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.5)]'
                        : 'border-transparent opacity-80 hover:opacity-100 hover:scale-105'
                    }`}
                    title={av.label}
                  >
                    {av.emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 bubble-btn-mint text-sm"
              >
                Create Account 🌟
              </button>
              <button
                type="button"
                onClick={() => { setShowAddForm(false); setError(''); }}
                className="flex-1 px-4 py-2 rounded-full border-2 border-jannah-dark-border bg-jannah-dark-hover text-jannah-lavender font-bold text-sm hover:bg-jannah-dark-card transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
