import { Location, NgOptimizedImage } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  model,
  NgZone,
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
  FeatFarewellMediaActions,
  selectFarewellFullViewById,
} from '@kitouch/feat-farewell-data';
import { selectCurrentProfile } from '@kitouch/kit-data';
import { FarewellAnalytics, FarewellMedia } from '@kitouch/shared-models';
import {
  UiKitCompAnimatePingComponent,
  UiKitDeleteComponent,
  UiKitPicUploadableComponent,
  UIKitSmallerHintTextUXDirective,
} from '@kitouch/ui-components';
import { APP_PATH, PhotoService } from '@kitouch/ui-shared';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import PhotoSwipe from 'photoswipe';
import { ButtonModule } from 'primeng/button';
import { FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { filter, map, take, tap } from 'rxjs';
import { registerKitEditorHandlers } from '../editor/bloats';
import { registerKitEditorLeafBloatsHandlers } from '../editor/bloats-leaf';
import { FeatFarewellEditorComponent } from '../editor/editor.component';

// import to register custom bloats

registerKitEditorHandlers();
registerKitEditorLeafBloatsHandlers();

function extractContent(html: string) {
  const span = document.createElement('span');
  span.innerHTML = html;
  return span.textContent || span.innerText;
}

@Component({
  standalone: true,
  selector: 'feat-farewell',
  templateUrl: './farewell.component.html',
  imports: [
    NgOptimizedImage,
    ReactiveFormsModule,
    //
    FeatFarewellEditorComponent,
    UiKitCompAnimatePingComponent,
    UiKitDeleteComponent,
    UiKitPicUploadableComponent,
    UIKitSmallerHintTextUXDirective,
    //
    ToastModule,
    FileUploadModule,
    FloatLabelModule,
    InputTextModule,
    ButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatFarewellComponent implements AfterViewInit {
  farewellId = model<string | null>(null);

  #location = inject(Location);
  #ngZone = inject(NgZone);
  #cdr = inject(ChangeDetectorRef);
  #destroyRef = inject(DestroyRef);
  domSanitizer = inject(DomSanitizer);
  #router = inject(Router);
  #store = inject(Store);
  #photoService = inject(PhotoService);
  #actions$ = inject(Actions);

  farewell = computed(() => {
    const id = this.farewellId();

    return id
      ? this.#store.selectSignal(selectFarewellFullViewById(id))()
      : undefined;
  });
  currentProfile = this.#store.selectSignal(selectCurrentProfile);

  farewellFormGroup = inject(FormBuilder).group({
    title: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(128),
    ]),
    content: new FormControl<string>('', [Validators.required]),
  });
  farewellAnalytics = signal<FarewellAnalytics | null>(null);
  farewellMedias = signal<Array<FarewellMedia> | null>(null);
  editorTextValue = signal<string>('');
  filesToUpload = signal<Array<File>>([]);

  URL = URL;

  constructor() {
    console.log('FAREWELlPAGE COMPONENT');

    effect(
      () => {
        const farewell = this.farewell();

        if (farewell) {
          this.farewellFormGroup.patchValue({
            title: farewell.title,
            content: farewell.content,
          });
          this.editorTextValue.set(extractContent(farewell.content));

          const { media, analytics } = farewell;
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
  }

  ngAfterViewInit(): void {
    if (!this.farewellId()) {
      console.log('FAREWELlPAGE AUTOCREATE');
      this.farewellFormGroup.valueChanges
        .pipe(
          takeUntilDestroyed(this.#destroyRef),
          tap((v) => console.log('FAREWELlPAGE CREATING FAREWELL 0', v)),
          filter(({ content, title }) => !!title || !!content),
          take(1),
          tap((v) => console.log('FAREWELlPAGE CREATING FAREWELL 1', v))
        )
        .subscribe(({ title, content }) =>
          this.#store.dispatch(
            FeatFarewellActions.createFarewell({
              title: title ?? '',
              content: content ?? '',
            })
          )
        );

      this.#actions$
        .pipe(
          ofType(FeatFarewellActions.createFarewellSuccess),
          takeUntilDestroyed(this.#destroyRef),
          take(1),
          map(({ farewell }) => farewell),
          tap((v) => console.log('FAREWELlPAGE UPDATING URL', v))
        )
        .subscribe(({ id }) =>
          this.#location.replaceState(`/${APP_PATH.Farewell}/edit/${id}`)
        );
    }
  }

  deleteFarewellMediaHandler(media: FarewellMedia) {
    this.farewellMedias.update(
      (medias) => medias?.filter(({ id }) => id !== media.id) ?? []
    );

    // S3
    this.#store.dispatch(
      FeatFarewellMediaActions.deleteFarewellStorageMedia({
        url: media.url,
      })
    );
    // DB
    this.#store.dispatch(
      FeatFarewellMediaActions.deleteMediaFarewell({
        id: media.id,
      })
    );

    // TODO add error handling
  }

  deleteNewMediaHandler(media: File) {
    // TODO  verify if this covers all use-cases
    this.filesToUpload.update((files) =>
      files.filter((files) => files.name !== media.name)
    );
  }

  onBasicUploadAuto(event: FileUploadHandlerEvent) {
    const newFiles = event.files;
    this.filesToUpload.update((files) => [...files, ...newFiles]);
  }

  saveFarewellHandler() {
    const { title, content } = this.farewellFormGroup.value;

    const farewell = this.farewell();

    if (farewell) {
      this.#updateFarewell({
        ...farewell,
        title: title ?? '',
        content: content ?? '',
      });
    } else {
      console.error('[saveFarewellHandler] error should not happen');
    }
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

  #farewellMedia(farewellId: string) {
    const mediaFiles = this.filesToUpload(),
      profile = this.currentProfile();

    if (mediaFiles?.length && profile?.id) {
      this.#store.dispatch(
        FeatFarewellMediaActions.uploadFarewellStorageMedia({
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

  initFarewellMediaGallery() {
    this.#ngZone.runOutsideAngular(() => {
      this.#photoService.initializeGallery({
        gallery: '#uploaded-media-gallery',
        children: 'a',
        pswpModule: PhotoSwipe,
      });
    });
  }

  initNewFarewellMediaGallery() {
    this.#ngZone.runOutsideAngular(() => {
      this.#photoService.initializeGallery({
        gallery: '#new-media-gallery',
        children: 'a',
        pswpModule: PhotoSwipe,
      });
    });
  }
}
