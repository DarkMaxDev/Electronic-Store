import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useStore } from '../Store';
import { money, priceOf, discount } from '../api';
import Stars from './Stars';

export default function ProductCard({ p }) {
  const { add, wish, toggleWish } = useStore();
  const nav = useNavigate();
  const liked = wish.includes(p._id), off = discount(p);
  return (
    <motion.div whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300 }} className="card overflow-hidden flex flex-col relative min-w-[220px]">
      {off > 0 && <span className="absolute top-2 left-2 bg-danger text-xs font-bold px-2 py-1 rounded z-10">-{off}%</span>}
      <button onClick={async () => (await toggleWish(p._id)) || nav('/login')} className="absolute top-2 right-2 z-10 bg-black/50 rounded-full p-1.5">
        <Heart size={16} className={liked ? 'fill-red-500 text-red-500' : ''} />
      </button>
      <Link to={'/product/' + p._id}>
        <img src={p.images?.[0]} alt={p.title} loading="lazy" className="w-full aspect-square object-cover bg-zinc-800" />
        <div className="p-3 space-y-1">
          <h3 className="font-medium line-clamp-2 min-h-[3rem]">{p.title}</h3>
          <div className="flex items-center gap-1 text-xs text-zinc-400"><Stars value={p.ratingAvg} /> ({p.ratingCount}) · ♥ {p.likes}</div>
          <div className="flex items-baseline gap-2"><span className="text-lg font-bold">{money(priceOf(p))}</span>{off > 0 && <s className="text-sm text-zinc-500">{money(p.price)}</s>}</div>
          <p className={'text-xs ' + (p.stock <= 5 ? 'text-red-400' : 'text-zinc-400')}>{p.stock === 0 ? 'Agotado' : p.stock <= 5 ? `¡Solo quedan ${p.stock}!` : `${p.stock} disponibles`}</p>
        </div>
      </Link>
      <button disabled={!p.stock} onClick={() => add(p)} className="btn-primary m-3 mt-auto">Llevarlo al carrito</button>
    </motion.div>
  );
}
