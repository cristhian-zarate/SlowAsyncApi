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

    this.eventSourceSubscription = this.textService.GetText(this.inputText)
      .subscribe({
        next: data => {
          this.responseText += data;
        },
        complete: () => this.Running = false,
        error: err => {
          console.error(err);
          this.Running = false;
        }
      }
      );
  };

  cancel = () => {
    this.textService.Abort();
    this.Running = false;
  }

  ngOnDestroy(): void {
    this.eventSourceSubscription.unsubscribe();
  }
}
