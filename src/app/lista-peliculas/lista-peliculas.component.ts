import { Component, OnInit } from '@angular/core';
import { Pelicula } from '../models/pelicula.model';
import { PeliculasService } from '../services/peliculas.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { trigger, style, animate, transition } from '@angular/animations';


@Component({
  selector: 'app-lista-peliculas',
  templateUrl: './lista-peliculas.component.html',
  styleUrls: ['./lista-peliculas.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class ListaPeliculasComponent implements OnInit {
  peliculas: any[] = [];  // Local movies
  peliculasTMDb: any[] = [];  // TMDb movies
  intervalosCarrusel: { [key: string]: any } = {}; // Para manejar los intervalos de cada carrusel


  constructor(private router: Router, private peliculasService: PeliculasService) {}

  ngOnInit(): void {
    this.obtenerPeliculas();
    this.obtenerPeliculasTMDb();

    // Iniciar el movimiento automático de los carruseles
    this.iniciarCarrusel('peliculasTMDbCarousel');
    //this.iniciarCarrusel('peliculasLocalesCarousel');
  }

  async obtenerPeliculas(): Promise<void> {
    try {
      this.peliculas = []; // Inicializa peliculas como un array vacío
  
      // Obtener películas locales desde tu base de datos
      const peliculasLocales = await firstValueFrom(this.peliculasService.obtenerPeliculas());
  
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
  
    } catch (error) {
      console.error('Error al obtener películas', error);
    }
  }

  async obtenerPeliculasTMDb(): Promise<void> {
    try {
      const peliculasTMDb = await firstValueFrom(this.peliculasService.obtenerPeliculasTMDb());
  
      console.log('Películas de TMDb recibidas:', peliculasTMDb);  // Aquí deberías ver ya los datos mapeados desde el backend
  
      this.peliculasTMDb = peliculasTMDb;  // No necesitas mapearlas de nuevo si ya están correctamente formateadas
  
    } catch (error) {
      console.error('Error al obtener películas de TMDb', error);
    }
  }
  
  
  

  // Método para ver el detalle de las películas locales
  verDetallePeliculaLocal(id: number): void {
    this.router.navigate(['/detalle-pelicula', id]);
  }

  // Método para ver el detalle de las películas de TMDb
  verDetallePeliculaTMDb(tmdbId: number): void {
    this.router.navigate(['/detalle-tmdb', tmdbId]);
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

  iniciarCarrusel(carruselId: string): void {
    this.intervalosCarrusel[carruselId] = setInterval(() => {
      this.scrollRight(carruselId);
    }, 5000); // Mueve el carrusel cada 5 segundos
  }

  pausarCarrusel(carruselId: string): void {
    clearInterval(this.intervalosCarrusel[carruselId]);
  }

  reanudarCarrusel(carruselId: string): void {
    this.iniciarCarrusel(carruselId);
  }


  scrollLeft(carouselId: string): void {
    const carousel = document.getElementById(carouselId);
    if (carousel) {
      carousel.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }
  
  scrollRight(carouselId: string): void {
    const carousel = document.getElementById(carouselId);
    if (carousel) {
      carousel.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }
  
}
