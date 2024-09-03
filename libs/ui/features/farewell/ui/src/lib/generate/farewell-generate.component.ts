import { NgOptimizedImage } from '@angular/common';
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
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {
  FarewellFullView,
  FeatFarewellActions,
  selectFarewellFullViewById,
} from '@kitouch/feat-farewell-data';
import { selectCurrentProfile } from '@kitouch/kit-data';
import {
  Farewell,
  FarewellAnalytics,
  FarewellMedia,
} from '@kitouch/shared-models';
import {
  UiKitCompAnimatePingComponent,
  UiKitDeleteComponent,
  UiKitPicUploadableComponent,
} from '@kitouch/ui-components';
import {
  APP_PATH,
  APP_PATH_ALLOW_ANONYMOUS,
  PhotoService,
} from '@kitouch/ui-shared';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import PhotoSwipe from 'photoswipe';
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
    NgOptimizedImage,
    ReactiveFormsModule,
    //
    UiKitCompAnimatePingComponent,
    UiKitDeleteComponent,
    UiKitPicUploadableComponent,
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
  domSanitizer = inject(DomSanitizer);
  #router = inject(Router);
  #store = inject(Store);
  #photoService = inject(PhotoService);
  #actions$ = inject(Actions);

  farewellToEdit = computed(() => {
    const id = this.farewellIdToEdit();
    return id
      ? this.#store.selectSignal(selectFarewellFullViewById(id))()
      : undefined;
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
  farewellAnalytics = signal<FarewellAnalytics | null>(null);
  farewellMedias = signal<Array<FarewellMedia> | null>(null);
  editorTextValue = signal<string>('');
  filesToUpload = signal<Array<File>>([]);

  URL = URL;

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

          const { media, analytics } = farewellToEdit;
          if (media) {
            this.farewellMedias.set(media);
          }

          if (analytics) {
            this.farewellAnalytics.set(analytics);
          }

          this.#cdr.detectChanges();
        }
      },
      { allowSignalWrites: true }
    );

    effect(() => {
      const farewellMediaUpdated = this.farewellMedias();

      if (farewellMediaUpdated) {
        setTimeout(() => {
          this.#initFarewellMediaGallery();
        }, 1500);
      }
    });
  }

  onTextChangeHandler({ textValue }: EditorTextChangeEvent) {
    this.editorTextValue.set(textValue);
  }

  deleteFarewellMediaHandler(media: FarewellMedia) {
    // TODO  verify if this covers all use-cases
    this.farewellMedias.update(
      (medias) => medias?.filter(({ id }) => id !== media.id) ?? []
    );
  }

  deleteNewMediaHandler(media: File) {
    // TODO  verify if this covers all use-cases
    this.filesToUpload.update((files) =>
      files.filter((files) => files.name !== media.name)
    );
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

  #initFarewellMediaGallery() {
    this.#photoService.initializeGallery({
      gallery: '#uploaded-media-gallery',
      children: 'a',
      pswpModule: PhotoSwipe,
    });
  }

  #initNewFarewellMediaGallery() {
    this.#photoService.initializeGallery({
      gallery: '#new-media-gallery',
      children: 'a',
      pswpModule: PhotoSwipe,
    });
  }

  #updateFarewell({ media: _, analytics: __, ...farewell }: FarewellFullView) {
    this.#store.dispatch(
      FeatFarewellActions.putFarewell({
        farewell,
      })
    );

    this.#actions$
      .pipe(
        ofType(FeatFarewellActions.putFarewellSuccess),
        take(1),
        takeUntilDestroyed(this.#destroyRef),
        tap(({ farewell: { id } }) => this.#farewellMedia(id))
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

  #farewellMedia(farewellId: string) {
    const mediaFiles = this.filesToUpload(),
      profile = this.currentProfile();

    if (mediaFiles?.length && profile?.id) {
      this.#store.dispatch(
        FeatFarewellActions.uploadFarewellStorageMedia({
          farewellId,
          profileId: profile.id,
          items: mediaFiles.map((mediaFile) => ({
            key: `${farewellId}/${profile.id}/${mediaFile.name}`,
            blob: mediaFile,
          })),
        })
      );
    }
  }
}
