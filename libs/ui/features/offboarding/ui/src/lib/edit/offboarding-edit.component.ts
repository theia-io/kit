import { Location, NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  HostListener,
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
import { Router } from '@angular/router';
import {
  FeatKudoBoardCommentsComponent,
  FeatKudoBoardViewComponent,
} from '@kitouch/ui-kudoboard';

import { selectCurrentProfile } from '@kitouch/kit-data';

import {
  DividerComponent,
  UiKitSpinnerComponent,
  UiKitTweetButtonComponent,
} from '@kitouch/ui-components';

import {
  extractContent,
  FeatSideBarPreviewComponent,
  SharedCopyClipboardComponent,
  SharedEditorQuillComponent,
} from '@kitouch/containers';
import { FeatKudoBoardActions } from '@kitouch/data-kudoboard';
import {
  FeatExpOffboardingActions,
  FeatOffboardingMediaActions,
  findExpOffboardingById,
  selectExpOffboardings,
} from '@kitouch/feat-offboarding-data';
import { APP_PATH_ALLOW_ANONYMOUS } from '@kitouch/shared-constants';
import {
  ContractUploadedMedia,
  ExpOffboarding,
  ExpOffboardingStatus,
  KudoBoardStatus,
} from '@kitouch/shared-models';
import { DeviceService, validateEmail } from '@kitouch/shared-services';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import {
  combineLatest,
  debounceTime,
  delay,
  filter,
  map,
  merge,
  Observable,
  of,
  shareReplay,
  skipUntil,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs';
import { FeatOffboardingInfoPanelComponent } from '../info-panel/offboarding-info-panel.component';
import { FeatOffboardingStatusComponent } from '../status/offboarding-status.component';

const TITLE_MAX_LENGTH = 128;

@Component({
  standalone: true,
  selector: 'feat-offboarding-edit',
  templateUrl: './offboarding-edit.component.html',
  imports: [
    //
    ReactiveFormsModule,
    NgTemplateOutlet,
    //
    FloatLabelModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    TooltipModule,
    OverlayPanelModule,
    ToastModule,
    //
    FeatOffboardingStatusComponent,
    FeatSideBarPreviewComponent,
    FeatOffboardingStatusComponent,
    SharedCopyClipboardComponent,
    FeatOffboardingInfoPanelComponent,
    UiKitSpinnerComponent,
    SharedEditorQuillComponent,
    DividerComponent,
    FeatKudoBoardViewComponent,
    FeatKudoBoardCommentsComponent,
    UiKitTweetButtonComponent,
  ],
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatOffboardingEditComponent implements AfterViewInit {
  id = model<ExpOffboarding['id']>();

  doneKudoTmpl = output<TemplateRef<unknown>>();
  statusKudoTmpl = output<TemplateRef<unknown>>();
  previewKudoTmpl = output<TemplateRef<unknown>>();
  asUserKudoTmpl = output<TemplateRef<unknown>>();
  shareKudoTmpl = output<TemplateRef<unknown>>();
  updating = model<boolean>(false);

  #router = inject(Router);
  #location = inject(Location);
  #cdr = inject(ChangeDetectorRef);
  #destroyRef = inject(DestroyRef);
  #store = inject(Store);
  #actions$ = inject(Actions);
  deviceService = inject(DeviceService);
  #messageService = inject(MessageService);

  #beforeUnloadTrigger$$ = new Subject<void>();

  currentProfile = this.#store.selectSignal(selectCurrentProfile);

  offboardingCreated$ = this.#actions$.pipe(
    ofType(FeatExpOffboardingActions.createExpOffboardingSuccess),
    takeUntilDestroyed()
  );

  #offboarding$ = combineLatest([
    toObservable(this.id).pipe(filter(Boolean)),
    this.#store.pipe(select(selectExpOffboardings)),
  ]).pipe(
    map(([id, offboardings]) => findExpOffboardingById(id, offboardings)),
    filter(Boolean),
    takeUntilDestroyed(),
    shareReplay({
      refCount: true,
      bufferSize: 1,
    })
  );
  offboarding = toSignal(this.#offboarding$);

  // TODO add link and email validation
  offboardingFormGroup = inject(FormBuilder).nonNullable.group({
    collaboratorEmails: new FormControl<string>('', { nonNullable: true }),
    receiverEmail: new FormControl<string>('', { nonNullable: true }),
    title: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(TITLE_MAX_LENGTH)],
    }),
    companyReviews: new FormControl<string>('', { nonNullable: true }),
    content: new FormControl<string>('', { nonNullable: true }),
    status: new FormControl<ExpOffboardingStatus>(ExpOffboardingStatus.Draft, {
      nonNullable: true,
    }),
  });

  validateEmail = validateEmail;
  readonly titleMaxLength = TITLE_MAX_LENGTH;
  readonly CONTENT_MAX_LENGTH = 8_092;
  readonly offboardingStatus = ExpOffboardingStatus;
  previewVisible = signal(false);
  editorTextValue = signal<string>('');
  disableEditorAutoFocus = signal(false);

  @ViewChild('doneTmpl', { read: TemplateRef })
  doneTmpl?: TemplateRef<unknown>;
  @ViewChild('statusTmpl', { read: TemplateRef })
  statusTmpl?: TemplateRef<unknown>;
  @ViewChild('previewTmpl', { read: TemplateRef })
  previewTmpl?: TemplateRef<unknown>;
  @ViewChild('asUserTmpl', { read: TemplateRef })
  asUserTmpl?: TemplateRef<unknown>;
  @ViewChild('shareTmpl', { read: TemplateRef })
  shareTmpl?: TemplateRef<unknown>;

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler() {
    this.#beforeUnloadTrigger$$.next();
  }

  ngAfterViewInit(): void {
    // non essential task to provide parent status update functionality
    setTimeout(() => {
      if (this.doneTmpl) {
        this.doneKudoTmpl.emit(this.doneTmpl);
      }

      if (this.statusTmpl) {
        this.statusKudoTmpl.emit(this.statusTmpl);
      }
      if (this.previewTmpl) {
        this.previewKudoTmpl.emit(this.previewTmpl);
      }
      if (this.asUserTmpl) {
        this.asUserKudoTmpl.emit(this.asUserTmpl);
      }
      if (this.shareTmpl) {
        this.shareKudoTmpl.emit(this.shareTmpl);
      }
    }, 0);

    const offboardingId = this.id();
    if (!offboardingId) {
      this.#autoCreateOffboarding();
    } else {
      this.#offboarding$.pipe(take(1)).subscribe((offboarding) => {
        this.offboardingFormGroup.patchValue(
          {
            collaboratorEmails: offboarding.collaboratorEmails.join(', '),
            receiverEmail: offboarding.receiverEmail,
            companyReviews: offboarding.companyReviews.join(', '),
            title: offboarding.title,
            content: offboarding.content,
            status: offboarding.status,
          },
          { emitEvent: false }
        );

        this.editorTextValue.set(extractContent(offboarding.content));
        this.#cdr.detectChanges();
      });
    }

    this.offboardingFormGroup.valueChanges
      .pipe(
        takeUntilDestroyed(this.#destroyRef),
        delay(0) // to skip the prefill from initial (existing) value
      )
      .subscribe(() => {
        this.disableEditorAutoFocus.set(true);
      });

    merge(
      this.offboardingFormGroup.valueChanges.pipe(
        takeUntilDestroyed(this.#destroyRef),
        debounceTime(1500)
      ),
      this.#beforeUnloadTrigger$$.asObservable().pipe(
        takeUntilDestroyed(this.#destroyRef),
        map(() => this.offboardingFormGroup.value)
      )
    )
      .pipe(
        // when its new offboarding we don't update until offboarding is created
        skipUntil(this.id() ? of(true) : this.#offboarding$),
        withLatestFrom(this.#offboarding$)
      )
      .subscribe(
        ([
          {
            title,
            content,
            status,
            receiverEmail,
            collaboratorEmails,
            companyReviews,
          },
          offboarding,
        ]) => {
          this.#updateOffboarding({
            ...offboarding,
            title: title ?? '',
            content: content ?? '',
            receiverEmail: receiverEmail ?? '',
            companyReviews: [companyReviews ?? ''],
            collaboratorEmails: collaboratorEmails
              ? collaboratorEmails.split(',').map((email) => email.trim())
              : [],
            status: status ?? ExpOffboardingStatus.Draft,
          });
        }
      );

    this.#actions$
      .pipe(
        ofType(FeatExpOffboardingActions.putExpOffboardingSuccess),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe(() => this.updating.set(false));
  }

  createKudoBoard() {
    const offboardingId = this.id();
    if (!offboardingId) {
      console.error('No offboarding ID found, cannot create Kudo Board');

      return;
    }
    this.#actions$
      .pipe(
        ofType(FeatKudoBoardActions.createKudoBoardSuccess),
        take(1),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe(({ kudoboard }) => {
        console.log(kudoboard);
        this.#store.dispatch(
          FeatExpOffboardingActions.putExpOffboarding({
            offboarding: {
              ...this.offboarding(),
              id: offboardingId,
              kudoboardIds: [kudoboard.id],
            } as any,
          })
        );
      });

    this.#store.dispatch(
      FeatKudoBoardActions.createKudoBoard({
        kudoboard: {
          profileId: this.currentProfile()?.id ?? '',
          title: '',
          status: KudoBoardStatus.Published,
        },
      })
    );
  }

  updateStatus(status: ExpOffboardingStatus) {
    this.offboardingFormGroup.patchValue({
      status,
    });
  }

  gotoOffboarding(id: ExpOffboarding['id'], preview: boolean, event: Event) {
    event.stopPropagation();
    event.preventDefault();

    this.#router.navigateByUrl(
      `/${APP_PATH_ALLOW_ANONYMOUS.Offboarding}/${id}${
        preview ? '?preview=true' : ''
      }`
    );
  }

  gotoAll(event: Event) {
    const offboardingId = this.id();
    if (!this.currentProfile() && offboardingId) {
      this.gotoOffboarding(offboardingId, false, event);
      return;
    }

    event.stopPropagation();
    event.preventDefault();

    this.#router.navigateByUrl(`/app/${APP_PATH_ALLOW_ANONYMOUS.Offboarding}`);
  }

  #autoCreateOffboarding() {
    const autoCreate$ = this.offboardingFormGroup.valueChanges.pipe(
      takeUntilDestroyed(this.#destroyRef),
      takeUntil(this.offboardingCreated$),
      take(1),
      debounceTime(1500),
      filter(
        ({ collaboratorEmails, receiverEmail, title, content, status }) =>
          !!title ||
          !!content ||
          !!collaboratorEmails ||
          !!receiverEmail ||
          !!status
      ),
      shareReplay({
        refCount: true,
        bufferSize: 1,
      })
    );

    autoCreate$.subscribe(
      ({ content, title, collaboratorEmails, receiverEmail, status }) =>
        this.#store.dispatch(
          FeatExpOffboardingActions.createExpOffboarding({
            offboarding: {
              title: title ?? '',
              content: content ?? '',
              collaboratorEmails: collaboratorEmails
                ? collaboratorEmails.split(',').map((email) => email.trim())
                : [],
              companyReviews: [],
              receiverEmail: receiverEmail ?? '',
              status: status ?? ExpOffboardingStatus.Draft,
            },
          })
        )
    );

    autoCreate$
      .pipe(
        switchMap(() => this.#actions$),
        ofType(FeatExpOffboardingActions.createExpOffboardingSuccess),
        take(1),
        map(({ offboarding }) => offboarding)
      )
      .subscribe(({ id }) => this.#updateJustCreatedOffboardingUrl(id));
  }

  #updateOffboarding(offboarding: ExpOffboarding) {
    this.updating.set(true);
    this.#store.dispatch(
      FeatExpOffboardingActions.putExpOffboarding({
        offboarding,
      })
    );
  }

  #updateJustCreatedOffboardingUrl(id: ExpOffboarding['id']) {
    this.id.set(id);
    this.#location.replaceState(
      `/${APP_PATH_ALLOW_ANONYMOUS.Offboarding}/${id}/edit`
    );
  }

  saveImages(): (
    images: Array<File>
  ) => Observable<Array<ContractUploadedMedia> | null> {
    const getOffboardingId = () => this.offboarding()?.id;
    const getProfileId = () => this.currentProfile()?.id;

    return (images: Array<File>) => {
      const profileId = getProfileId(),
        offboardingId = getOffboardingId();

      const mediaFiles = images;

      if (!profileId || !offboardingId) {
        console.error(
          '[saveImages] cannot upload images by unknown profile and offboarding',
          profileId,
          offboardingId
        );
        return of([]);
      }

      this.#messageService.add({
        severity: 'info',
        summary: 'Adding image',
        detail: 'Uploading your image to offboarding',
        life: 3000,
      });

      setTimeout(() => {
        const now = new Date();
        this.#store.dispatch(
          FeatOffboardingMediaActions.uploadOffboardingStorageMedia({
            offboardingId,
            profileId,
            items: mediaFiles.map((mediaFile) => ({
              key: `${offboardingId}/${profileId}/${now.getTime()}-${
                mediaFile.name
              }`,
              blob: mediaFile,
            })),
          })
        );
      });

      return merge(
        this.#actions$.pipe(
          ofType(
            FeatOffboardingMediaActions.uploadOffboardingStorageMediaSuccess
          ),
          tap(() => {
            this.#messageService.add({
              severity: 'success',
              summary: 'Image added',
              detail: 'Farewell image has been added',
              life: 3000,
            });
          }),
          map(({ items }) => items)
        ),
        this.#actions$.pipe(
          ofType(
            FeatOffboardingMediaActions.uploadOffboardingStorageMediaFailure
          ),
          tap(({ message }) => {
            this.#messageService.add({
              severity: 'warn',
              summary: 'Image was not added',
              detail: message,
              life: 3000,
            });
          }),
          map(() => null)
        )
      ).pipe(take(1));
    };
  }

  deleteImage() {
    // S3
    return (url: string) => {
      this.#store.dispatch(
        FeatOffboardingMediaActions.deleteOffboardingStorageMedia({
          url,
        })
      );
    };
  }
}
