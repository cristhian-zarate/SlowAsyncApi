import { Injectable, NgZone } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TextService {
  private eventSource!: EventSource | null;

  constructor(private zone: NgZone) {}

  getEventSource(url: string, options: EventSourceInit): EventSource {
       return new EventSource(url, options);
   }

   connectToServerSentEvents(url: string, options: EventSourceInit, eventNames: string[] = []): Observable<Event> {
       this.eventSource = this.getEventSource(url, options);

       return new Observable((subscriber: Subscriber<Event>) => {
           this.eventSource!.onerror = error => {
               this.zone.run(() => subscriber.error(error));
           };

           eventNames.forEach((event: string) => {
               this.eventSource!.addEventListener(event, data => {
                  this.zone.run(() => subscriber.next(data));
               });
           });
       });
   }

   close(): void {
       if (!this.eventSource) {
           return;
       }

       this.eventSource.close();
       this.eventSource = null;
   }

  public GetText(text: string): Observable<string> {
    return new Observable(observer => {
      // const controller = new AbortController();

      // fetch(`http://localhost:5018/api/default?text=${text}`, { signal: controller.signal })
      //   .then(async response => {
      //     const reader = response.body?.getReader();
      //     if (!reader) {
      //       throw new Error('Failed to read response');
      //     }
      //     const decoder = new JsonStreamDecoder();

      //     while (true) {
      //       const { done, value } = await reader.read();
      //       if (done) break;
      //       if (!value) continue;

      //       decoder.decodeChunk<T>(value, item => observer.next(item));
      //     }
      //     observer.complete();
      //     reader.releaseLock();
      //   })
      //   .catch(err => observer.error(err));

      // return () => controller.abort();

      this.eventSource = new EventSource(`http://localhost:5018/api/default?text=${text}`);

      this.eventSource.onmessage = event => {
        observer.next(event.data);
      };

      this.eventSource.onerror = error => {
        observer.error(error);
        this.eventSource!.close();
      };

      return () => {
        this.eventSource!.close();
      };
    });
  }
}
