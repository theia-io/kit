import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from '@angular/core';
import { Farewell } from '@kitouch/shared-models';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { TooltipModule } from 'primeng/tooltip';
import { FeatFarewellViewV2Component } from '../viewV2/viewV2.component';
import { NgClass } from '@angular/common';

@Component({
  standalone: true,
  selector: 'feat-farewell-preview',
  templateUrl: './preview.component.html',
  imports: [
    NgClass,
    ButtonModule,
    SidebarModule,
    TooltipModule,
    FeatFarewellViewV2Component,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatFarewellPreviewComponent {
  id = input.required<Farewell['id']>();
  visible = model<boolean>(false);
  kClass = input<string>('');

  updatePreview() {
    this.visible.update((visibility) => !visibility);
  }
}
