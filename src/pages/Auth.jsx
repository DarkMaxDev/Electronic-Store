import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useStore } from '../Store';

function Form({ register }) {
  const [f, setF] = useState({ name: '', email: '', password: '' }), [err, setErr] = useState('');
  const { login } = useStore(); const nav = useNavigate();
  const submit = async e => { e.preventDefault(); try { const d = await api(register ? '/auth/register' : '/auth/login', { method: 'POST', body: f }); login(d.token, d.user); nav('/'); } catch (x) { setErr(x.message); } };
  const bind = k => ({ value: f[k], onChange: e => setF({ ...f, [k]: e.target.value }), className: 'input', required: true });
  return (
    <form onSubmit={submit} className="card max-w-sm mx-auto my-16 p-6 space-y-3">
      <h1 className="text-2xl font-bold">{register ? 'Crear cuenta' : 'Iniciar sesión'}</h1>
      {register && <input placeholder="Nombre" {...bind('name')} />}
      <input type="email" placeholder="Correo" {...bind('email')} />
      <input type="password" minLength={6} placeholder="Contraseña (mín. 6)" {...bind('password')} />
      {err && <p className="text-red-400 text-sm">{err}</p>}
      <button className="btn-primary w-full">{register ? 'Registrarme' : 'Entrar'}</button>
      <p className="text-sm text-zinc-400">{register ? <>¿Ya tienes cuenta? <Link className="text-blue-400" to="/login">Ingresa</Link></> : <>¿Eres nuevo? <Link className="text-blue-400" to="/register">Regístrate</Link></>}</p>
    </form>
  );
}
export const Login = () => <Form />;
export const Register = () => <Form register />;
