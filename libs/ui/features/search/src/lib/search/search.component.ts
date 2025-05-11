import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

/**
 * @TODO
 * 1. Search icons,
 * 2. add search ahead
 */

@Component({
  selector: 'search',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: SearchComponent,
    },
  ],
})
export class SearchComponent<T extends string> implements ControlValueAccessor {
  @Output()
  submitted = new EventEmitter<T | null>();

  @Output()
  textOnChanged = new EventEmitter<T | null>();

  searchControl = new FormControl<T | null>(null);
  searchChanges$ = this.searchControl.valueChanges
    .pipe(takeUntilDestroyed(), debounceTime(500), distinctUntilChanged())
    .subscribe((value) => {
      this.textOnChanged.emit(value);
      this.onChange(value);
    });

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange: any = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched: any = () => {};
  touched = false;
  disabled = false;

  writeValue(value: T) {
    // this.value = value;
    this.searchControl.setValue(value);
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }
}
