import { Component, OnInit } from '@angular/core';
import { Actor } from '../models/actor.model';
import { ActoresService } from '../services/actores.service';

@Component({
  selector: 'app-reparto',
  templateUrl: './reparto.component.html',
  styleUrls: ['./reparto.component.css']
})
export class RepartoComponent implements OnInit {
  actores: Actor[] = [];

  constructor(private actoresService: ActoresService) { }

  ngOnInit(): void {
    this.obtenerActores();
  }

  obtenerActores(): void {
    this.actoresService.obtenerActores().subscribe((actores: Actor[]) => {
      this.actores = actores;
    });
  }
}
