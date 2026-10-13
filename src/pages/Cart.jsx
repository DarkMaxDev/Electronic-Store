import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { api, money } from '../api';
import { useStore } from '../Store';

export default function Cart() {
  const { cart, setCart, setQty, remove, total, user } = useStore();
  const nav = useNavigate();
  const [address, setAddress] = useState(''), [msg, setMsg] = useState(''), [done, setDone] = useState(false), [busy, setBusy] = useState(false);
  const pay = async () => {
    if (!user) return nav('/login');
    if (!address.trim()) return setMsg('Ingresa tu dirección de envío');
    setBusy(true);
    try { await api('/orders', { method: 'POST', body: { address, items: cart.map(i => ({ product: i._id, qty: i.qty, title: i.title })) } }); setCart([]); setDone(true); }
    catch (e) { setMsg(e.message); } finally { setBusy(false); }
  };
  if (done) return <div className="text-center p-16"><h1 className="text-3xl font-bold">¡Pedido realizado!</h1><Link to="/profile" className="btn-primary inline-block mt-6">Ver mis pedidos</Link></div>;
  if (!cart.length) return <div className="text-center p-16"><p className="text-xl">Tu carrito está vacío</p><Link to="/" className="btn-primary inline-block mt-6">Seguir comprando</Link></div>;
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 grid md:grid-cols-[1fr_320px] gap-6">
      <div className="card divide-y divide-zinc-800">{cart.map(i => (
        <div key={i._id} className="p-4 flex gap-4 items-center"><img src={i.image} className="w-20 h-20 rounded object-cover" />
          <div className="flex-1"><Link to={'/product/' + i._id} className="font-medium">{i.title}</Link><p>{money(i.price)}</p></div>
          <input type="number" min="1" max={i.stock} value={i.qty} onChange={e => setQty(i._id, +e.target.value)} className="input !w-20" />
          <button onClick={() => remove(i._id)} className="text-red-400"><Trash2 /></button></div>))}</div>
      <div className="card p-4 space-y-3 h-fit"><h2 className="font-bold text-lg">Resumen</h2>
        <div className="flex justify-between text-xl font-bold"><span>Total</span><span>{money(total)}</span></div>
        <textarea className="input" rows={3} placeholder="Dirección de envío" value={address} onChange={e => setAddress(e.target.value)} />
        {msg && <p className="text-red-400 text-sm">{msg}</p>}
        <button disabled={busy} onClick={pay} className="btn-danger w-full">{busy ? 'Procesando...' : user ? 'Confirmar pedido' : 'Inicia sesión para pagar'}</button>
        </div>
    </div>
  );
}
