import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment'; 
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'authToken';
  private apiUrl = environment.apiUrl;

  // Subject para manejar el estado de autenticación
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());

  constructor(private http: HttpClient, private router: Router) {}

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios/registro`, userData);
  }

  login(username: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap((response) => {
        if (response.token) {
          this.saveToken(response.token); // Guarda el token en el localStorage
        }
      })
    );
  }
  
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isLoggedInSubject.next(false);  // Notifica que el usuario ha cerrado sesión
    this.router.navigate(['/login']);
  }

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.isLoggedInSubject.next(true);  // Notifica que el usuario se ha logueado
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    return tokenPayload.role;
  }

  getHeaders(): { [header: string]: string } {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }

  // Devuelve un observable para suscribirse a los cambios de autenticación
  isLoggedInObservable(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  getUserDetails(): Observable<any> {
    const token = this.getToken();
    return this.http.get<any>(`${this.apiUrl}/usuarios`, {
      headers: {
        Authorization: `Bearer ${token}`  // Pasa el token en el encabezado
      }
    });
  }
  
  
  getUserData(): Observable<any> {
    const token = this.getToken();  // Obtener el token desde el almacenamiento
    return this.http.get<any>(`${this.apiUrl}/usuarios`, {
      headers: {
        Authorization: `Bearer ${token}`  // Asegúrate de pasar el token correctamente
      }
    });
  }
  
  
  
  
  getUserId(): string | null {
    const token = this.getToken();
    if (!token) return null;
  
    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));  // Decodificar el token
      return tokenPayload.id;  // Asegúrate de que 'id' esté presente en el payload del token
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }
  
  
  
  
}
