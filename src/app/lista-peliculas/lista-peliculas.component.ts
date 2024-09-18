import { Component, OnInit } from '@angular/core';
import { Pelicula } from '../models/pelicula.model';
import { PeliculasService } from '../services/peliculas.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-lista-peliculas',
  templateUrl: './lista-peliculas.component.html',
  styleUrls: ['./lista-peliculas.component.css']
})
export class ListaPeliculasComponent implements OnInit {
  peliculas: Pelicula[] = [];

  constructor(private router: Router, private peliculasService: PeliculasService) {}

  ngOnInit(): void {
    this.obtenerPeliculas();
  }

  async obtenerPeliculas(): Promise<void> {
    try {
      this.peliculas = []; // Inicializa peliculas como un array vacío
  
      // Obtener películas locales desde tu base de datos
      const peliculasLocales = await firstValueFrom(this.peliculasService.obtenerPeliculas());
      
      // Obtener películas desde TMDb
      const peliculasTMDb = await firstValueFrom(this.peliculasService.obtenerPeliculasTMDb());
  
      // Procesar las películas locales
      if (peliculasLocales) {
        const procesadasLocales = peliculasLocales.map((pelicula: any) => {
          return {
            ...pelicula,
            urlImagen: pelicula.imagen, // Utiliza directamente la cadena base64 para la URL
            nombreImagen: pelicula.nombreImagen
          };
        });
  
        this.peliculas = [...procesadasLocales]; // Agregar las películas locales al array principal
      }
  
      // Procesar las películas de TMDb y agregarlas a la lista
      if (peliculasTMDb) {
        this.peliculas = [...this.peliculas, ...peliculasTMDb]; // Combinar con las películas locales
      }
  
    } catch (error) {
      console.error('Error al obtener películas', error);
    }
  }

  verDetallePelicula(id: number | undefined, tmdbId: number | undefined): void {
    if (id !== undefined) {
      // Navegar a los detalles de una película local
      this.router.navigate(['/detalle-pelicula', id]);
    } else if (tmdbId !== undefined) {
      // Navegar a los detalles de una película de TMDb
      this.router.navigate(['/detalle-tmdb', tmdbId]);
    } else {
      console.error('ID y tmdbId son undefined');
    }
  }
  
  

  redirigirAAgregarPelicula(): void {
    this.router.navigate(['/agregar-pelicula']);
  }
  
  eliminarPelicula(id: number): void {
    this.peliculas = this.peliculas.filter(pelicula => pelicula.id !== id);
  }

  chunkArray(array: any[], size: number): any[] {
    return Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
      array.slice(index * size, index * size + size)
    );
  }
}
