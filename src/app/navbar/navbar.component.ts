import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'; // Asegúrate de importar tu servicio de autenticación

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  userName: string = 'Cuenta';
  userAvatar: string = '/ruta/default-avatar.png';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();

    if (this.isLoggedIn) {
      // Ahora te suscribes al Observable para obtener los detalles del usuario
      this.authService.getUserDetails().subscribe(
        (user) => {
          if (user) {
            this.userName = user.username || 'Cuenta';
            this.userAvatar = user.avatar || '/ruta/default-avatar.png';  // Verifica si el avatar existe
            console.log('Avatar URL:', this.userAvatar);  // Verifica si la URL del avatar es correcta
          }
        },
        (error) => {
          console.error('Error al obtener los detalles del usuario:', error);
        }
      );
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
