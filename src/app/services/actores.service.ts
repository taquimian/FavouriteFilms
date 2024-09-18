import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Actor } from '../models/actor.model'; 
import { environment } from 'src/environments/environment'; 

@Injectable({
  providedIn: 'root',
})
export class ActoresService {
  private apiUrl = environment.apiUrl; 

  constructor(private http: HttpClient) {}

  obtenerActores(): Observable<Actor[]> {
    return this.http.get<Actor[]>(`${this.apiUrl}/listar`);
  }
}
