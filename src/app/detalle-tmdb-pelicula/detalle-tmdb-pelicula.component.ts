import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PeliculasService } from '../services/peliculas.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detalle-tmdb-pelicula',
  templateUrl: './detalle-tmdb-pelicula.component.html',
  styleUrls: ['./detalle-tmdb-pelicula.component.css']
})
export class DetalleTmbdPeliculaComponent implements OnInit {
  pelicula: any;

  constructor(private route: ActivatedRoute, private peliculasService: PeliculasService, private router: Router) {}

  ngOnInit(): void {
    const tmdbId = this.route.snapshot.params['tmdbId'];
    this.obtenerDetallePelicula(tmdbId);
  }

  obtenerDetallePelicula(tmdbId: number): void {
    this.peliculasService.obtenerDetallePeliculaTMDb(tmdbId).subscribe(
      (data) => {
        this.pelicula = {
          ...data,
          release_date: new Date(data.release_date) // Convertir la fecha
        };
      },
      (error) => {
        console.error('Error al obtener detalles de la película de TMDb:', error);
      }
    );
  }

  volver(): void {
    this.router.navigate(['/']);
  }
}
