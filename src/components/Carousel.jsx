import { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';

export default function Carousel({ title, items, accent }) {
  const ref = useRef();
  const scroll = d => { const el = ref.current; if (!el) return; const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4; el.scrollTo({ left: d > 0 && end ? 0 : el.scrollLeft + d * 260, behavior: 'smooth' }); };
  useEffect(() => { const t = setInterval(() => !ref.current?.matches(':hover') && scroll(1), 4000); return () => clearInterval(t); }, [items]);
  if (!items?.length) return null;
  return (
    <section className="max-w-7xl mx-auto px-4 mt-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className={'text-2xl font-bold border-l-4 pl-3 ' + (accent ? 'border-danger' : 'border-navy-light')}>{title}</h2>
        <div className="flex gap-2"><button onClick={() => scroll(-1)} className="btn-ghost !p-2"><ChevronLeft size={18} /></button><button onClick={() => scroll(1)} className="btn-ghost !p-2"><ChevronRight size={18} /></button></div>
      </div>
      <div ref={ref} className="flex gap-4 overflow-x-auto snap-x pb-3 [scrollbar-width:none]">
        {items.map(p => <div key={p._id} className="snap-start w-60 shrink-0"><ProductCard p={p} /></div>)}
      </div>
    </section>
  );
}
