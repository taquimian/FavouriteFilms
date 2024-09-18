
export interface Actor {
  id: number;
  nombre: string;
  apellido: string;
  fechaNacimiento: Date;
  imagen: Blob | null;
  nombreImagen: string;
  // Otros campos relevantes para tu actor
}
