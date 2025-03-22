import {inject, Injectable, signal} from '@angular/core';
import {addDoc, updateDoc, collection, collectionData, doc, docData, Firestore, query, where} from '@angular/fire/firestore';
import {firstValueFrom, map, mergeMap, Observable, of} from 'rxjs';
import {UserService} from './user.service';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';
import {z} from 'zod';
import {AiService} from './ai.service';

// todo add payload that can be anything
export interface Note {
  notes: string;
  uid: string;
  id?: string;
  createdAt: Date | any;
  status: string;
  guide?: {
    quiz: any[];
    studyGuide: string;
    subject: string;
  }
}

export interface NewNote {
  url: string;
  uid: string;
}
@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private firestore: Firestore = inject(Firestore);
  private userService = inject(UserService);
  private aiService = inject(AiService);
  private noteCollection = collection(this.firestore, 'notes');

  readonly active = signal<Note | null>(null);
  public myNotes = signal<Note[]>([]);

  constructor() {
    this.loadMyNotes();
  }

  loadMyNotes() {
    return toObservable(this.userService.user).pipe(
      mergeMap(user => {
        if (!user) {
          return of([])
        } else {
          const q = query(this.noteCollection, where('uid', '==', user.uid));
          return collectionData<Note>(q, {idField: 'id'});
        }
      })
    ).subscribe((notes) => this.myNotes.set(notes));
  }

  load(id: string | undefined) {
    if (!id) {
      throw new Error('Invalid id')
    }
    const docRef = doc(this.noteCollection, id);
    return docData(docRef).subscribe((note: any) => {
      this.active.set(note);
    });
  }

  async create(notes: string) {
    const user = this.userService.user();
    if (!user) {
      throw new Error('Unauthorized');
    }
    const data = {
      notes,
      uid: user.uid,
      createdAt: new Date(),
      status: 'new'
    } as Note
    const res: any = await addDoc(this.noteCollection, data);
    return {
      id: res.id,
      ...data
    }
  }


}
