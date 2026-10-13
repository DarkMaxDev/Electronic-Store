import { useEffect, useState } from 'react';
import { api, money } from '../api';
import { useStore } from '../Store';

const empty = { title: '', description: '', image: '', price: '', salePrice: 0, stock: 0, category: 'Electrónica', brand: '', specs: '' };
const Tabs = ['Métricas', 'Productos', 'Usuarios', 'Reseñas', 'Pedidos'];

export default function Admin() {
  const [tab, setTab] = useState(0), [err, setErr] = useState('');
  const run = async fn => { try { setErr(''); await fn(); } catch (e) { setErr(e.message); } };
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Panel de administración</h1>
      <div className="flex gap-2 mb-6 overflow-x-auto">{Tabs.map((t, i) => <button key={t} onClick={() => setTab(i)} className={i === tab ? 'btn-primary' : 'btn-ghost'}>{t}</button>)}</div>
      {err && <p className="text-red-400 mb-3">{err}</p>}
      {tab === 0 && <Metrics run={run} />}{tab === 1 && <Products run={run} />}{tab === 2 && <Users run={run} />}{tab === 3 && <Reviews run={run} />}{tab === 4 && <Orders run={run} />}
    </div>
  );
}

function Metrics({ run }) {
  const [s, setS] = useState(null);
  useEffect(() => { run(async () => setS(await api('/orders/stats/summary'))); }, []);
  if (!s) return <p>Cargando...</p>;
  const max = Math.max(1, ...s.top.map(t => t.sold));
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="card p-5"><p className="text-zinc-400">Ingresos</p><p className="text-3xl font-bold">{money(s.revenue)}</p></div>
      <div className="card p-5"><p className="text-zinc-400">Pedidos</p><p className="text-3xl font-bold">{s.orders}</p></div>
      <div className="card p-5"><h3 className="font-bold mb-3">Más vendidos</h3>{s.top.map(t => <div key={t._id} className="mb-2 text-sm"><div className="flex justify-between"><span>{t.title}</span><span>{t.sold}</span></div><div className="h-2 bg-zinc-800 rounded"><div className="h-2 bg-navy-light rounded" style={{ width: (t.sold / max) * 100 + '%' }} /></div></div>)}</div>
      <div className="card p-5"><h3 className="font-bold mb-3 text-red-400">Stock crítico (≤5)</h3>{s.lowStock.map(t => <p key={t._id} className="flex justify-between text-sm"><span>{t.title}</span><b className="text-red-400">{t.stock}</b></p>)}</div>
    </div>
  );
}

function Products({ run }) {
  const [list, setList] = useState([]), [f, setF] = useState(empty), [editing, setEditing] = useState(null);
  const load = () => run(async () => setList((await api('/products?limit=200')).items));
  useEffect(() => { load(); }, []);
  const save = e => { e.preventDefault(); run(async () => {
    const specs = Object.fromEntries(String(f.specs).split(',').map(s => s.split(':').map(x => x.trim())).filter(a => a[0] && a[1]));
    const body = { ...f, price: +f.price, salePrice: +f.salePrice, stock: +f.stock, specs, images: f.image ? [f.image] : [] };
    delete body.image;
    await api(editing ? '/products/' + editing : '/products', { method: editing ? 'PUT' : 'POST', body });
    setF(empty); setEditing(null); load();
  }); };
  const edit = p => { setEditing(p._id); setF({ ...p, image: p.images?.[0] || '', specs: Object.entries(p.specs || {}).map(([k, v]) => `${k}:${v}`).join(', ') }); window.scrollTo(0, 0); };
  const b = (k, type = 'text') => ({ type, value: f[k] ?? '', onChange: e => setF({ ...f, [k]: e.target.value }), className: 'input' });
  return (<>
    <form onSubmit={save} className="card p-4 grid md:grid-cols-4 gap-3 mb-6">
      <input placeholder="Título" required {...b('title')} /><input placeholder="Categoría" required {...b('category')} /><input placeholder="Marca" {...b('brand')} /><input placeholder="URL imagen" {...b('image')} />
      <input placeholder="Precio" required min="0" {...b('price', 'number')} /><input placeholder="Precio oferta (0 = sin oferta)" min="0" {...b('salePrice', 'number')} /><input placeholder="Piezas en stock" min="0" {...b('stock', 'number')} />
      <input placeholder="Specs → clave:valor, clave:valor" {...b('specs')} />
      <textarea placeholder="Descripción" rows={2} className="input md:col-span-3" value={f.description || ''} onChange={e => setF({ ...f, description: e.target.value })} />
      <div className="flex gap-2"><button className="btn-primary flex-1">{editing ? 'Guardar' : 'Agregar'}</button>{editing && <button type="button" className="btn-ghost" onClick={() => { setEditing(null); setF(empty); }}>×</button>}</div>
    </form>
    <div className="card overflow-x-auto"><table className="w-full text-sm"><thead className="text-left text-zinc-400"><tr><th className="p-2">Producto</th><th>Precio</th><th>Stock</th><th>Vendidos</th><th /></tr></thead><tbody>
      {list.map(p => <tr key={p._id} className="border-t border-zinc-800"><td className="p-2">{p.title}</td><td>{money(p.price)}</td>
        <td><input type="number" min="0" defaultValue={p.stock} className="input !w-20 !py-1" onBlur={e => +e.target.value !== p.stock && run(async () => { await api('/products/' + p._id, { method: 'PUT', body: { stock: +e.target.value } }); load(); })} /></td>
        <td>{p.sold}</td><td className="space-x-2 text-right pr-2"><button onClick={() => edit(p)} className="text-blue-400">Editar</button>
          <button onClick={() => confirm('¿Eliminar producto?') && run(async () => { await api('/products/' + p._id, { method: 'DELETE' }); load(); })} className="text-red-400">Eliminar</button></td></tr>)}</tbody></table></div>
  </>);
}

function Users({ run }) {
  const { user: me } = useStore(); const [list, setList] = useState([]);
  const load = () => run(async () => setList(await api('/users')));
  useEffect(() => { load(); }, []);
  const act = (id, method, body) => run(async () => { await api('/users/' + id, { method, body }); load(); });
  return <div className="card overflow-x-auto"><table className="w-full text-sm"><tbody>{list.map(u => <tr key={u._id} className="border-t border-zinc-800">
    <td className="p-2">{u.name}<br /><span className="text-zinc-500">{u.email}</span></td><td>{u.role}{u.blocked && <b className="text-red-400"> · bloqueado</b>}</td>
    <td className="text-right pr-2 space-x-2">{u._id !== me._id && <>
      <button className="text-blue-400" onClick={() => act(u._id, 'PUT', { role: u.role === 'admin' ? 'user' : 'admin' })}>{u.role === 'admin' ? 'Quitar admin' : 'Hacer admin'}</button>
      <button className="text-yellow-400" onClick={() => act(u._id, 'PUT', { blocked: !u.blocked })}>{u.blocked ? 'Desbloquear' : 'Bloquear'}</button>
      <button className="text-red-400" onClick={() => confirm('¿Eliminar usuario?') && act(u._id, 'DELETE')}>Eliminar</button></>}</td></tr>)}</tbody></table></div>;
}

function Reviews({ run }) {
  const [list, setList] = useState([]);
  const load = () => run(async () => setList(await api('/products/reviews/all')));
  useEffect(() => { load(); }, []);
  return <div className="space-y-2">{!list.length && <p className="text-zinc-400">No tiene reseñas.</p>}{list.map(r => <div key={r._id} className="card p-3 flex justify-between gap-4">
    <div><b>{r.userName}</b> · {r.rating}★ · <span className="text-zinc-400">{r.product?.title}</span><p className="text-zinc-300">{r.comment}</p></div>
    <button className="text-red-400" onClick={() => run(async () => { await api('/products/reviews/' + r._id, { method: 'DELETE' }); load(); })}>Eliminar</button></div>)}</div>;
}

function Orders({ run }) {
  const [list, setList] = useState([]);
  const load = () => run(async () => setList(await api('/orders')));
  useEffect(() => { load(); }, []);
  return <div className="space-y-2">{list.map(o => <div key={o._id} className="card p-3 flex flex-wrap justify-between gap-2 text-sm">
    <div><b>{o.user?.name}</b> · {money(o.total)}<p className="text-zinc-400">{o.items.map(i => `${i.qty}× ${i.title}`).join(', ')}</p><p className="text-zinc-500">{o.address}</p></div>
    <select className="input !w-auto" value={o.status} onChange={e => run(async () => { await api(`/orders/${o._id}/status`, { method: 'PUT', body: { status: e.target.value } }); load(); })}>
      {['pendiente', 'enviado', 'entregado', 'cancelado'].map(s => <option key={s}>{s}</option>)}</select></div>)}</div>;
}
