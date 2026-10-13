import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, money } from '../api';
import { useStore } from '../Store';
import ProductCard from '../components/ProductCard';

export default function Profile() {
  const { user, logout } = useStore(); const nav = useNavigate();
  const [orders, setOrders] = useState([]), [wl, setWl] = useState([]), [confirm, setConfirm] = useState(false);
  useEffect(() => { api('/orders/mine').then(setOrders); api('/users/wishlist').then(setWl); }, []);
  const del = async () => { await api('/auth/me', { method: 'DELETE' }); logout(); nav('/'); };
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="card p-5 flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-2xl font-bold">{user.name}</h1><p className="text-zinc-400">{user.email} · {user.role}</p></div>
        {!confirm ? <button onClick={() => setConfirm(true)} className="btn-ghost text-red-400">Eliminar mi cuenta</button>
          : <div className="flex gap-2 items-center"><span className="text-sm">¿Seguro? Es irreversible.</span><button onClick={del} className="btn-danger">Sí, eliminar</button><button onClick={() => setConfirm(false)} className="btn-ghost">Cancelar</button></div>}
      </div>
      <section><h2 className="text-xl font-bold mb-3">Mis favoritos ({wl.length})</h2><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{wl.map(p => <ProductCard key={p._id} p={p} />)}</div></section>
      <section><h2 className="text-xl font-bold mb-3">Mis pedidos</h2><div className="space-y-3">
        {!orders.length && <p className="text-zinc-400">Aún no tienes pedidos.</p>}
        {orders.map(o => <div key={o._id} className="card p-4"><div className="flex justify-between"><span className="text-sm text-zinc-400">{new Date(o.createdAt).toLocaleString()}</span><span className="uppercase text-xs bg-navy px-2 py-1 rounded">{o.status}</span></div>
          {o.items.map((i, k) => <p key={k} className="text-sm">{i.qty} × {i.title}</p>)}<p className="font-bold mt-1">{money(o.total)}</p></div>)}</div></section>
    </div>
  );
}
