import {
  AsyncPipe,
  DOCUMENT,
  Location,
  NgClass,
  NgTemplateOutlet,
} from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  HostListener,
  inject,
  model,
  OnDestroy,
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
  FeatKudoBoardActions,
  FeatKudoBoardMediaActions,
  findKudoBoardById,
  selectKudoBoardById,
  selectKudoBoards,
} from '@kitouch/data-kudoboard';
import { selectCurrentProfile } from '@kitouch/kit-data';
import { KudoBoard, KudoBoardStatus } from '@kitouch/shared-models';
import {
  UiKitColorDisplayerComponent,
  UiKitColorPickerComponent,
  UiKitPicUploadableComponent,
  UiKitPicUploadableDirective,
} from '@kitouch/ui-components';

import {
  FeatSideBarPreviewComponent,
  kudoboardLink,
  SharedCopyClipboardComponent,
  SharedKitUserHintDirective,
} from '@kitouch/containers';
import { APP_PATH_ALLOW_ANONYMOUS } from '@kitouch/shared-constants';
import { DeviceService } from '@kitouch/shared-infra';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { FileUploadHandlerEvent } from 'primeng/fileupload';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TooltipModule } from 'primeng/tooltip';
import {
  combineLatest,
  debounceTime,
  delay,
  filter,
  map,
  merge,
  of,
  shareReplay,
  skipUntil,
  Subject,
  switchMap,
  take,
  takeUntil,
  withLatestFrom,
} from 'rxjs';
import { isHexColor, isValidBucketUrl } from '../common';
import { FeatKudoBoardStatusComponent } from '../status/status.component';
import { FeatKudoBoardViewComponent } from '../view/view.component';
import { FeatKudoboardInfoPanelComponent } from '../info-panel/info-panel.component';

const TITLE_MAX_LENGTH = 128;

@Component({
  standalone: true,
  selector: 'feat-kudoboard-edit',
  templateUrl: './edit.component.html',
  imports: [
    //
    AsyncPipe,
    ReactiveFormsModule,
    NgTemplateOutlet,
    NgClass,
    //
    FloatLabelModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    TooltipModule,
    OverlayPanelModule,
    //
    UiKitPicUploadableComponent,
    UiKitPicUploadableDirective,
    UiKitColorPickerComponent,
    UiKitColorDisplayerComponent,
    SharedKitUserHintDirective,
    FeatKudoBoardStatusComponent,
    FeatSideBarPreviewComponent,
    FeatKudoBoardViewComponent,
    SharedCopyClipboardComponent,
    FeatKudoboardInfoPanelComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatKudoBoardEditComponent implements AfterViewInit, OnDestroy {
  id = model<KudoBoard['id']>();

  statusKudoTmpl = output<TemplateRef<unknown>>();
  previewKudoTmpl = output<TemplateRef<unknown>>();
  asUserKudoTmpl = output<TemplateRef<unknown>>();
  shareKudoTmpl = output<TemplateRef<unknown>>();

  #document = inject(DOCUMENT);
  #router = inject(Router);
  #location = inject(Location);
  #cdr = inject(ChangeDetectorRef);
  #destroyRef = inject(DestroyRef);
  #store = inject(Store);
  #actions$ = inject(Actions);
  deviceService = inject(DeviceService);

  #beforeUnloadTrigger$$ = new Subject<void>();

  currentProfile = this.#store.selectSignal(selectCurrentProfile);

  kudoBoardCreated$ = this.#actions$.pipe(
    ofType(FeatKudoBoardActions.createKudoBoardSuccess),
    takeUntilDestroyed()
  );

  #kudoBoard$ = combineLatest([
    toObservable(this.id).pipe(filter(Boolean)),
    this.#store.pipe(select(selectKudoBoards)),
  ]).pipe(
    map(([id, kudoBoards]) => findKudoBoardById(id, kudoBoards)),
    filter(Boolean),
    takeUntilDestroyed(),
    shareReplay({
      refCount: true,
      bufferSize: 1,
    })
  );
  kudoBoard = toSignal(this.#kudoBoard$);

  kudoBoardFormGroup = inject(FormBuilder).nonNullable.group({
    title: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(TITLE_MAX_LENGTH)],
    }),
    background: new FormControl<string>('', {
      nonNullable: true,
    }),
    recipient: new FormControl<string>('', { nonNullable: true }),
    content: new FormControl<string>('', { nonNullable: true }),
    status: new FormControl<KudoBoardStatus>(KudoBoardStatus.Draft, {
      nonNullable: true,
    }),
  });

  isBucketUrl = isValidBucketUrl();
  isHexColor = isHexColor;
  kudoboardLinkFn = (kudoboardId: string) =>
    kudoboardLink(this.#document.location.origin, kudoboardId, false);
  readonly titleMaxLength = TITLE_MAX_LENGTH;
  readonly kudoBoardStatus = KudoBoardStatus;
  previewVisible = signal(false);

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

    const kudoBoardId = this.id();
    if (!kudoBoardId) {
      this.#autoCreateKudoBoard();
    } else {
      this.#kudoBoard$.pipe(take(1)).subscribe((kudoBoard) => {
        this.kudoBoardFormGroup.patchValue({
          title: kudoBoard.title,
          background: kudoBoard.background,
          recipient: kudoBoard.recipient,
          content: kudoBoard.content,
          status: kudoBoard.status,
        });
        this.#cdr.detectChanges();
      });
    }

    merge(
      this.kudoBoardFormGroup.valueChanges.pipe(debounceTime(5000)),
      this.#beforeUnloadTrigger$$
        .asObservable()
        .pipe(map(() => this.kudoBoardFormGroup.value))
    )
      .pipe(
        takeUntilDestroyed(this.#destroyRef),
        // when its new farewell we don't update until farewell is created
        skipUntil(this.id() ? of(true) : this.#kudoBoard$),
        withLatestFrom(this.#kudoBoard$)
      )
      .subscribe(
        ([{ title, recipient, background, content, status }, kudoBoard]) =>
          this.#updateKudoBoard({
            ...kudoBoard,
            title: title ?? '',
            recipient,
            content,
            background,
            status: status ?? KudoBoardStatus.Draft,
          })
      );
  }

  ngOnDestroy(): void {
    this.#beforeUnloadTrigger$$.next();
  }

  autoUploadBackground(event: FileUploadHandlerEvent) {
    const images = event.files;

    this.#actions$
      .pipe(
        ofType(FeatKudoBoardMediaActions.uploadKudoBoardStorageMediaSuccess),
        take(1),
        switchMap(({ kudoboardId, items }) =>
          this.#store.pipe(
            select(selectKudoBoardById(kudoboardId)),
            take(1),
            filter(Boolean),
            // AWS S3 bucket has eventual consistency so need a time for it to be available
            delay(2500),
            map((kudoBoard): [string, KudoBoard] => [items[0], kudoBoard])
          )
        )
      )
      .subscribe(([background, kudoboard]) =>
        this.#updateKudoBoardBackground(background, kudoboard.background)
      );

    const kudoBoardId = this.id();
    if (kudoBoardId) {
      this.#uploadBackgroundMedia(
        kudoBoardId,
        images,
        this.currentProfile()?.id
      );
    } else {
      this.kudoBoardCreated$
        .pipe(take(1))
        .subscribe(({ kudoboard: { id } }) => {
          this.#updateJustCreatedKudoBoardUrl(id);
          this.#uploadBackgroundMedia(id, images, this.currentProfile()?.id);
        });

      this.#store.dispatch(
        FeatKudoBoardActions.createKudoBoard({
          kudoboard: {
            title: '',
            background: '',
            recipient: '',
            status: KudoBoardStatus.Draft,
          },
        })
      );
    }
  }

  updateBackgroundColor(colorHex: string) {
    const kudoBoardId = this.id();
    if (kudoBoardId) {
      this.#store
        .pipe(
          select(selectKudoBoardById(kudoBoardId)),
          take(1),
          takeUntilDestroyed(this.#destroyRef)
        )
        .subscribe((kudoBoard) =>
          this.#updateKudoBoardBackground(colorHex, kudoBoard?.background)
        );
    } else {
      this.kudoBoardCreated$.pipe(take(1)).subscribe(({ kudoboard }) => {
        this.#updateJustCreatedKudoBoardUrl(kudoboard.id);
        this.#updateKudoBoardBackground(colorHex, kudoboard.background);
      });

      this.#store.dispatch(
        FeatKudoBoardActions.createKudoBoard({
          kudoboard: {
            title: '',
            background: '',
            recipient: '',
            status: KudoBoardStatus.Draft,
          },
        })
      );
    }
  }

  updateStatus(status: KudoBoardStatus) {
    this.kudoBoardFormGroup.patchValue({
      status,
    });
  }

  gotoBoard(kudoboardId: KudoBoard['id'], preview: boolean, event: Event) {
    event.stopPropagation();
    event.preventDefault();

    this.#router.navigateByUrl(
      `/s/${APP_PATH_ALLOW_ANONYMOUS.KudoBoard}/${kudoboardId}${
        preview ? '?preview=true' : ''
      }`
    );
  }

  gotoAll(event: Event) {
    event.stopPropagation();
    event.preventDefault();

    this.#router.navigateByUrl(`/${APP_PATH_ALLOW_ANONYMOUS.KudoBoard}`);
  }

  #autoCreateKudoBoard() {
    const autoCreate$ = this.kudoBoardFormGroup.valueChanges.pipe(
      takeUntilDestroyed(this.#destroyRef),
      takeUntil(this.kudoBoardCreated$),
      take(1),
      debounceTime(2500),
      filter(
        ({ recipient, background, title, status }) =>
          !!title || !!background || !!recipient || !!status
      ),
      shareReplay({
        refCount: true,
        bufferSize: 1,
      })
    );

    autoCreate$.subscribe(({ recipient, background, title, status }) =>
      this.#store.dispatch(
        FeatKudoBoardActions.createKudoBoard({
          kudoboard: {
            title: title ?? '',
            background,
            recipient,
            status: status ?? KudoBoardStatus.Draft,
          },
        })
      )
    );

    autoCreate$
      .pipe(
        switchMap(() => this.#actions$),
        ofType(FeatKudoBoardActions.createKudoBoardSuccess),
        take(1),
        map(({ kudoboard }) => kudoboard)
      )
      .subscribe(({ id }) => this.#updateJustCreatedKudoBoardUrl(id));
  }

  #updateKudoBoard(kudoboard: KudoBoard) {
    console.log('UPDARING KUDO, VALUE', kudoboard);
    this.#store.dispatch(
      FeatKudoBoardActions.putKudoBoard({
        kudoboard,
      })
    );
  }

  #updateKudoBoardBackground(background: string, previousBackground?: string) {
    this.kudoBoardFormGroup.patchValue({
      background,
    });
    // to update view
    this.#cdr.detectChanges();

    // assuming actions above are success (TODO handle error case; TODO check that this is our bucket)
    if (previousBackground && this.isBucketUrl(previousBackground)) {
      this.#store.dispatch(
        FeatKudoBoardMediaActions.deleteKudoBoardStorageMedia({
          url: previousBackground,
        })
      );
    }
  }

  #uploadBackgroundMedia(
    kudoboardId: KudoBoard['id'],
    images: Array<File>,
    profileId?: string
  ) {
    const now = new Date();

    this.#store.dispatch(
      FeatKudoBoardMediaActions.uploadKudoBoardStorageMedia({
        kudoboardId,
        profileId: profileId ?? 'anonymous',
        items: images.map((mediaFile) => ({
          key: `${kudoboardId}/${profileId}/${now.getTime()}-${mediaFile.name}`,
          blob: mediaFile,
        })),
      })
    );
  }

  #updateJustCreatedKudoBoardUrl(id: KudoBoard['id']) {
    this.id.set(id);
    this.#location.replaceState(
      `/s/${APP_PATH_ALLOW_ANONYMOUS.KudoBoard}/${id}/edit`
    );
  }
}
