import React from 'react';
import { getAvatar } from '../utils/avatars';
import { Trophy, Award } from 'lucide-react';

export default function Leaderboard({ kids }) {
  const sortedKids = [...kids].sort((a, b) => b.points - a.points);
  const topThree = sortedKids.slice(0, 3);
  const remainingKids = sortedKids.slice(3);

  const podiumLayout = [];
  if (topThree[1]) podiumLayout.push({ ...topThree[1], rank: 2 });
  if (topThree[0]) podiumLayout.push({ ...topThree[0], rank: 1 });
  if (topThree[2]) podiumLayout.push({ ...topThree[2], rank: 3 });

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-white flex items-center justify-center gap-2 glow-text">
          🏆 Jannah Leaderboard 🏆
        </h2>
        <p className="text-jannah-lavender font-medium text-sm mt-1">
          Look at all these amazing helpers collecting Jannah Deed Stars! 🌟
        </p>
      </div>

      {/* Podium for Top 3 */}
      {sortedKids.length > 0 ? (
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-end justify-center gap-4 sm:gap-8 max-w-2xl w-full h-80 px-2 select-none">
            {podiumLayout.map((kid) => {
              const av = getAvatar(kid.avatar);
              const isFirst = kid.rank === 1;
              const isSecond = kid.rank === 2;

              let podiumHeight = 'h-32';
              let podiumGradient = 'bg-gradient-to-t from-jannah-periwinkle-dark to-jannah-periwinkle';
              let podiumBorder = 'border-jannah-periwinkle-dark';
              let podiumGlow = 'shadow-[0_0_15px_rgba(147,156,255,0.4)]';
              let avatarSize = 'w-16 h-16 text-3xl';
              let avatarBorder = 'border-jannah-periwinkle-dark';

              if (isFirst) {
                podiumHeight = 'h-48';
                podiumGradient = 'bg-gradient-to-t from-jannah-gold-dark to-jannah-gold';
                podiumBorder = 'border-jannah-gold-dark';
                podiumGlow = 'shadow-[0_0_25px_rgba(249,248,113,0.5)]';
                avatarSize = 'w-24 h-24 text-5xl';
                avatarBorder = 'border-jannah-gold-dark';
              } else if (isSecond) {
                podiumHeight = 'h-36';
                podiumGradient = 'bg-gradient-to-t from-slate-600 to-slate-400';
                podiumBorder = 'border-slate-500';
                podiumGlow = 'shadow-[0_0_15px_rgba(148,163,184,0.4)]';
                avatarSize = 'w-18 h-18 text-4xl';
                avatarBorder = 'border-slate-400';
              } else if (kid.rank === 3) {
                podiumHeight = 'h-28';
                podiumGradient = 'bg-gradient-to-t from-amber-800 to-amber-600';
                podiumBorder = 'border-amber-600';
                podiumGlow = 'shadow-[0_0_15px_rgba(217,119,6,0.4)]';
                avatarSize = 'w-14 h-14 text-2xl';
                avatarBorder = 'border-amber-500';
              }

              return (
                <div key={kid.id} className="flex flex-col items-center flex-1 transition-all duration-300 hover:-translate-y-1">
                  <div className="relative mb-2 flex flex-col items-center">
                    {isFirst && (
                      <span className="text-3xl absolute -top-8 left-1/2 -translate-x-1/2 animate-bounce-slow">👑</span>
                    )}
                    <div className={`rounded-full ${av.bg} flex items-center justify-center border-2 ${avatarBorder} shadow-[0_0_15px_rgba(216,180,254,0.3)] ${avatarSize}`}>
                      {av.emoji}
                    </div>
                  </div>

                  <div className={`w-full ${podiumHeight} ${podiumGradient} ${podiumBorder} border-2 ${podiumGlow} rounded-3xl flex flex-col items-center justify-center p-3 text-center`}>
                    <span className="font-extrabold text-white text-base md:text-lg truncate max-w-full drop-shadow-md">
                      {kid.name}
                    </span>
                    <span className="text-xs font-black text-white flex items-center gap-1 mt-1 bg-white/20 px-2 py-0.5 rounded-full">
                      🌟 {kid.points}
                    </span>
                    <div className="mt-2 text-white/80">
                      <Trophy size={isFirst ? 32 : 24} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center p-12 bubble-card border-dashed border-jannah-periwinkle-dark">
          <p className="text-lg text-jannah-lavender font-bold">No kids profiles exist yet. Create a kid account to start the fun! ✨</p>
        </div>
      )}

      {/* Remaining Kids Table */}
      {remainingKids.length > 0 && (
        <div className="bubble-card p-6 max-w-2xl mx-auto">
          <h3 className="text-xl font-extrabold text-white mb-4 flex items-center gap-2">
            <Award className="text-jannah-periwinkle" /> Stars Board
          </h3>
          <div className="space-y-3">
            {remainingKids.map((kid, index) => {
              const av = getAvatar(kid.avatar);
              const rank = index + 4;
              return (
                <div
                  key={kid.id}
                  className="flex items-center justify-between p-3 bg-jannah-dark-hover hover:bg-jannah-dark-card rounded-2xl border border-jannah-dark-border hover:border-jannah-periwinkle-dark transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-jannah-periwinkle text-indigo-950 flex items-center justify-center font-extrabold text-sm shadow-[0_0_10px_rgba(147,156,255,0.4)]">
                      {rank}
                    </div>
                    <div className={`w-10 h-10 rounded-full ${av.bg} flex items-center justify-center text-xl border-2 ${av.border}`}>
                      {av.emoji}
                    </div>
                    <span className="font-extrabold text-white text-lg">
                      {kid.name}
                    </span>
                  </div>

                  <div className="bg-jannah-gold border-2 border-jannah-gold-dark px-4 py-1.5 rounded-full font-black text-indigo-950 flex items-center gap-1 shadow-[0_0_10px_rgba(249,248,113,0.4)]">
                    🌟 {kid.points}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
