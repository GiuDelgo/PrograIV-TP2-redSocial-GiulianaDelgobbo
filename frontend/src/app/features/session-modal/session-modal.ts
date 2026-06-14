import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-session-modal',
  imports: [],
  templateUrl: './session-modal.html',
  styleUrl: './session-modal.css',
})
export class SessionModal {
  constructor (public authService: AuthService, private router:Router){}

  extenderSesion(){
    this.authService.extenderSesion().subscribe();
  }

  salir(){
    this.authService.logout();
    this.router.navigate(['./login']);
  }
}
