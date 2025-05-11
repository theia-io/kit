import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'shared-sidebar-preview',
  templateUrl: './preview.component.html',
  imports: [NgClass, ButtonModule, SidebarModule, TooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatSideBarPreviewComponent {
  visible = model<boolean>(false);
  kClass = input<string>('');

  updatePreview() {
    this.visible.update((visibility) => !visibility);
  }
}
