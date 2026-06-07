import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})

export class Navbar {
  sesion = signal<boolean> (false);

  ngOninit(){
    this.sesionActiva ();
  }

  sesionActiva (){
    const sessionStorage = localStorage.getItem('usuario_sesion');

    return sessionStorage ? this.sesion.set(true) : this.sesion.set(false);
  }
}
