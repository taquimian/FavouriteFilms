import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { format } from 'date-fns';

@Component({
  selector: 'app-mi-salon',
  templateUrl: './mi-salon.component.html',
  styleUrls: ['./mi-salon.component.css']
})
export class MiSalonComponent implements OnInit {
  userName: string = '';
  userAvatar: string = '';
  userEmail: string = '';
  userFechaNacimiento: string = '';
  userPaisResidencia: string = '';
  userPreferencias: string[] = []; // Inicializamos como arreglo vacío

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getUserDetails().subscribe(
      (user) => {
        if (user) {
          this.userName = user.username || '';
          this.userAvatar = user.avatar || '';
          this.userEmail = user.email || '';
          this.userFechaNacimiento = format(new Date(user.fecha_nacimiento), 'dd-MM-yyyy') || '';  // Asegúrate de que el nombre del campo es correcto
          this.userPaisResidencia = user.pais_residencia || '';    // Mismo aquí
          this.userPreferencias = user.preferencias ? user.preferencias.split(',') : [];  // Asegúrate de que preferencias esté en formato de texto o arreglo
        }
      },
      (error) => {
        console.error('Error al obtener detalles del usuario:', error);
      }
    );
  }
}
