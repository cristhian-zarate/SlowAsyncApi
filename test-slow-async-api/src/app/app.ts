import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TextProcessor } from "../components/text-processor/text-processor";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TextProcessor],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'angular-app';
}
