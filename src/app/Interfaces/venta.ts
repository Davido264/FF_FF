import { Cliente } from './cliente';
import { DetalleVenta } from './detalle-venta';

export interface Venta {
  idVenta?: number;
  numeroDocumento?: string;
  tipoPago: string;
  fechaRegistro?: string;
  totalTexto: string;
  detalleVenta: DetalleVenta[];
  cliente: Cliente
}
