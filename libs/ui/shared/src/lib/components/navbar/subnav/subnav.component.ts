import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  standalone: true,
  selector: 'sub-navbar',
  templateUrl: './subnav.component.html',
  imports: [CommonModule],
})
export class SubnavComponent {
  @Output()
  logout = new EventEmitter<void>();
}
