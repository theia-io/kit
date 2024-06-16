import { CommonModule } from "@angular/common";
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    standalone: true,
    selector: 'feat-tweet-actions',
    templateUrl: `actions.component.html`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        OverlayPanelModule,
    ]
})
export class FeatTweetActionsComponent {
    @Input() 
    comments = 0;

    @Input() 
    repostsAndQuotes = 0;

    @Input() 
    likes = 0;

    @Input()
    liked: boolean | null | undefined = false;

    @Input()
    bookmarked = false;

    @Output() 
    comment = new EventEmitter<Event>();

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