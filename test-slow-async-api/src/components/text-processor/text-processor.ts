import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TextService } from '../../services/text-service';
import { SubscriptionLike } from 'rxjs';

@Component({
  selector: 'app-text-processor',
  imports: [FormsModule],
  templateUrl: './text-processor.html',
  styleUrl: './text-processor.css'
})
export class TextProcessor implements OnDestroy {
  inputText: string = '';
  Running: boolean = false;
  responseText: string = '';
  private eventSourceSubscription!: SubscriptionLike;

  constructor(private textService: TextService) { }

  run = () => {
    this.Running = true;
    this.responseText = '';
    // this.textService.GetText(this.inputText)
    //   .subscribe({
    //     next: text => this.responseText += text,
    //     error: err => console.error(err),
    //     complete: () => {
    //       console.log('FINISH');
    //       this.Running = false;
    //     }
    //   });

    const url = 'https://your-server.com/sse';
    const options = { withCredentials: true };
    const eventNames = ['myEventName'];
    this.eventSourceSubscription = this.textService.connectToServerSentEvents(url, options, eventNames)
      .subscribe({
        next: data => {
          this.responseText += data;
        },
        error: error => {
          console.log('FINISH');
          this.Running = false;
        }
      }
      );
  };

  cancel = () => this.Running = false;

  ngOnDestroy(): void {
    this.eventSourceSubscription.unsubscribe();
    this.textService.close();
  }
}
