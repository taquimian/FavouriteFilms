import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PeliculasService } from '../services/peliculas.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // <-- Asegúrate de importar el servicio de autenticación

@Component({
  selector: 'app-detalle-pelicula',
  templateUrl: './detalle-pelicula.component.html',
  styleUrls: ['./detalle-pelicula.component.css']
})
export class DetallePeliculaComponent implements OnInit {
  detalleForm!: FormGroup;
  camposDeshabilitados = true;
  mostrarBotonGuardar = false;
  botonModificarDeshabilitado = true; // <-- El botón está deshabilitado por defecto

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private peliculasService: PeliculasService,
    private router: Router,
    private authService: AuthService // <-- Añadir el servicio de autenticación
  ) {}

  ngOnInit(): void {
    this.detalleForm = this.fb.group({
      titulo: [''],
      descripcion: [''],
      anio: [0],
      urlImagen: ['']
      // Agrega otros campos aquí
    });

    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.cargarDetallesPelicula(id);
    });

    // Verificar si el usuario es admin y habilitar el botón de modificar si es el caso
    this.botonModificarDeshabilitado = !this.authService.isAdmin();
  }

  cargarDetallesPelicula(id: number): void {
    this.peliculasService.obtenerPeliculaPorId(id).subscribe((pelicula: any) => {
      if (pelicula) {
        this.detalleForm.patchValue({
          titulo: pelicula.titulo || null,
          descripcion: pelicula.descripcion || null,
          anio: pelicula.anio || null,
          urlImagen: pelicula.imagen || null
          // Actualiza otros campos según los datos de la película
        });
      }
    });
  }

  getImagenUrl(): string {
    const urlImagenControl = this.detalleForm.get('urlImagen');
    return urlImagenControl ? urlImagenControl.value : '';
  }

  volver(): void {
    this.router.navigate(['/']);
  }

  activarEdicion(): void {
    this.camposDeshabilitados = !this.camposDeshabilitados;
    this.mostrarBotonGuardar = !this.camposDeshabilitados;
    this.botonModificarDeshabilitado = true;
  }

  guardarCambios(): void {
    const id = +this.route.snapshot.params['id'];
    const updatedMovie = { ...this.detalleForm.value }; // Copia los valores del formulario

    // Elimina los campos de imagen y nombreImagen
    delete updatedMovie.imagen;
    delete updatedMovie.nombreImagen;
    delete updatedMovie.urlImagen;

    console.log('Datos a guardar:', updatedMovie);

    this.peliculasService.modificarPelicula(id, updatedMovie).subscribe(
      (res: any) => {
        console.log('Película actualizada:', res);
        this.camposDeshabilitados = true;
      },
      (error) => {
        console.error('Error al actualizar película:', error);
        // Puedes agregar lógica para manejar errores, como mostrar un mensaje al usuario
      }
    );

    this.camposDeshabilitados = true; // Deshabilitar los campos
    this.mostrarBotonGuardar = false; // Ocultar el botón "Guardar"
    this.botonModificarDeshabilitado = false;
  }
}
