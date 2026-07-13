import React from 'react';
import { getAvatar } from '../utils/avatars';
import { Trophy, Star, Award } from 'lucide-react';

export default function Leaderboard({ kids }) {
  // Sort kids by points (should already be sorted from API, but we'll make sure)
  const sortedKids = [...kids].sort((a, b) => b.points - a.points);

  // Take top 3 for the beautiful cloud podium
  const topThree = sortedKids.slice(0, 3);
  const remainingKids = sortedKids.slice(3);

  // Rearrange top three to: [2nd, 1st, 3rd] for classic physical podium layout
  const podiumLayout = [];
  if (topThree[1]) podiumLayout.push({ ...topThree[1], rank: 2 });
  if (topThree[0]) podiumLayout.push({ ...topThree[0], rank: 1 });
  if (topThree[2]) podiumLayout.push({ ...topThree[2], rank: 3 });

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-indigo-950 flex items-center justify-center gap-2">
          🏆 Jannah Leaderboard 🏆
        </h2>
        <p className="text-indigo-800 font-medium text-sm mt-1">
          Look at all these amazing helpers collecting Jannah Deed Stars! 🌟
        </p>
      </div>

      {/* Cloud Podium for Top 3 */}
      {sortedKids.length > 0 ? (
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-end justify-center gap-4 sm:gap-8 max-w-2xl w-full h-80 px-2 select-none">
            {podiumLayout.map((kid) => {
              const av = getAvatar(kid.avatar);
              const isFirst = kid.rank === 1;
              const isSecond = kid.rank === 2;
              const isThird = kid.rank === 3;

              let podiumHeight = 'h-32';
              let podiumColor = 'bg-jannah-periwinkle border-jannah-periwinkle-dark shadow-[4px_4px_0px_0px_#939cff]';
              let trophyColor = 'text-slate-400';
              let avatarSize = 'w-16 h-16 text-3xl';

              if (isFirst) {
                podiumHeight = 'h-48';
                podiumColor = 'bg-jannah-gold border-jannah-gold-dark shadow-[4px_4px_0px_0px_#f9f871]';
                trophyColor = 'text-amber-500 animate-bounce-slow';
                avatarSize = 'w-24 h-24 text-5xl border-jannah-gold-dark';
              } else if (isSecond) {
                podiumHeight = 'h-36';
                podiumColor = 'bg-slate-100 border-slate-300 shadow-[4px_4px_0px_0px_#cbd5e1]';
                trophyColor = 'text-slate-400';
                avatarSize = 'w-18 h-18 text-4xl border-slate-300';
              } else if (isThird) {
                podiumHeight = 'h-28';
                podiumColor = 'bg-orange-50 border-orange-200 shadow-[4px_4px_0px_0px_#fed7aa]';
                trophyColor = 'text-amber-700';
                avatarSize = 'w-14 h-14 text-2xl border-orange-200';
              }

              return (
                <div key={kid.id} className="flex flex-col items-center flex-1 transition-all duration-300 hover:-translate-y-1">
                  {/* Floating Avatar & Trophy above cloud */}
                  <div className="relative mb-2 flex flex-col items-center">
                    {isFirst && (
                      <span className="text-3xl absolute -top-8 left-1/2 -translate-x-1/2 animate-bounce-slow">👑</span>
                    )}
                    <div className={`rounded-full ${av.bg} flex items-center justify-center border-4 shadow-md ${avatarSize}`}>
                      {av.emoji}
                    </div>
                  </div>

                  {/* Cloud/Podium Block */}
                  <div className={`w-full ${podiumHeight} ${podiumColor} border-4 rounded-3xl flex flex-col items-center justify-center p-3 text-center`}>
                    <span className="font-extrabold text-indigo-950 text-base md:text-lg truncate max-w-full">
                      {kid.name}
                    </span>
                    <span className="text-xs font-black text-indigo-900 flex items-center gap-1 mt-1 bg-white/40 px-2 py-0.5 rounded-full">
                      🌟 {kid.points}
                    </span>
                    <div className={`mt-2 ${trophyColor}`}>
                      <Trophy size={isFirst ? 32 : 24} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center p-12 bg-white rounded-3xl border-4 border-dashed border-jannah-periwinkle">
          <p className="text-lg text-slate-500 font-bold">No kids profiles exist yet. Create a kid account to start the fun! ✨</p>
        </div>
      )}

      {/* Remaining Kids Table */}
      {remainingKids.length > 0 && (
        <div className="bubble-card p-6 bg-white max-w-2xl mx-auto">
          <h3 className="text-xl font-extrabold text-indigo-950 mb-4 flex items-center gap-2">
            <Award className="text-indigo-950" /> Stars Board
          </h3>
          <div className="space-y-3">
            {remainingKids.map((kid, index) => {
              const av = getAvatar(kid.avatar);
              const rank = index + 4; // Top 3 are on the podium
              return (
                <div
                  key={kid.id}
                  className="flex items-center justify-between p-3 bg-jannah-lavender/30 hover:bg-jannah-lavender/50 rounded-2xl border-2 border-jannah-lavender transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {/* Rank Circle */}
                    <div className="w-8 h-8 rounded-full bg-indigo-950 text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
                      {rank}
                    </div>
                    {/* Kid Icon */}
                    <div className={`w-10 h-10 rounded-full ${av.bg} flex items-center justify-center text-xl border-2 ${av.border}`}>
                      {av.emoji}
                    </div>
                    {/* Kid Name */}
                    <span className="font-extrabold text-indigo-950 text-lg">
                      {kid.name}
                    </span>
                  </div>

                  {/* Stars Tag */}
                  <div className="bg-jannah-gold border-2 border-jannah-gold-dark px-4 py-1.5 rounded-full font-black text-indigo-950 flex items-center gap-1 shadow-sm">
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
