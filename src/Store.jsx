import { createContext, useContext, useEffect, useState } from 'react';
import { api, setToken, priceOf } from './api';
const C = createContext();
export const useStore = () => useContext(C);

export function StoreProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [wish, setWish] = useState([]);
  const [open, setOpen] = useState(false);
  const [cart, setCart] = useState(() => { try { return JSON.parse(localStorage.getItem('cart') || '[]'); } catch { return []; } });
  useEffect(() => localStorage.setItem('cart', JSON.stringify(cart)), [cart]);
  useEffect(() => { api('/auth/me').then(u => login(null, u)).catch(() => setUser(null)).finally(() => setReady(true)); }, []);

  const login = (token, u) => { if (token) setToken(token); setUser(u); setWish((u.wishlist || []).map(String)); };
  const logout = () => { setToken(null); setUser(null); setWish([]); };
  const add = (p, qty = 1) => {
    setCart(c => {
      const ex = c.find(i => i._id === p._id);
      const q = Math.min(p.stock, (ex?.qty || 0) + qty);
      const item = { _id: p._id, title: p.title, image: p.images?.[0], price: priceOf(p), stock: p.stock, qty: q };
      return ex ? c.map(i => (i._id === p._id ? item : i)) : [...c, item];
    });
    setOpen(true);
  };
  const setQty = (id, qty) => setCart(c => c.map(i => (i._id === id ? { ...i, qty: Math.max(1, Math.min(i.stock, qty)) } : i)));
  const remove = id => setCart(c => c.filter(i => i._id !== id));
  const toggleWish = async id => {
    if (!user) return false;
    const { liked } = await api('/users/wishlist/' + id, { method: 'POST' });
    setWish(w => (liked ? [...w, id] : w.filter(x => x !== id)));
    return true;
  };
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  return <C.Provider value={{ user, ready, login, logout, cart, setCart, add, setQty, remove, total, wish, toggleWish, open, setOpen }}>{children}</C.Provider>;
}
