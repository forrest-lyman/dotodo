import {Component, computed, inject, signal} from '@angular/core';
import {ActivatedRoute, RouterLink, RouterOutlet} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MarkdownModule} from 'ngx-markdown';
import {MatSidenavModule} from '@angular/material/sidenav';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatListModule} from '@angular/material/list';
import {DatePipe, NgFor, NgIf, SlicePipe} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {MatRadioModule} from '@angular/material/radio';
import {NoteService} from '../../services/note.service';
import {UserService} from '../../services/user.service';
import {toObservable} from '@angular/core/rxjs-interop';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-guide',
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
    MatRadioModule,
    MatProgressBarModule,
    MatProgressSpinner
  ],
  templateUrl: './guide.component.html',
  styleUrl: './guide.component.scss'
})
export class GuideComponent {
  readonly noteService = inject(NoteService);
  readonly userService = inject(UserService);
  readonly route = inject(ActivatedRoute);

  readonly answers = signal<any[]>([]);
  readonly showAnswers = signal<boolean>(false);

  readonly complete = computed(() => {
    const answers = this.answers();
    const notes = this.noteService.active();
    return answers.length === notes?.guide?.quiz.length && ! answers.find(a => ! a)
  })

  readonly loaded = computed(() => {
    const notes = this.noteService.active();
    return notes?.status === 'done';
  })

  readonly score = computed(() => {
    const answers = this.answers();
    const notes = this.noteService.active();
    if (! notes?.guide?.quiz) {
      return 0;
    }
    return [...notes.guide.quiz].reduce((score: number, question: any, idx: number) => {
      const answer = answers[idx];
      if (question.answers.find((a: any) => a.text === answer)?.correct) {
        score += 1;
      }
      return score;
    }, 0);
  })

  readonly notes = computed(() => {
    const doc = this.noteService.active();
    if (! doc) {
      return [];
    } else {
      return doc.notes.split(`\n`).map(n => n.trim()).filter(n => !! n);
    }
  })

  constructor() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.noteService.load(params['id']);
      } else {
        this.noteService.active.set(null);
      }
    });
  }

  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  title = 'browser';

  setAnswer(idx: number, ev: any) {
    this.answers.update(answers => {
      answers[idx] = ev.value;
      return [
        ...answers
      ]
    })
    console.log(this.answers())
  }

  finishQuiz() {
    this.showAnswers.set(true);
  }

}

