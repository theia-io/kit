import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  FeatFarewellActions,
  selectFarewellById,
} from '@kitouch/feat-farewell-data';
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
    CommonModule,
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
  farewellIdToEdit = input<string | null>(null);

  #cdr = inject(ChangeDetectorRef);
  #destroyRef = inject(DestroyRef);
  #router = inject(Router);
  #store = inject(Store);
  #actions$ = inject(Actions);

  farewellToEdit = computed(() => {
    const id = this.farewellIdToEdit();
    return id ? this.#store.selectSignal(selectFarewellById(id))() : undefined;
  });

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

  farewellFormGroup = inject(FormBuilder).group({
    titleControl: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(128),
    ]),
    editorControl: new FormControl<string>('', [Validators.required]),
  });
  editorTextValue = signal<string>('');

  constructor() {
    this.farewellFormGroup.valueChanges.subscribe((v) =>
      console.log('Farewell form value', v)
    );

    effect(() => {
      const farewellToEdit = this.farewellToEdit();
      console.log('farewellToEdit', this.farewellToEdit());

      if (farewellToEdit) {
        this.farewellFormGroup.patchValue({
          titleControl: farewellToEdit.title,
          editorControl: farewellToEdit.content,
        });
        this.#cdr.detectChanges();
      }
    });
  }

  onTextChangeHandler({ textValue }: EditorTextChangeEvent) {
    this.editorTextValue.set(textValue);
  }

  saveFarewellHandler() {
    const { titleControl, editorControl } = this.farewellFormGroup.value;
    if (!titleControl || !editorControl) {
      console.error('Should not happen. Title or Body of farewell is not set');
      return;
    }

    this.#store.dispatch(
      FeatFarewellActions.createFarewell({
        title: titleControl,
        content: editorControl,
      })
    );

    this.#actions$
      .pipe(
        ofType(FeatFarewellActions.createFarewellSuccess),
        take(1),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe(({ farewell }) =>
        this.#router.navigate(
          ['s', APP_PATH_ALLOW_ANONYMOUS.Farewell, farewell.id],
          {
            queryParams: { preview: true },
          }
        )
      );
  }
}
