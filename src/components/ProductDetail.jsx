import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { api, money, priceOf, discount } from '../api';
import { useStore } from '../Store';
import Stars from './Stars';

export default function ProductDetail() {
  const { id } = useParams(); const nav = useNavigate();
  const { add, user, wish, toggleWish } = useStore();
  const [p, setP] = useState(null), [reviews, setReviews] = useState([]), [img, setImg] = useState(0), [qty, setQty] = useState(1);
  const [rv, setRv] = useState({ rating: 5, comment: '' }), [msg, setMsg] = useState('');
  const load = () => { api('/products/' + id).then(setP).catch(e => setMsg(e.message)); api(`/products/${id}/reviews`).then(setReviews); };
  useEffect(() => { load(); setImg(0); window.scrollTo(0, 0); }, [id]);
  if (!p) return <p className="p-10 text-center">{msg || 'Cargando...'}</p>;
  const off = discount(p), liked = wish.includes(p._id);
  const send = async e => { e.preventDefault(); try { await api(`/products/${id}/reviews`, { method: 'POST', body: rv }); setRv({ rating: 5, comment: '' }); load(); } catch (er) { setMsg(er.message); } };
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img src={p.images?.[img]} className="w-full rounded-xl aspect-square object-cover bg-zinc-800" />
          <div className="flex gap-2 mt-2">{p.images?.map((s, i) => <img key={i} src={s} onClick={() => setImg(i)} className={'w-16 h-16 rounded object-cover cursor-pointer border-2 ' + (i === img ? 'border-navy-light' : 'border-transparent')} />)}</div>
        </div>
        <div className="space-y-4">
          <p className="text-sm text-zinc-400">{p.category} · {p.brand}</p>
          <h1 className="text-3xl font-bold">{p.title}</h1>
          <div className="flex items-center gap-2"><Stars value={p.ratingAvg} size={18} /><span className="text-sm text-zinc-400">{p.ratingAvg} ({p.ratingCount} opiniones)</span>
            <button onClick={async () => (await toggleWish(p._id)) ? load() : nav('/login')} className="ml-auto flex items-center gap-1 text-sm"><Heart size={18} className={liked ? 'fill-red-500 text-red-500' : ''} />{p.likes}</button></div>
          <div className="flex items-baseline gap-3"><span className="text-4xl font-bold">{money(priceOf(p))}</span>
            {off > 0 && <><s className="text-zinc-500 text-lg">{money(p.price)}</s><span className="bg-danger px-2 py-0.5 rounded text-sm font-bold">-{off}%</span></>}</div>
          <p className={p.stock <= 5 ? 'text-red-400 font-semibold' : 'text-green-400'}>{p.stock === 0 ? 'Agotado' : p.stock <= 5 ? `¡Últimas ${p.stock} piezas!` : `${p.stock} piezas disponibles`}</p>
          <p className="text-zinc-300">{p.description}</p>
          {p.specs && Object.keys(p.specs).length > 0 && <table className="text-sm w-full"><tbody>{Object.entries(p.specs).map(([k, v]) => <tr key={k} className="border-b border-zinc-800"><td className="py-1 text-zinc-400">{k}</td><td>{v}</td></tr>)}</tbody></table>}
          <div className="flex items-center gap-2"><label>Cantidad</label><input type="number" min="1" max={p.stock} value={qty} onChange={e => setQty(Math.max(1, Math.min(p.stock, +e.target.value || 1)))} className="input !w-20" /></div>
          <div className="flex gap-3"><button disabled={!p.stock} onClick={() => add(p, qty)} className="btn-primary flex-1">Agregar al carrito</button>
            <button disabled={!p.stock} onClick={() => { add(p, qty); nav('/cart'); }} className="btn-danger flex-1">Comprar ahora</button></div>
        </div>
      </div>
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Opiniones</h2>
        {user ? <form onSubmit={send} className="card p-4 mb-6 space-y-2"><Stars value={rv.rating} size={22} onPick={n => setRv({ ...rv, rating: n })} />
          <textarea value={rv.comment} onChange={e => setRv({ ...rv, comment: e.target.value })} placeholder="Cuéntanos tu experiencia" className="input" rows={3} /><button className="btn-primary">Publicar</button>{msg && <span className="text-red-400 ml-3">{msg}</span>}</form>
          : <p className="text-zinc-400 mb-4">Inicia sesión para opinar.</p>}
        <div className="space-y-3">{reviews.map(r => <div key={r._id} className="card p-3"><div className="flex items-center gap-2"><b>{r.userName}</b><Stars value={r.rating} /><span className="text-xs text-zinc-500">{new Date(r.createdAt).toLocaleDateString()}</span></div><p className="text-zinc-300 mt-1">{r.comment}</p></div>)}</div>
      </section>
    </div>
  );
}
