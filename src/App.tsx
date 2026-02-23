import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ShoppingCart } from 'lucide-react';
import ProductCounter from './components/ProductCounter';
import ConfirmationScreen from './components/ConfirmationScreen';
import type { Reserva } from './types';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function App() {
  const [copas, setCopas] = useState(0);
  const [cervezas, setCervezas] = useState(0);
  const [refrescos, setRefrescos] = useState(0);
  const [vasos, setVasos] = useState(0);

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmedReserva, setConfirmedReserva] = useState<Reserva | null>(null);

  const subtotalBebidas = copas * 8 + cervezas * 4 + refrescos * 3;
  const totalVasos = vasos * 1;
  const total = subtotalBebidas + totalVasos;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (vasos === 0) {
      setError('Debes añadir al menos 1 vaso reutilizable');
      return;
    }

    if (copas === 0 && cervezas === 0 && refrescos === 0) {
      setError('Debes seleccionar al menos 1 bebida');
      return;
    }

    if (!nombre.trim() || !email.trim() || !telefono.trim()) {
      setError('Por favor, completa todos los datos del comprador');
      return;
    }

    setLoading(true);

    const reservaData: Reserva = {
      nombre: nombre.trim(),
      email: email.trim(),
      telefono: telefono.trim(),
      copas,
      cervezas,
      refrescos,
      vasos,
      total,
      fecha: new Date().toISOString(),
    };

    try {
      const { error: dbError } = await supabase.from('reservas').insert([
        {
          nombre: reservaData.nombre,
          email: reservaData.email,
          telefono: reservaData.telefono,
          copas: reservaData.copas,
          cervezas: reservaData.cervezas,
          refrescos: reservaData.refrescos,
          vasos: reservaData.vasos,
          total: reservaData.total,
        },
      ]);

      if (dbError) throw dbError;

      const webhookUrl = import.meta.env.VITE_WEBHOOK_URL;
      if (webhookUrl && webhookUrl !== 'https://script.google.com/macros/s/XXXXXXX/exec') {
        try {
          const res = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(reservaData),
          });
          const text = await res.text();
          console.log('WEBHOOK status:', res.status);
          console.log('WEBHOOK response:', text);        
        } catch (webhookError) {
          console.error('Error al enviar al webhook:', webhookError);
        }
      }

      setConfirmedReserva(reservaData);
    } catch (err) {
      console.error('Error:', err);
      setError('Hubo un error al procesar tu reserva. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCopas(0);
    setCervezas(0);
    setRefrescos(0);
    setVasos(0);
    setNombre('');
    setEmail('');
    setTelefono('');
    setConfirmedReserva(null);
  };

  if (confirmedReserva) {
    return <ConfirmationScreen reserva={confirmedReserva} onNewReservation={resetForm} />;
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed relative"
      style={{
        backgroundImage:
          'url(https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1920)',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-slate-800/80 to-emerald-900/75" />

      <div className="relative min-h-screen flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 p-6 text-white">
            <div className="flex items-center gap-3 justify-center">
              <ShoppingCart size={32} />
              <h1 className="text-3xl font-bold">Reserva de Tiquets Evento</h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Selecciona tus consumiciones</h2>
              <ProductCounter
                name="Copa / Combinado"
                price={8}
                count={copas}
                onIncrement={() => setCopas(copas + 1)}
                onDecrement={() => setCopas(Math.max(0, copas - 1))}
              />
              <ProductCounter
                name="Cerveza / Chupito"
                price={4}
                count={cervezas}
                onIncrement={() => setCervezas(cervezas + 1)}
                onDecrement={() => setCervezas(Math.max(0, cervezas - 1))}
              />
              <ProductCounter
                name="Refresco / Agua"
                price={3}
                count={refrescos}
                onIncrement={() => setRefrescos(refrescos + 1)}
                onDecrement={() => setRefrescos(Math.max(0, refrescos - 1))}
              />
              <ProductCounter
                name="Vaso reutilizable (OBLIGATORIO)"
                price={1}
                count={vasos}
                onIncrement={() => setVasos(vasos + 1)}
                onDecrement={() => setVasos(Math.max(0, vasos - 1))}
              />
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-slate-50 rounded-xl p-6 mb-8">
              <h3 className="font-bold text-gray-900 mb-3">Resumen</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal bebidas</span>
                  <span className="font-medium">{subtotalBebidas.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Total vasos</span>
                  <span className="font-medium">{totalVasos.toFixed(2)}€</span>
                </div>
                <div className="border-t-2 border-emerald-600 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">TOTAL A PAGAR</span>
                    <span className="text-2xl font-bold text-emerald-700">{total.toFixed(2)}€</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Datos del comprador</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre y apellidos *
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-400 text-white font-semibold py-4 rounded-xl transition-colors text-lg"
            >
              {loading ? 'Procesando...' : 'Reservar Tiquets'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
