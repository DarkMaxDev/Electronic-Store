import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import { useStore } from './Store';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './components/ProductDetail';
import Cart from './pages/Cart';
import { Login, Register } from './pages/Auth';
import Profile from './pages/Profile';
import Admin from './pages/Admin';

function Guard({ children, admin }) {
  const { user, ready } = useStore();
  if (!ready) return null;
  if (!user || (admin && user.role !== 'admin')) return <Navigate to="/login" replace />;
  return children;
}
export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar /><CartDrawer />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Catalog />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Guard><Profile /></Guard>} />
          <Route path="/admin" element={<Guard admin><Admin /></Guard>} />
          <Route path="*" element={<p className="p-10 text-center">Página no encontrada por ahora</p>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
