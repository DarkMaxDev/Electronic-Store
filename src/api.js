const B = import.meta.env.VITE_API_URL || '/api';
export const setToken = t => (t ? localStorage.setItem('token', t) : localStorage.removeItem('token'));
export async function api(path, { method = 'GET', body } = {}) {
  const t = localStorage.getItem('token');
  const r = await fetch(B + path, { method, headers: { 'Content-Type': 'application/json', ...(t && { Authorization: 'Bearer ' + t }) }, body: body && JSON.stringify(body) });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.message || 'Error de red');
  return d;
}
export const priceOf = p => (p.salePrice > 0 && p.salePrice < p.price ? p.salePrice : p.price);
export const money = n => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n);
export const discount = p => (priceOf(p) < p.price ? Math.round(100 - (priceOf(p) / p.price) * 100) : 0);
