import { Star } from 'lucide-react';
export default function Stars({ value = 0, size = 14, onPick }) {
  return <span className="inline-flex">{[1, 2, 3, 4, 5].map(n =>
    <Star key={n} size={size} onClick={onPick && (() => onPick(n))} className={(n <= Math.round(value) ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-600') + (onPick ? ' cursor-pointer' : '')} />)}</span>;
}
