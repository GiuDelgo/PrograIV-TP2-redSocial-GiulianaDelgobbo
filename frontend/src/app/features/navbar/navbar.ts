import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {}
