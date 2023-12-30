export interface Producto {
  idProducto: number;
  nombre: string;
  idCategoria: number;
  categoriaDescription: string;
  stock: number;
  precio: string;
  esActivo: number;
  urlImagen?: string;
}
