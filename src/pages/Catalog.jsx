import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api';
import ProductCard from '../components/ProductCard';

export default function Catalog() {
  const [sp, setSp] = useSearchParams();
  const [data, setData] = useState({ items: [], total: 0 }), [cats, setCats] = useState([]), [loading, setLoading] = useState(true);
  useEffect(() => { api('/products/categories').then(setCats); }, []);
  useEffect(() => { setLoading(true); api('/products?' + sp.toString()).then(setData).finally(() => setLoading(false)); }, [sp]);
  const set = (k, v) => { const n = new URLSearchParams(sp); v ? n.set(k, v) : n.delete(k); setSp(n); };
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 grid md:grid-cols-[220px_1fr] gap-6">
      <aside className="card p-4 space-y-4 h-fit">
        <div><h3 className="font-bold mb-2">Categoría</h3>
          <button onClick={() => set('category', '')} className={'block ' + (!sp.get('category') ? 'text-red-400' : 'text-zinc-300')}>Todas</button>
          {cats.map(c => <button key={c} onClick={() => set('category', c)} className={'block ' + (sp.get('category') === c ? 'text-red-400' : 'text-zinc-300')}>{c}</button>)}</div>
        <div><h3 className="font-bold mb-2">Precio</h3><div className="flex gap-2"><input className="input" placeholder="Mín" defaultValue={sp.get('min') || ''} onBlur={e => set('min', e.target.value)} /><input className="input" placeholder="Máx" defaultValue={sp.get('max') || ''} onBlur={e => set('max', e.target.value)} /></div></div>
        <label className="flex gap-2 items-center"><input type="checkbox" checked={!!sp.get('onSale')} onChange={e => set('onSale', e.target.checked ? '1' : '')} /> Solo ofertas</label>
        <div><h3 className="font-bold mb-2">Ordenar</h3><select className="input" value={sp.get('sort') || ''} onChange={e => set('sort', e.target.value)}>
          <option value="">Más recientes</option><option value="price-asc">Precio ↑</option><option value="price-desc">Precio ↓</option><option value="top">Mejor valorados</option><option value="sold">Más vendidos</option></select></div>
      </aside>
      <section><p className="text-zinc-400 mb-3">{data.total} resultados {sp.get('q') && `para "${sp.get('q')}"`}</p>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {loading ? [...Array(8)].map((_, i) => <div key={i} className="skeleton h-80" />) : data.items.map(p => <ProductCard key={p._id} p={p} />)}</div></section>
    </div>
  );
}
