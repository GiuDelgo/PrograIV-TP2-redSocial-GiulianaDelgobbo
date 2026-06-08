import { Component, computed } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})

export class Navbar{
  constructor (private authService: AuthService){}

  sesion = computed(() => !!this.authService.usuarioActual());

  logoutUsuario (){
    this.authService.logout();
  }
}
