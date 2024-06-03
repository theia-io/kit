import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SearchComponent } from '../search/search.component';

@Component({
  standalone: true,
  selector: 'global-search',
  templateUrl: './global-search.component.html',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    //
    SearchComponent,
  ],
})
export class GlobalSearchComponent {
  searchControl = new FormControl<string>('');

  search$ = this.searchControl.valueChanges
    .pipe(takeUntilDestroyed())
    .subscribe((v) => console.log('test inside global search', v));

  handleSubmitted(search: string | null) {
    console.log('handleSubmitted', search);
  }

  handleTextOnChanged(search: string | null) {
    console.log('handleTextOnChanged', search);
  }
}
