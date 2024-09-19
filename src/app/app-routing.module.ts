import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaPeliculasComponent } from './lista-peliculas/lista-peliculas.component';
import { DetallePeliculaComponent } from './detalle-pelicula/detalle-pelicula.component';
import { DetalleTmbdPeliculaComponent } from './detalle-tmdb-pelicula/detalle-tmdb-pelicula.component';
import { AgregarPeliculaComponent } from './agregar-pelicula/agregar-pelicula.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { RegistroComponent } from './registro/registro.component'; // Importar el componente de registro
import { LoginComponent } from './login/login.component'; // Importar el componente de login
import { MiSalonComponent } from './mi-salon/mi-salon.component'; 
const routes: Routes = [
  { path: '', component: ListaPeliculasComponent },
  { path: 'agregar-pelicula', component: AgregarPeliculaComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'detalle-pelicula/:id', component: DetallePeliculaComponent },
  { path: 'detalle-tmdb/:tmdbId', component: DetalleTmbdPeliculaComponent } ,
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'mi-salon', component: MiSalonComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
