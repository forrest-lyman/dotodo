import {inject, Injectable} from '@angular/core';
import {Auth, User, user, signInWithRedirect, signOut, signInWithPopup} from '@angular/fire/auth';
import {GoogleAuthProvider} from 'firebase/auth';
import {map, Subscription} from 'rxjs';
import {toSignal} from '@angular/core/rxjs-interop';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
}
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private auth: Auth = inject(Auth);
  readonly user = toSignal<UserProfile | null>(user(this.auth).pipe(map((u: User | null) => u ? {
    uid: u.uid,
    displayName: u.displayName,
    photoURL: u.photoURL,
    email: u.email
  } as UserProfile : null)))

  constructor() {
  }

  signIn() {
    return signInWithPopup(this.auth, new GoogleAuthProvider())
  }

  signOut() {
    return signOut(this.auth);
  }
}
