import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FarewellStatus, KudoBoardStatus } from '@kitouch/shared-models';
import { Tag, TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  standalone: true,
  selector: 'shared-status-legend',
  template: `
    <div class="flex items-center gap-2">
      <i class="pi pi-info-circle text-xl"></i>
      <span
        >Legend
        <span class="text-sm text-gray-500">(Hover for description)</span>
      </span>
      <i class="pi pi-chevron-right text-gray-400"></i>

      @for (possibleStatus of statuses; track $index) {
        <p-tag
          [pTooltip]="statusExplanation[possibleStatus]"
          class="flex items-center"
          [severity]="severityIcons[possibleStatus]"
        >
          <i class="pi mr-1" [ngClass]="[statusesIcons[possibleStatus]]"></i>
          {{ possibleStatus }}
          <!-- - <span class="text-sm text-gray-500">({{ statusExplanation[possibleStatus] }})</span> -->
        </p-tag>
      }
    </div>
  `,
  imports: [NgClass, TagModule, TooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// <T extends KudoBoardStatus | FarewellStatus>
export class SharedStatusLegendComponent {
  // status = input<T>();

  statuses = Object.values(FarewellStatus).filter(
    (v) => v !== FarewellStatus.Removed,
  );
  statusesIcons = {
    [FarewellStatus.Draft]: 'pi pi-exclamation-triangle',
    // [KudoBoardStatus.Draft]: 'pi pi-exclemation-circle',
    [FarewellStatus.Published]: 'pi pi-check-circle',
    // [KudoBoardStatus.Published]: 'pi pi-check-circle',
    [FarewellStatus.Removed]: 'pi pi-ban',
    // [KudoBoardStatus.Removed]: 'pi pi-ban',
  };
  severityIcons: { [index: string]: Tag['severity'] } = {
    [FarewellStatus.Draft]: 'warning',
    [FarewellStatus.Published]: 'success',
    [FarewellStatus.Removed]: 'danger',
  };
  statusExplanation = {
    [FarewellStatus.Draft]:
      'Draft does not show any information and it is public.',
    [FarewellStatus.Published]:
      'Published fully visible to everyone and it is public',
    [FarewellStatus.Removed]:
      'Removed is not visible to anyone and it is private',
  };
}
