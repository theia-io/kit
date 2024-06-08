import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Output } from "@angular/core";

@Component({
    standalone: true,
    selector: 'feat-tweet-actions',
    templateUrl: `actions.component.html`,
    imports: [
        CommonModule
    ]
})
export class FeatTweetActionsComponent {
    @Output() 
    reply = new EventEmitter<void>();

    @Output() 
    repost = new EventEmitter<void>();

    @Output() 
    quote = new EventEmitter<void>();

    @Output() 
    like = new EventEmitter<void>();

    @Output() 
    share = new EventEmitter<void>();

    @Output() 
    bookmark = new EventEmitter<void>();
}