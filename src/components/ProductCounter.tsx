import { Minus, Plus } from 'lucide-react';

interface ProductCounterProps {
  name: string;
  price: number;
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export default function ProductCounter({
  name,
  price,
  count,
  onIncrement,
  onDecrement,
}: ProductCounterProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-200">
      <div className="flex-1">
        <p className="font-medium text-gray-900">{name}</p>
        <p className="text-sm text-gray-600">{price}€</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onDecrement}
          disabled={count === 0}
          className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
        >
          <Minus size={18} className="text-gray-700" />
        </button>
        <span className="w-12 text-center font-semibold text-lg text-gray-900">
          {count}
        </span>
        <button
          onClick={onIncrement}
          className="w-10 h-10 rounded-full bg-emerald-700 hover:bg-emerald-800 flex items-center justify-center transition-colors"
        >
          <Plus size={18} className="text-white" />
        </button>
      </div>
    </div>
  );
}
