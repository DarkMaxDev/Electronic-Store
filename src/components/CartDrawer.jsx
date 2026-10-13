import { AnimatePresence, motion } from 'framer-motion';
import { X, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../Store';
import { money } from '../api';

export default function CartDrawer() {
  const { open, setOpen, cart, setQty, remove, total } = useStore();
  return (
    <AnimatePresence>
      {open && (<>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 bg-black/60 z-50" />
        <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.25 }} className="fixed right-0 top-0 h-full w-full max-w-md bg-zinc-900 z-50 flex flex-col">
          <div className="flex justify-between items-center p-4 border-b border-zinc-800"><h2 className="font-bold text-lg">Tu carrito</h2><button onClick={() => setOpen(false)}><X /></button></div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {!cart.length && <p className="text-zinc-400 text-center mt-10">Agrega algo al carrito porfiss </p>}
            {cart.map(i => (
              <div key={i._id} className="flex gap-3">
                <img src={i.image} className="w-16 h-16 rounded object-cover" />
                <div className="flex-1 text-sm"><p className="line-clamp-2">{i.title}</p><p className="font-bold">{money(i.price)}</p>
                  <div className="flex items-center gap-2 mt-1"><button className="btn-ghost !py-0 !px-2" onClick={() => setQty(i._id, i.qty - 1)}>−</button>{i.qty}<button className="btn-ghost !py-0 !px-2" onClick={() => setQty(i._id, i.qty + 1)}>+</button></div></div>
                <button onClick={() => remove(i._id)} className="text-red-400"><Trash2 size={18} /></button>
              </div>))}
          </div>
          <div className="p-4 border-t border-zinc-800 space-y-3"><div className="flex justify-between font-bold text-lg"><span>Total</span><span>{money(total)}</span></div>
            <Link to="/cart" onClick={() => setOpen(false)} className="btn-danger block text-center">Paga de una vez </Link></div>
        </motion.aside>
      </>)}
    </AnimatePresence>
  );
}
