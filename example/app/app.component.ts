import {Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router, RouterLink, RouterOutlet} from '@angular/router';
import {MatButton, MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MarkdownModule} from 'ngx-markdown';
import {MatSidenavModule} from '@angular/material/sidenav';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {NoteService} from './services/note.service';
import {UserService} from './services/user.service';
import {DatePipe, NgFor, NgIf, SlicePipe} from '@angular/common';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatBottomSheet, MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {TermsOfUseComponent} from './pages/terms-of-use/terms-of-use.component';
import {PrivacyComponent} from './pages/privacy/privacy.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    NgIf,
    NgFor,
    DatePipe,
    RouterLink,
    SlicePipe,
    MatBottomSheetModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  readonly noteService = inject(NoteService);
  readonly userService = inject(UserService);
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  private bottomSheet = inject(MatBottomSheet);

  async signOut() {
    await this.userService.signOut();
    await this.router.navigate(['/']);
  }

  terms() {
    this.bottomSheet.open(TermsOfUseComponent, {
      panelClass: 'legal'
    });
  }

  privacy() {
    this.bottomSheet.open(PrivacyComponent, {
      panelClass: 'legal'
    });
  }
}

