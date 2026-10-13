import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../api';
import Carousel from '../components/Carousel';

export default function Home() {
  const [sale, setSale] = useState(null), [fresh, setFresh] = useState(null);
  useEffect(() => { api('/products?onSale=1&limit=12').then(d => setSale(d.items)); api('/products?sort=new&limit=12').then(d => setFresh(d.items)); }, []);
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-navy to-ink py-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold">La mejor tecnología, al mejor precio mi herman@</h1>
        <p className="mt-3 text-zinc-300">Envíos rápidos · Ofertas siempre los dias de mañana</p>
        <Link to="/search?onSale=1" className="btn-danger inline-block mt-6">Ver ofertas</Link>
      </motion.div>
      {!sale || !fresh ? <div className="max-w-7xl mx-auto p-4 grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-72" />)}</div> : <>
        <Carousel title="Ofertas de temporada" items={sale} accent />
        <Carousel title="Recién llegados" items={fresh} />
      </>}
    </div>
  );
}
