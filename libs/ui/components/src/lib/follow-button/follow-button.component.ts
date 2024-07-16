import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ui-kit-follow-button',
  template: `<button
    class=" py-2 px-4 rounded-full bg-transparent hover:bg-neutral-400 hover:font-semibold border border-neutral-400 hover:border-neutral-600"
  >
    {{ alreadyFollowing ? 'Stop follow' : 'Follow' }}
  </button>`,
})
export class FollowButtonComponent {
  @Input()
  alreadyFollowing = false;
}
