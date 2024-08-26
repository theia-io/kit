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
import { selectCurrentProfile } from '@kitouch/kit-data';
import { Farewell } from '@kitouch/shared-models';
import { APP_PATH, APP_PATH_ALLOW_ANONYMOUS } from '@kitouch/ui-shared';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { sign } from 'crypto';
import { ButtonModule } from 'primeng/button';
import { EditorModule, EditorTextChangeEvent } from 'primeng/editor';
import { FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { take, tap } from 'rxjs';

function extractContent(html: string) {
  const span = document.createElement('span');
  span.innerHTML = html;
  return span.textContent || span.innerText;
}

@Component({
  standalone: true,
  selector: 'feat-farewell-generate',
  templateUrl: './farewell-generate.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    //
    ToastModule,
    FileUploadModule,
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
  currentProfile = this.#store.selectSignal(selectCurrentProfile);

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
  filesToUpload = signal<Array<File>>([]);

  constructor() {
    effect(
      () => {
        const farewellToEdit = this.farewellToEdit();

        if (farewellToEdit) {
          this.farewellFormGroup.patchValue({
            titleControl: farewellToEdit.title,
            editorControl: farewellToEdit.content,
          });
          this.editorTextValue.set(extractContent(farewellToEdit.content));
          this.#cdr.detectChanges();
        }
      },
      { allowSignalWrites: true }
    );
  }

  onTextChangeHandler({ textValue }: EditorTextChangeEvent) {
    this.editorTextValue.set(textValue);
  }

  onBasicUploadAuto(event: FileUploadHandlerEvent) {
    const files = event.files;
    this.filesToUpload.set(files);
  }

  saveFarewellHandler() {
    const { titleControl: title, editorControl: content } =
      this.farewellFormGroup.value;
    if (!title || !content) {
      console.error('Should not happen. Title or Body of farewell is not set');
      return;
    }

    const farewellToEdit = this.farewellToEdit();

    if (farewellToEdit) {
      this.#updateFarewell({
        ...farewellToEdit,
        title,
        content,
      });
    } else {
      this.#createFarewell({ title, content });
    }
  }

  #updateFarewell(farewell: Farewell) {
    this.#store.dispatch(
      FeatFarewellActions.putFarewell({
        farewell,
      })
    );

    this.#actions$
      .pipe(
        ofType(FeatFarewellActions.putFarewellSuccess),
        take(1),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe(() => this.#router.navigateByUrl(APP_PATH.Farewell));
  }

  #createFarewell({ title, content }: Pick<Farewell, 'title' | 'content'>) {
    this.#store.dispatch(
      FeatFarewellActions.createFarewell({
        title,
        content,
      })
    );

    this.#actions$
      .pipe(
        ofType(FeatFarewellActions.createFarewellSuccess),
        take(1),
        takeUntilDestroyed(this.#destroyRef),
        tap(({ farewell: { id } }) => this.#farewellMedia(id))
      )
      .subscribe(({ farewell: { id } }) => {
        // FIXME
        // @FIXME once new farewell is created - analytics and media as likely still being created or uploaded
        this.#router.navigate(['s', APP_PATH_ALLOW_ANONYMOUS.Farewell, id], {
          queryParams: { preview: true },
        });
      });
  }

  #farewellMedia(id: string) {
    const mediaFiles = this.filesToUpload(),
      profile = this.currentProfile();

    if (mediaFiles?.length && profile) {
      this.#store.dispatch(
        FeatFarewellActions.uploadFarewellMedia({
          items: mediaFiles.map((mediaFile) => ({
            key: `${profile.id}/${id}/${mediaFile.name}`,
            blob: mediaFile,
          })),
        })
      );
    }
  }
}
