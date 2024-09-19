import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  registerForm!: FormGroup;
  errorMessage = '';
  successMessage = '';
  tiposPeliculas: string[] = ['Aventura', 'Terror', 'Suspenso', 'Comedia', 'Drama', 'Ciencia Ficción'];
  avatares: string[] = [];  // Array para almacenar los avatares
  selectedAvatar: string = ''; // Avatar seleccionado
  paises: string[] = ['España', 'México', 'Argentina', 'Estados Unidos', 'Colombia', 'Francia', 'Italia', 'Alemania', 'Reino Unido', 'Brasil']; // Lista de países


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', Validators.required], // Campo de usuario
      password: ['', [Validators.required, Validators.minLength(6)]], // Campo de contraseña
      role: ['user', Validators.required], // Campo de rol con valor por defecto 'user'
      nombre: ['', Validators.required], // Campo de nombre
      apellidos: ['', Validators.required], // Campo de apellidos
      email: ['', [Validators.required, Validators.email]], // Campo de correo
      preferencias: [[]], // Preferencias de películas
      fechaNacimiento: ['', Validators.required], // Campo de fecha de nacimiento
      paisResidencia: [''], // Campo de país de residencia
      avatar: ['', Validators.required] //
    });

        // Generar avatares aleatorios
        this.generarAvatares();
  }

  generarAvatares(): void {
    this.avatares = []; // Vacía el arreglo antes de generar nuevos avatares
  
    const avatarApis = [
      'https://api.dicebear.com/9.x/bottts/svg?seed=',
      'https://api.dicebear.com/9.x/avataaars-neutral/svg?seed='
    ];
  
    for (let i = 1; i <= 9; i++) {
      const seed = Math.random().toString(36).substring(7); // Genera una cadena aleatoria
      const randomApi = avatarApis[Math.floor(Math.random() * avatarApis.length)]; // Selecciona una API aleatoria
  
      this.avatares.push(`${randomApi}${seed}`);
    }
  }
  
  

  seleccionarAvatar(avatar: string): void {
    this.selectedAvatar = avatar; // Marca el avatar seleccionado
    this.registerForm.patchValue({ avatar: avatar }); // Actualiza el formulario con el avatar seleccionado
  }

  register() {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Por favor, rellena todos los campos obligatorios.';
      return;
    }
  
    this.authService.register(this.registerForm.value).subscribe({
      next: (res) => {
        this.successMessage = 'Registro completado con éxito. Redirigiendo a la lista de películas...';
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);
      },
      error: (err) => {
        this.errorMessage = 'Error al completar el registro. Por favor, intenta nuevamente.';
      }
    });
  }
  
}
