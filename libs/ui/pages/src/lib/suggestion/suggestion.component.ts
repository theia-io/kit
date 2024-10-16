import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FeatFollowSuggestionsComponent } from '@kitouch/follow-ui';

@Component({
  standalone: true,
  imports: [FeatFollowSuggestionsComponent],
  selector: 'kit-page-suggestion',
  templateUrl: './suggestion.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageSuggestionComponent {}
