import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'authToken';
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {}

  register(username: string, password: string, role: string): Observable<any> {
    const body = { username, password, role };
    return this.http.post(`${this.apiUrl}/usuarios/registro`, body);
  }

  login(username: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password });
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

  saveToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn() {
    const token = this.getToken();
    return !!token;
  }

  getRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    return tokenPayload.role;
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }
}
