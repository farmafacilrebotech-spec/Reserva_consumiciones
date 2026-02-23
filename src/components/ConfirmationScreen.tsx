import { CheckCircle, MessageCircle } from 'lucide-react';
import type { Reserva } from '../types';

interface ConfirmationScreenProps {
  reserva: Reserva;
  onNewReservation: () => void;
}

export default function ConfirmationScreen({
  reserva,
  onNewReservation,
}: ConfirmationScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 md:p-12">
        <div className="flex justify-center mb-6">
          <img
            src="/public/Escudo.jpeg"
            alt="Escudo"
            className="h-20 w-20 object-contain"
          />
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-slate-50 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Resumen de tu pedido
          </h2>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-gray-700">
              <span className="font-medium">Nombre:</span>
              <span>{reserva.nombre}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span className="font-medium">Email:</span>
              <span>{reserva.email}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span className="font-medium">Teléfono:</span>
              <span>{reserva.telefono}</span>
            </div>
          </div>

          <div className="border-t border-gray-300 pt-4 space-y-2">
            {reserva.copas > 0 && (
              <div className="flex justify-between text-gray-700">
                <span>Copa / Combinado x{reserva.copas}</span>
                <span className="font-medium">{reserva.copas * 8}€</span>
              </div>
            )}
            {reserva.cervezas > 0 && (
              <div className="flex justify-between text-gray-700">
                <span>Cerveza / Chupito x{reserva.cervezas}</span>
                <span className="font-medium">{reserva.cervezas * 4}€</span>
              </div>
            )}
            {reserva.refrescos > 0 && (
              <div className="flex justify-between text-gray-700">
                <span>Refresco / Agua x{reserva.refrescos}</span>
                <span className="font-medium">{reserva.refrescos * 3}€</span>
              </div>
            )}
            {reserva.vasos > 0 && (
              <div className="flex justify-between text-gray-700">
                <span>Vaso reutilizable x{reserva.vasos}</span>
                <span className="font-medium">{reserva.vasos * 1}€</span>
              </div>
            )}
          </div>

          <div className="border-t-2 border-emerald-600 mt-4 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-gray-900">TOTAL A PAGAR</span>
              <span className="text-3xl font-bold text-emerald-700">
                {reserva.total.toFixed(2)}€
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onNewReservation}
          className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-4 rounded-xl transition-colors"
        >
          Nueva Reserva
        </button>
      </div>
    </div>
  );
}
