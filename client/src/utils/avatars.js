export const AVATARS = [
  { id: 'lavender-pegasus', label: 'Lavender Pegasus', emoji: '🦄', bg: 'bg-jannah-lavender', text: 'text-purple-600', border: 'border-purple-300' },
  { id: 'mint-kitten', label: 'Mint Kitten', emoji: '🐱', bg: 'bg-jannah-mint', text: 'text-teal-600', border: 'border-teal-300' },
  { id: 'magic-butterfly', label: 'Magic Butterfly', emoji: '🦋', bg: 'bg-jannah-sky', text: 'text-blue-600', border: 'border-blue-300' },
  { id: 'starry-crown', label: 'Starry Crown', emoji: '👑', bg: 'bg-jannah-gold', text: 'text-amber-600', border: 'border-amber-300' },
  { id: 'dream-cloud', label: 'Dreamy Cloud', emoji: '☁️', bg: 'bg-jannah-periwinkle-light', text: 'text-indigo-600', border: 'border-indigo-300' },
  { id: 'pearl-shell', label: 'Pearl Shell', emoji: '🐚', bg: 'bg-teal-50', text: 'text-emerald-600', border: 'border-emerald-300' },
  { id: 'honey-bee', label: 'Honey Bee', emoji: '🐝', bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-400' },
  { id: 'cute-panda', label: 'Cute Panda', emoji: '🐼', bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-300' },
];

export function getAvatar(id) {
  return AVATARS.find(a => a.id === id) || AVATARS[0];
}
