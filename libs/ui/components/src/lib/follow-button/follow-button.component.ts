import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  standalone: true,
  selector: 'ui-kit-follow-button',
  imports: [CommonModule, ButtonModule],
  templateUrl: './follow-button.component.html',
  styleUrls: ['./follow-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FollowButtonComponent {
  alreadyFollowing = input(false);
  outlined = input(true);
  connectText = input('Connect');
  stopConnectText = input('Stop seeing');

  text = computed(() =>
    this.alreadyFollowing() ? this.stopConnectText() : this.connectText()
  );
  severity = computed(() =>
    this.alreadyFollowing() ? 'secondary' : 'contrast'
  );
  icon = computed(() =>
    this.alreadyFollowing() ? 'pi-user-minus' : 'pi-user-plus'
  );
}
