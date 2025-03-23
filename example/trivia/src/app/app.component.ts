import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'trivia';

  //todo add a dynamic headline that includes the current date
  //todo create a getter that gets the current user from the user service and returns a personalized greeting
  //todo add a signup form using reactive forms
}
