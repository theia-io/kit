import { Location } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  inject,
  model,
  NgZone,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  FeatFarewellActions,
  FeatFarewellMediaActions,
  selectFarewellFullViewById,
} from '@kitouch/feat-farewell-data';
import { getFullS3Url } from '@kitouch/feat-farewell-effects';
import { selectCurrentProfile } from '@kitouch/kit-data';
import {
  Farewell,
  FarewellAnalytics,
  FarewellStatus,
} from '@kitouch/shared-models';
import { UIKitSmallerHintTextUXDirective } from '@kitouch/ui-components';
import {
  APP_PATH,
  PhotoService,
  S3_FAREWELL_BUCKET_BASE_URL,
} from '@kitouch/ui-shared';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import PhotoSwipe from 'photoswipe';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import {
  debounceTime,
  delay,
  filter,
  map,
  Observable,
  of,
  shareReplay,
  skipUntil,
  switchMap,
  take,
} from 'rxjs';
import { registerKitEditorHandlers } from '../editor/bloats';
import { registerKitEditorLeafBloatsHandlers } from '../editor/bloats-leaf';
import { FeatFarewellEditorComponent } from '../editor/editor.component';
import Quill from 'quill';

// import to register custom bloats

Quill.debug(false);
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
    ReactiveFormsModule,
    //
    FeatFarewellEditorComponent,
    UIKitSmallerHintTextUXDirective,
    //
    FloatLabelModule,
    InputTextModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatFarewellComponent implements AfterViewInit {
  farewellId = model<string | null>(null);

  #location = inject(Location);
  #ngZone = inject(NgZone);
  #cdr = inject(ChangeDetectorRef);
  #destroyRef = inject(DestroyRef);
  #store = inject(Store);
  #photoService = inject(PhotoService);
  #actions$ = inject(Actions);
  #s3FarewellBaseUrl = inject(S3_FAREWELL_BUCKET_BASE_URL);

  farewell = computed(() => {
    const id = this.farewellId();

    return id
      ? this.#store.selectSignal(selectFarewellFullViewById(id))()
      : undefined;
  });
  #farewell = toObservable(this.farewell);
  currentProfile = this.#store.selectSignal(selectCurrentProfile);

  readonly TITLE_MAX_LENGTH = 128;
  readonly CONTENT_MAX_LENGTH = 8_092;
  farewellFormGroup = inject(FormBuilder).group({
    title: new FormControl<string>('', [
      Validators.required,
      Validators.maxLength(this.TITLE_MAX_LENGTH),
    ]),
    content: new FormControl<string>('', [
      Validators.required,
      Validators.maxLength(this.CONTENT_MAX_LENGTH),
    ]),
  });
  farewellAnalytics = signal<FarewellAnalytics | null>(null);
  editorTextValue = signal<string>('');

  ngAfterViewInit(): void {
    if (!this.farewellId()) {
      this.#autoCreateFarewell();
    } else {
      const farewell = this.farewell();

      if (farewell) {
        this.farewellFormGroup.patchValue({
          title: farewell.title,
          content: farewell.content,
        });
        this.editorTextValue.set(extractContent(farewell.content));

        const { analytics } = farewell;
        if (analytics) {
          this.farewellAnalytics.set(analytics);
        }

        this.#cdr.detectChanges();
      }
    }

    this.farewellFormGroup.valueChanges
      .pipe(
        takeUntilDestroyed(this.#destroyRef),
        // when its new farewell we don't update until farewell is created
        skipUntil(
          this.farewellId() ? of(true) : this.#farewell.pipe(filter(Boolean))
        ),
        debounceTime(5000)
      )
      .subscribe(() => this.#updateFarewell());
  }

  saveImages(): (images: Array<File>) => Observable<Array<string>> {
    const getFarewellId = () => this.farewell()?.id;
    const getProfileId = () => this.currentProfile()?.id;

    return (images: Array<File>) => {
      const profileId = getProfileId(),
        farewellId = getFarewellId();

      const mediaFiles = images;

      if (!profileId || !farewellId) {
        console.error(
          '[saveImages] cannot upload images by unknown profile and farewell',
          profileId,
          farewellId
        );
        return of([]);
      }

      setTimeout(() => {
        const now = new Date();
        this.#store.dispatch(
          FeatFarewellMediaActions.uploadFarewellStorageMedia({
            farewellId,
            profileId,
            items: mediaFiles.map((mediaFile) => ({
              key: `${farewellId}/${profileId}/${now.getTime()}-${
                mediaFile.name
              }`,
              blob: mediaFile,
            })),
          })
        );
      });

      // TODO add error handling
      return this.#actions$.pipe(
        ofType(FeatFarewellMediaActions.uploadFarewellStorageMediaSuccess),
        take(1),
        // AWS S3 bucket has eventual consistency so need a time for it to be available
        delay(1500),
        map(({ items }) =>
          items.map(({ key }) => getFullS3Url(this.#s3FarewellBaseUrl, key))
        )
      );
    };
  }

  deleteImage() {
    // S3
    return (url: string) => {
      this.#store.dispatch(
        FeatFarewellMediaActions.deleteFarewellStorageMedia({
          url,
        })
      );
      // TODO add error handling
    };
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

  updateFarewellStatus(status: FarewellStatus) {
    const farewell = this.farewell();
    this.#store.dispatch(
      FeatFarewellActions.putFarewell({
        farewell: {
          ...farewell,
          status,
        } as Farewell,
      })
    );
  }

  #autoCreateFarewell() {
    const autoCreate$ = this.farewellFormGroup.valueChanges.pipe(
      takeUntilDestroyed(this.#destroyRef),
      debounceTime(2500),
      filter(({ content, title }) => !!title || !!content),
      take(1),
      shareReplay({
        refCount: true,
        bufferSize: 1,
      })
    );

    autoCreate$.subscribe(({ title, content }) =>
      this.#store.dispatch(
        FeatFarewellActions.createFarewell({
          title: title ?? '',
          content: content ?? '',
        })
      )
    );

    autoCreate$
      .pipe(
        switchMap(() => this.#actions$),
        ofType(FeatFarewellActions.createFarewellSuccess),
        takeUntilDestroyed(this.#destroyRef),
        take(1),
        map(({ farewell }) => farewell)
      )
      .subscribe(({ id }) => {
        this.farewellId.set(id);
        this.#location.replaceState(`/${APP_PATH.Farewell}/edit/${id}`);
        return;
      });
  }

  // TODO update also on page reload, close etc
  #updateFarewell() {
    const { title, content } = this.farewellFormGroup.value;

    const farewell = this.farewell();
    this.#store.dispatch(
      FeatFarewellActions.putFarewell({
        farewell: {
          ...farewell,
          title: title ?? '',
          content: content ?? '',
        } as Farewell,
      })
    );
  }
}
