import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from "./sidebar/sidebar";
import { RentList } from "./rent-list/rent-list";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar, RentList],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('homerent_front');
}
