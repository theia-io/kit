import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  standalone: true,
  selector: 'ui-kit-follow-button',
  imports: [CommonModule, ButtonModule],
  templateUrl: './follow-button.component.html',
  styleUrls: ['./follow-button.component.scss'],
})
export class FollowButtonComponent {
  alreadyFollowing = input(false);

  text = computed(() => (this.alreadyFollowing() ? 'Stop seeing' : 'Connect'));
  severity = computed(() =>
    this.alreadyFollowing() ? 'secondary' : 'contrast'
  );
  icon = computed(() =>
    this.alreadyFollowing() ? 'pi-user-minus' : 'pi-user-plus'
  );
}
