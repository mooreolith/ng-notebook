import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotebookComponent } from './components/notebook/notebook';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NotebookComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ng-notebook');
}
