import {Component, inject, signal} from '@angular/core';
import {NoteService} from '../../services/note.service';
import {UserService} from '../../services/user.service';
import {ActivatedRoute, Router, RouterLink, RouterOutlet} from '@angular/router';
import {toObservable} from '@angular/core/rxjs-interop';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MarkdownModule} from 'ngx-markdown';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {DatePipe, NgFor, NgIf, SlicePipe} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {MatRadioModule} from '@angular/material/radio';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    RouterOutlet,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MarkdownModule,
    MatSidenavModule,
    ReactiveFormsModule,
    MatListModule,
    NgIf,
    NgFor,
    DatePipe,
    MatCardModule,
    MatTabsModule,
    RouterLink,
    SlicePipe,
    MatRadioModule
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {
  readonly noteService = inject(NoteService);
  readonly userService = inject(UserService);
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);

  readonly notes = new FormControl(localStorage.getItem('notes') || '', [
    Validators.required
  ]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  title = 'browser';

  constructor() {
    this.notes.valueChanges.subscribe(value => localStorage.setItem('notes', value || ''));
  }

  async submit() {
    if (! this.notes.valid) {
      throw new Error('Invalid notes');
    }
    this.loading.set(true);
    try {
      const doc = await this.noteService.create(this.notes.value as string);
      this.notes.reset();
      await this.router.navigate([doc.id]);
    } catch (e: any) {
      this.error.set(e.message);
      console.error(this.error());
    }
    this.loading.set(false);
  }

  reset() {
    this.loading.set(false);
    this.notes.reset();
    this.error.set(null);
  }

  loadSample() {
    this.notes.setValue(sample);
  }
}

const sample: string = [
  "Tomatoes come in two types: determinate (bush) and indeterminate (vining). Determinate varieties stop growing once they reach a certain size, while indeterminate keep growing and producing fruit all season. Examples include cherry, Roma, and beefsteak.",

  "They need well-drained, loamy soil. Ideal pH is between 6.0 and 6.8. Adding compost or aged manure to the soil helps with nutrients.",

  "Tomatoes need full sun, at least 6-8 hours a day. Morning sun is best, but they should be protected from intense afternoon heat.",

  "Wait until after the last frost to plant seedlings outdoors. When planting, bury part of the stem deeper than the roots to encourage more root growth.",

  "Water deeply and consistently, about 1-2 inches of water per week. Avoid getting water on the leaves to reduce the chance of diseases. Mulch helps keep moisture in the soil and prevents splashing.",

  "Fertilize regularly with a balanced fertilizer like 10-10-10 or something higher in phosphorus. Don’t use too much nitrogen, or you’ll end up with more leaves and fewer tomatoes.",

  "Pinch off suckers (the little shoots between the main stem and branches) to focus energy on growing fruit. Prune lower leaves to improve airflow and prevent diseases.",

  "Common pests to watch out for: aphids, cutworms, whiteflies, and tomato hornworms. Rotate crops each year to reduce the risk of diseases like blight and powdery mildew.",

  "Use stakes, cages, or trellises to support plants, especially indeterminate varieties. Tie them loosely with twine to avoid damage.",

  "Harvest tomatoes when they’re firm and fully colored (depends on variety—red, yellow, orange, or even purple). Best to pick in the morning when they’re freshest."
].join(`\n\n`);
