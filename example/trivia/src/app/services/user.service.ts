import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  readonly currentUser = signal('Forrest');
  constructor() { }
}
