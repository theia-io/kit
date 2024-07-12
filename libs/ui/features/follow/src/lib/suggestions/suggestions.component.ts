import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { Profile, User } from "@kitouch/shared/models";

@Component({
    standalone: true,
    selector: 'feat-follow-suggestions',
    templateUrl: './suggestions.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule
        // 
        //
    ],
})
export class FeatFollowSuggestionsComponent {
    user = input<User>();
    profile = input<Profile>();
} 