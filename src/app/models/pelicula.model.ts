
export interface Pelicula {
    id: number;
    titulo: string;
    descripcion: string;
    anio: number;
    imagen: Blob | null;
    urlImagen?: string;
    nombreImagen: string;
    tmdbId?: number;
    // Otros campos relevantes para tu película
  }

  
  