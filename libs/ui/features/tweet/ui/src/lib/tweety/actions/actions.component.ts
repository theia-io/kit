import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    standalone: true,
    selector: 'feat-tweet-actions',
    templateUrl: `actions.component.html`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule
    ]
})
export class FeatTweetActionsComponent {
    @Input() 
    likes = 0;

    @Input() 
    retweets = 0;

    @Input() 
    replies = 0;

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