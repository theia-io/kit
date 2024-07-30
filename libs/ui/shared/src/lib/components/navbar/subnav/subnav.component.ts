import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  standalone: true,
  selector: 'sub-navbar',
  templateUrl: './subnav.component.html',
  imports: [
    CommonModule,
    TooltipModule
  ],
})
export class SubnavComponent {
  @Output()
  logout = new EventEmitter<void>();

  @Output() 
  help = new EventEmitter<void>();
}
