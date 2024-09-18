import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  registerForm: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['user', Validators.required] // Default role is user
    });
  }

  register() {
    if (this.registerForm.valid) {
      const { username, password, role } = this.registerForm.value;

      this.authService.register(username, password, role).subscribe(
        (response) => {
          console.log('Registro exitoso', response);
          this.router.navigate(['/login']); // Redirigir al login después del registro
        },
        (error) => {
          this.errorMessage = 'Error al registrar el usuario';
          console.error('Error:', error);
        }
      );
    }
  }
}
