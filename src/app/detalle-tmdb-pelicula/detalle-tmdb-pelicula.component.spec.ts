import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleTmdbPeliculaComponent } from './detalle-tmdb-pelicula.component';

describe('DetalleTmdbPeliculaComponent', () => {
  let component: DetalleTmdbPeliculaComponent;
  let fixture: ComponentFixture<DetalleTmdbPeliculaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetalleTmdbPeliculaComponent]
    });
    fixture = TestBed.createComponent(DetalleTmdbPeliculaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
