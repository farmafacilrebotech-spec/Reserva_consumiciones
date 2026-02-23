export interface Reserva {
  nombre: string;
  email: string;
  telefono: string;
  copas: number;
  cervezas: number;
  refrescos: number;
  vasos: number;
  total: number;
  fecha: string;
}

export interface ProductCounter {
  name: string;
  price: number;
  count: number;
}
