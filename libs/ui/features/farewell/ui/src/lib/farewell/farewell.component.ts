import {
  AsyncPipe,
  DOCUMENT,
  Location,
  NgTemplateOutlet,
} from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  inject,
  model,
  output,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  FeatFarewellActions,
  FeatFarewellMediaActions,
  selectFarewellFullViewById,
} from '@kitouch/feat-farewell-data';
import { getFullS3Url } from '@kitouch/feat-farewell-effects';
import { profilePicture, selectCurrentProfile } from '@kitouch/kit-data';
import {
  Farewell,
  FarewellAnalytics,
  FarewellStatus,
} from '@kitouch/shared-models';
import {
  UIKitSmallerHintTextUXDirective,
  UiKitSpinnerComponent,
} from '@kitouch/ui-components';

import {
  farewellLink,
  FeatSideBarPreviewComponent,
  SharedCopyClipboardComponent,
} from '@kitouch/containers';
import { APP_PATH } from '@kitouch/shared-constants';
import { S3_FAREWELL_BUCKET_BASE_URL } from '@kitouch/shared-infra';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TooltipModule } from 'primeng/tooltip';
import Quill from 'quill';
import {
  debounceTime,
  filter,
  map,
  Observable,
  of,
  skipUntil,
  take,
} from 'rxjs';
import { registerKitEditorHandlers } from '../editor/bloats';
import { registerKitEditorLeafBloatsHandlers } from '../editor/bloats-leaf';
import { FeatFarewellEditorComponent } from '../editor/editor.component';
import { FeatFarewellInfoPanelComponent } from '../info-panel/info-panel.component';
import { FeatFarewellStatusComponent } from '../status/status.component';
import { FeatFarewellViewV2Component } from '../viewV2/viewV2.component';

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
    AsyncPipe,
    RouterModule,
    ReactiveFormsModule,
    NgTemplateOutlet,
    //
    FloatLabelModule,
    InputTextModule,
    ButtonModule,
    TooltipModule,
    OverlayPanelModule,
    //
    FeatFarewellEditorComponent,
    UIKitSmallerHintTextUXDirective,
    SharedCopyClipboardComponent,
    FeatSideBarPreviewComponent,
    FeatFarewellStatusComponent,
    FeatFarewellViewV2Component,
    FeatFarewellInfoPanelComponent,
    UiKitSpinnerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatFarewellComponent implements AfterViewInit {
  farewellId = model<string | null>(null);

  statusFarewellTmpl = output<TemplateRef<unknown>>();
  shareFarewellTmpl = output<TemplateRef<unknown>>();
  previewFarewellTmpl = output<TemplateRef<unknown>>();
  updating = model<boolean>(false);

  #document = inject(DOCUMENT);
  #cdr = inject(ChangeDetectorRef);
  #destroyRef = inject(DestroyRef);
  #router = inject(Router);
  #store = inject(Store);
  #actions$ = inject(Actions);
  #location = inject(Location);
  #s3FarewellBaseUrl = inject(S3_FAREWELL_BUCKET_BASE_URL);

  farewell = computed(() => {
    const id = this.farewellId();

    return id
      ? this.#store.selectSignal(selectFarewellFullViewById(id))()
      : undefined;
  });
  #farewell$ = toObservable(this.farewell);
  #currentProfile$ = this.#store.pipe(select(selectCurrentProfile));
  currentProfile = toSignal(this.#currentProfile$);

  linkedKudoBoard$ = this.#farewell$.pipe(
    map((farewell) => farewell?.kudoBoard),
    filter(Boolean)
  );

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
    status: new FormControl<FarewellStatus>(FarewellStatus.Draft, {
      nonNullable: true,
    }),
  });
  farewellAnalytics = signal<FarewellAnalytics | null>(null);
  editorTextValue = signal<string>('');
  previewVisible = signal(false);

  readonly farewellStatus = FarewellStatus;
  readonly profileUrl = `/${APP_PATH.Profile}/`;
  profilePictureFn = profilePicture;
  // TODO Check if I can pass farewellId and get rid of HOF here (if parameter is evaluated lazily)
  farewellLinkFn = (farewellId: string) =>
    farewellLink(this.#document.location.origin, farewellId);

  @ViewChild('statusTmpl', { read: TemplateRef })
  statusTmpl?: TemplateRef<any>;
  @ViewChild('shareTmpl', { read: TemplateRef })
  shareTmpl?: TemplateRef<any>;
  @ViewChild('previewTmpl', { read: TemplateRef })
  previewTmpl?: TemplateRef<any>;

  ngAfterViewInit(): void {
    // non essential task to provide parent status update functionality
    setTimeout(() => {
      if (this.statusTmpl) {
        this.statusFarewellTmpl.emit(this.statusTmpl);
      }
      if (this.shareTmpl) {
        this.shareFarewellTmpl.emit(this.shareTmpl);
      }
      if (this.previewTmpl) {
        this.previewFarewellTmpl.emit(this.previewTmpl);
      }
    }, 0);

    if (!this.farewellId()) {
      this.#autoCreateFarewell();
    } else {
      const farewell = this.farewell();

      if (farewell) {
        this.farewellFormGroup.patchValue({
          title: farewell.title,
          content: farewell.content,
          status: farewell.status,
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
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => this.updating.set(true));

    this.farewellFormGroup.valueChanges
      .pipe(
        takeUntilDestroyed(this.#destroyRef),
        // when its new farewell we don't update until farewell is created
        skipUntil(
          this.farewellId() ? of(true) : this.#farewell$.pipe(filter(Boolean))
        ),
        debounceTime(1500)
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

      return this.#actions$.pipe(
        ofType(FeatFarewellMediaActions.uploadFarewellStorageMediaSuccess),
        take(1),
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
    };
  }

  updateStatus(status: FarewellStatus) {
    this.farewellFormGroup.patchValue({
      status,
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

  gotoAll(event: Event) {
    event.preventDefault();

    this.#router.navigateByUrl(`/${APP_PATH.Farewell}`);
  }

  #autoCreateFarewell() {
    this.#currentProfile$
      .pipe(filter(Boolean), take(1))
      .subscribe((profile) => {
        const { title, content, status } = this.farewellFormGroup.value;
        this.#store.dispatch(
          FeatFarewellActions.createFarewell({
            farewell: {
              title: title ?? '',
              content: content ?? '',
              profileId: profile.id,
              profile: profile,
              status: status ?? FarewellStatus.Draft,
            },
          })
        );
      });

    this.#actions$
      .pipe(
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
    const { title, content, status } = this.farewellFormGroup.value;

    const farewell = this.farewell();

    this.updating.set(false);

    this.#store.dispatch(
      FeatFarewellActions.putFarewell({
        farewell: {
          ...farewell,
          title: title ?? '',
          content: content ?? '',
          status: status ?? FarewellStatus.Draft,
        } as Farewell,
      })
    );
  }
}
