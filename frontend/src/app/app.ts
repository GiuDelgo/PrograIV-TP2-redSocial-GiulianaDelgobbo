import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './features/navbar/navbar';
import {SessionModal} from './features/session-modal/session-modal'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,  Navbar, SessionModal],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
