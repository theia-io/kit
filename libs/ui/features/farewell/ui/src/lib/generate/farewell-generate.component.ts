import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FeatFarewellActions } from '@kitouch/feat-farewell-data';
import { APP_PATH_ALLOW_ANONYMOUS } from '@kitouch/ui-shared';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { EditorModule, EditorTextChangeEvent } from 'primeng/editor';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { take } from 'rxjs';

@Component({
  standalone: true,
  selector: 'feat-farewell-generate',
  templateUrl: './farewell-generate.component.html',
  imports: [
    ReactiveFormsModule,
    //
    EditorModule,
    FloatLabelModule,
    InputTextModule,
    ButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatFarewellGenerateComponent {
  #destroyRef = inject(DestroyRef);
  #router = inject(Router);
  #store = inject(Store);
  #actions$ = inject(Actions);

  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'], // toggled buttons
      ['blockquote', 'code-block'],
      ['link'],

      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
      [{ indent: '-1' }, { indent: '+1' }], // outdent/indent

      ['clean'], // remove formatting button
    ],
  };

  editorText = signal<EditorTextChangeEvent | null>(null);
  textValue = computed(() => this.editorText()?.textValue ?? '');

  farewellTitleControl = new FormControl<string>('', [
    Validators.required,
    Validators.minLength(10),
    Validators.maxLength(150),
  ]);

  onTextChangeHandler(value: EditorTextChangeEvent) {
    this.editorText.set(value);
  }

  saveFarewellHandler() {
    this.#store.dispatch(
      FeatFarewellActions.createFarewell({
        title: this.farewellTitleControl.value ?? '',
        content: this.editorText()?.htmlValue ?? '',
      })
    );

    this.#actions$
      .pipe(
        ofType(FeatFarewellActions.createFarewellSuccess),
        take(1),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe(({ farewell }) =>
        this.#router.navigateByUrl(
          `${APP_PATH_ALLOW_ANONYMOUS.Farewell}/${farewell.id}`
        )
      );
  }
}
