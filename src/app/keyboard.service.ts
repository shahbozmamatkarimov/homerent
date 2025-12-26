import { Injectable } from '@angular/core';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class KeyboardService {
  esc$ = fromEvent<KeyboardEvent>(document, 'keydown').pipe(
    filter(e => e.key === 'Escape')
  );
}
