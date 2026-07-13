import React from 'react';
import { getAvatar } from '../utils/avatars';
import { Award, Calendar, Sparkles } from 'lucide-react';

export default function HallOfFame({ champions }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="text-center mb-8 animate-float-slow">
        <h2 className="text-3xl font-extrabold text-indigo-950 flex items-center justify-center gap-2">
          🏰 Hall of Jannah Champions 🏰
        </h2>
        <p className="text-indigo-800 font-medium text-sm mt-1">
          Honoring our monthly champions of good deeds and sweet character! ✨
        </p>
      </div>

      {champions.length > 0 ? (
        <div className="grid gap-6 max-w-2xl mx-auto">
          {champions.map((record) => {
            const champAv = getAvatar(record.champion_avatar);
            const runnerAv = getAvatar(record.runner_up_avatar);

            return (
              <div
                key={record.id}
                className="bubble-card bg-gradient-to-br from-indigo-50 to-purple-50 p-6 relative overflow-hidden"
              >
                {/* Decorative sparkles */}
                <div className="absolute top-2 right-2 text-yellow-400 opacity-60">
                  <Sparkles size={18} />
                </div>

                {/* Month Banner */}
                <div className="inline-flex items-center gap-1.5 bg-indigo-950 text-white font-extrabold px-4 py-1.5 rounded-full text-xs shadow-sm mb-6">
                  <Calendar size={14} />
                  {record.month}
                </div>

                {/* Main Winners Showcase */}
                <div className="grid grid-cols-2 gap-4 divide-x-2 divide-jannah-lavender-dark">
                  {/* Champion Section */}
                  <div className="flex flex-col items-center justify-center text-center px-2">
                    <div className="relative mb-2">
                      <span className="text-2xl absolute -top-5 left-1/2 -translate-x-1/2 animate-bounce-slow">👑</span>
                      <div className={`w-16 h-16 rounded-full ${champAv.bg} flex items-center justify-center text-3xl border-4 border-jannah-gold`}>
                        {champAv.emoji}
                      </div>
                    </div>
                    <span className="text-xs uppercase tracking-wider font-extrabold text-amber-600">Champion</span>
                    <h3 className="font-bold text-xl text-indigo-950 mt-1 truncate max-w-full">
                      {record.champion_name}
                    </h3>
                    <div className="mt-1 bg-jannah-gold border-2 border-jannah-gold-dark px-3 py-0.5 rounded-full text-xs font-bold text-indigo-950 flex items-center gap-1">
                      🌟 {record.champion_points} Stars
                    </div>
                  </div>

                  {/* Runner-up Section */}
                  <div className="flex flex-col items-center justify-center text-center px-2">
                    <div className="relative mb-2">
                      <div className={`w-14 h-14 rounded-full ${runnerAv.bg} flex items-center justify-center text-2xl border-4 border-slate-300`}>
                        {runnerAv.emoji}
                      </div>
                    </div>
                    <span className="text-xs uppercase tracking-wider font-extrabold text-slate-500">Runner-Up</span>
                    <h3 className="font-bold text-lg text-indigo-950 mt-1 truncate max-w-full">
                      {record.runner_up_name}
                    </h3>
                    <div className="mt-1 bg-slate-100 border-2 border-slate-300 px-3 py-0.5 rounded-full text-xs font-bold text-indigo-950 flex items-center gap-1">
                      🌟 {record.runner_up_points} Stars
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center p-12 bg-white rounded-3xl border-4 border-dashed border-jannah-periwinkle max-w-2xl mx-auto">
          <p className="text-lg text-slate-500 font-bold">The Jannah Hall of Fame is waiting for its very first monthly crowning! Keep logging those deed stars! 🕌🚀</p>
        </div>
      )}
    </div>
  );
}
