import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TextService {
  public GetText(text: string): Observable<string> {
    return new Observable(observer => {
      // const controller = new AbortController();

      fetch(`http://localhost:5018/api/default?text=${text}`)
        .then(async response => {
          const reader = response.body?.getReader();
          if (!reader) {
            throw new Error('Failed to read response');
          }
          const decoder = new TextDecoder();

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            if (!value) continue;

            const decoded = decoder.decode(value);
            observer.next(decoded);
          }
          observer.complete();
          reader.releaseLock();
        })
        .catch(err => observer.error(err));
    });
  }
}
