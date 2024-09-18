import { Component } from '@angular/core';
import { PeliculasService } from '../services/peliculas.service';
import { Pelicula } from '../models/pelicula.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agregar-pelicula',
  templateUrl: './agregar-pelicula.component.html',
  styleUrls: ['./agregar-pelicula.component.css'],
})
export class AgregarPeliculaComponent {
  nuevaPelicula: Pelicula = {
    id: 0,
    titulo: '',
    descripcion: '',
    anio: 0,
    imagen: null,
    nombreImagen: '',
  };

  selectedImageFile: File | null = null;

  constructor(private router: Router, private peliculasService: PeliculasService) {}

  agregarPelicula(): void {
    console.log('Datos a enviar:', this.nuevaPelicula, this.selectedImageFile);
    // Verificar que los campos obligatorios estén completos antes de agregar la película
    if (
      this.nuevaPelicula.titulo.trim() !== '' &&
      this.nuevaPelicula.descripcion.trim() !== '' &&
      this.nuevaPelicula.anio !== 0 &&
      this.selectedImageFile
    ) {
      const formData = new FormData();
      formData.append('titulo', this.nuevaPelicula.titulo);
      formData.append('descripcion', this.nuevaPelicula.descripcion);
      formData.append('anio', this.nuevaPelicula.anio.toString());
      this.nuevaPelicula.nombreImagen = this.selectedImageFile.name;
      formData.append('nombreImagen', this.nuevaPelicula.nombreImagen);
      formData.append('imagen', this.selectedImageFile); // this.selectedImageFile contiene el archivo seleccionado
  
      this.peliculasService.agregarPelicula(formData).subscribe(
        (response) => {
          console.log('Película agregada correctamente', response);
          alert('Se insertó la película correctamente en el sistema');
          this.nuevaPelicula = {
            id: 0,
            titulo: '',
            descripcion: '',
            anio: 0,
            imagen: null,
            nombreImagen: ''
          };
          this.selectedImageFile = null; // Limpiar la imagen seleccionada
        },
        (error) => {
          console.error('Error al agregar película', error);
          alert('¡Oh no! Hubo un error al agregar la película');
        }
      );
    } else {
      console.error('Campos incompletos');
      alert('Campos incompletos');
      // Aquí podrías mostrar un mensaje al usuario informando que debe completar todos los campos requeridos
    }
  }
  
  

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      this.selectedImageFile = files[0];
      console.log('Archivo seleccionado:', this.selectedImageFile);
      this.convertFileToBlob(this.selectedImageFile);
    }
  }
  

  convertFileToBlob(file: File): void {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
      const blob = new Blob([reader.result as ArrayBuffer], { type: file.type });
      this.nuevaPelicula.imagen = blob;
    };
  }

  volver(): void {
    this.router.navigate(['/']);
  }
  
}
