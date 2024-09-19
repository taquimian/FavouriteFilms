import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pelicula } from '../models/pelicula.model';
import { environment } from 'src/environments/environment'; 
import { tap } from 'rxjs/operators';
import { of } from 'rxjs';

// Interfaz opcional para la estructura de la caché
interface CacheItem<T> {
  data: T;
  expiration: number;  // Timestamp de expiración
}


@Injectable({
  providedIn: 'root',
})
export class PeliculasService {
  private apiUrl = environment.apiUrl;// URL de backend
  private peliculasCache: CacheItem<Pelicula[]> | null = null;
  private peliculasTMDbCache: CacheItem<any[]> | null = null;

  private cacheDuration = 5 * 60 * 1000; // Duración de 5 minutos en milisegundos

  constructor(private http: HttpClient) {}

    agregarPelicula(pelicula: FormData): Observable<any> {
      return this.http.post<any>(`${this.apiUrl}/agregar`, pelicula);
    }

    modificarPelicula(id: number, pelicula: FormData): Observable<any> {
      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };
      console.log(localStorage.getItem('authToken'));

      return this.http.post<any>(`${this.apiUrl}/peliculas/modificar/${id}`, pelicula, { headers });
    }
    
    
    // Método para obtener todas las películas
    obtenerPeliculas(): Observable<Pelicula[]> {
      const peliculasCacheString = localStorage.getItem('peliculasCache');
      const peliculasCache = peliculasCacheString ? JSON.parse(peliculasCacheString) : null;
    
      if (peliculasCache && Date.now() < peliculasCache.expiration) {
        console.log('Películas locales obtenidas desde el caché persistente');
        return of(peliculasCache.data);  // Usa los datos de caché si no han expirado
      }
    
      return this.http.get<Pelicula[]>(`${this.apiUrl}/peliculas/listar`).pipe(
        tap({
          next: (data) => {
            this.peliculasCache = {
              data: data,
              expiration: Date.now() + this.cacheDuration,
            };
          },
          error: (error) => {
            console.error('Error al obtener las películas', error);
            // No almacenar nada en el caché si hay un error
          }
        })
      );
    }
    
  

    obtenerPeliculaPorId(id: number): Observable<Pelicula> {
      return this.http.get<Pelicula>(`${this.apiUrl}/peliculas/obtener/${id}`);
      // Ajusta la URL y la lógica para obtener la película por su ID desde tu backend
    }

    // Método para obtener películas desde TMDb
    obtenerPeliculasTMDb(): Observable<any> {
      const peliculasTMDbCacheString = localStorage.getItem('peliculasTMDbCache');
      const peliculasTMDbCache = peliculasTMDbCacheString ? JSON.parse(peliculasTMDbCacheString) : null;
    
      if (peliculasTMDbCache && Date.now() < peliculasTMDbCache.expiration) {
        console.log('Películas de TMDb obtenidas desde el caché persistente');
        return of(peliculasTMDbCache.data); // Retorna las películas desde el caché
      }
    
      // Si no hay caché o ha expirado, realiza la solicitud HTTP
      return this.http.get<any>(`${this.apiUrl}/peliculas/tmdb`).pipe(
        tap((data) => {
          const cacheItem = {
            data: data,
            expiration: Date.now() + 5 * 60 * 1000,  // 5 minutos de expiración de la caché
          };
          localStorage.setItem('peliculasTMDbCache', JSON.stringify(cacheItem));  // Guardar en `localStorage`
        })
      );
    }
    

    obtenerDetallePeliculaTMDb(tmdbId: number): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/peliculas/tmdb/${tmdbId}`);
    }

      // Método para limpiar el caché de las películas locales
  limpiarCachePeliculas(): void {
    localStorage.removeItem('peliculasCache');
  }

  // Método para limpiar el caché de las películas de TMDb
  limpiarCachePeliculasTMDb(): void {
    localStorage.removeItem('peliculasTMDbCache'); // Eliminar el caché de `localStorage`
  }
}
