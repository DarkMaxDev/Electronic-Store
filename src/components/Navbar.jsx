import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Heart, LogOut, LayoutDashboard } from 'lucide-react';
import { useStore } from '../Store';
const quick = ['Móviles', 'Computación', 'Audio', 'TV', 'Gaming', 'Accesorios', 'Wearables'];

export default function Navbar() {
  const [q, setQ] = useState('');
  const nav = useNavigate();
  const { user, logout, cart, setOpen } = useStore();
  const go = e => { e.preventDefault(); nav('/search?q=' + encodeURIComponent(q)); };
  return (
    <header className="sticky top-0 z-40">
      <div className="bg-navy flex items-center gap-3 px-4 py-3">
        <Link to="/" className="text-xl font-extrabold tracking-tight">Electronic<span className="text-red-400"> -Store</span></Link>
        <form onSubmit={go} className="flex flex-1 max-w-3xl mx-auto">
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar productos..." className="flex-1 rounded-l-lg bg-white text-ink px-3 py-2 outline-none" />
          <button className="bg-danger hover:bg-danger-light px-4 rounded-r-lg"><Search size={18} /></button>
        </form>
        <nav className="flex items-center gap-4">
          {user ? (<>
            {user.role === 'admin' && <Link to="/admin" title="Admin"><LayoutDashboard size={20} /></Link>}
            <Link to="/profile" className="flex items-center gap-1 text-sm"><User size={20} /><span className="hidden md:inline">{user.name.split(' ')[0]}</span></Link>
            <Link to="/profile" title="Favoritos"><Heart size={20} /></Link>
            <button onClick={logout} title="Salir"><LogOut size={20} /></button>
          </>) : <Link to="/login" className="text-sm font-semibold">Ingresar</Link>}
          <button onClick={() => setOpen(true)} className="relative" title="Carrito">
            <ShoppingCart size={22} />
            {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-danger text-xs rounded-full w-5 h-5 grid place-items-center">{cart.reduce((s, i) => s + i.qty, 0)}</span>}
          </button>
        </nav>
      </div>
      <div className="bg-ink border-b border-zinc-800 flex gap-5 overflow-x-auto px-4 py-2 text-sm whitespace-nowrap">
        <Link to="/search" className="font-semibold hover:text-red-400">Todo</Link>
        <Link to="/search?onSale=1" className="text-red-400 font-semibold">Ofertas papu</Link>
        {quick.map(c => <Link key={c} to={'/search?category=' + c} className="text-zinc-300 hover:text-white">{c}</Link>)}
      </div>
    </header>
  );
}
