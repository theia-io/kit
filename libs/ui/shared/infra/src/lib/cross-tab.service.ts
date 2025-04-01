// src/app/core/services/cross-tab-sync.service.ts
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';

// Define a type for your cross-tab messages (optional but good practice)
interface CrossTabMessage {
  type: string; // Corresponds to your NGRX action type
  payload?: any;
}

@Injectable({
  providedIn: 'root',
})
export class CrossTabSyncService implements OnDestroy {
  private channel: BroadcastChannel;
  private readonly channelName = 'kit.cross-tab'; // Use a unique name

  // Subject to emit messages received from other tabs
  private messageSubject = new Subject<CrossTabMessage>();
  public messages$: Observable<CrossTabMessage> =
    this.messageSubject.asObservable();

  constructor() {
    // Check for BroadcastChannel support
    if ('BroadcastChannel' in window) {
      this.channel = new BroadcastChannel(this.channelName);
      this.channel.onmessage = (event: MessageEvent<CrossTabMessage>) => {
        console.log('Received cross-tab message:', event.data);
        this.messageSubject.next(event.data);
      };
      this.channel.onmessageerror = (event) => {
        console.error('BroadcastChannel error:', event);
      };
    } else {
      console.warn('BroadcastChannel API not supported in this browser.');
      // Implement fallback (e.g., localStorage) or disable feature
    }
  }

  sendMessage(message: CrossTabMessage): void {
    if (this.channel) {
      console.log('Sending cross-tab message:', message);
      this.channel.postMessage(message);
    } else {
      console.warn(
        'Cannot send message: BroadcastChannel not supported or initialized.'
      );
    }
  }

  ngOnDestroy(): void {
    // Clean up the channel when the service is destroyed (e.g., app closes)
    if (this.channel) {
      this.channel.close();
    }
  }
}
