import {
  AsyncPipe,
  Location,
  NgClass,
  NgOptimizedImage,
  NgTemplateOutlet,
} from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  input,
  model,
  output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
  UIKitSmallerHintTextUXDirective,
} from '@kitouch/ui-components';
import {
  APP_PATH_ALLOW_ANONYMOUS,
  DeviceService,
  SharedKitUserHintDirective,
} from '@kitouch/ui-shared';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { FileUploadHandlerEvent } from 'primeng/fileupload';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import {
  combineLatest,
  debounceTime,
  delay,
  filter,
  map,
  of,
  shareReplay,
  skipUntil,
  switchMap,
  take,
  takeUntil,
  withLatestFrom,
} from 'rxjs';
import { isHexColor, isValidBucketUrl } from '../common';
import { TooltipModule } from 'primeng/tooltip';
import { Router } from '@angular/router';

const TITLE_MAX_LENGTH = 128;

@Component({
  standalone: true,
  selector: 'feat-kudoboard-edit',
  templateUrl: './edit.component.html',
  imports: [
    //
    AsyncPipe,
    ReactiveFormsModule,
    NgOptimizedImage,
    NgTemplateOutlet,
    NgClass,
    //
    FloatLabelModule,
    InputTextModule,
    ButtonModule,
    TooltipModule,
    //
    UIKitSmallerHintTextUXDirective,
    UiKitPicUploadableComponent,
    UiKitPicUploadableDirective,
    UiKitColorPickerComponent,
    UiKitColorDisplayerComponent,
    SharedKitUserHintDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatKudoBoardEditComponent implements AfterViewInit {
  id = model<KudoBoard['id']>();

  statusUpdateTmpl = output<TemplateRef<any>>();

  #router = inject(Router);
  #location = inject(Location);
  #cdr = inject(ChangeDetectorRef);
  #destroyRef = inject(DestroyRef);
  #store = inject(Store);
  #actions$ = inject(Actions);
  deviceService = inject(DeviceService);

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
    takeUntilDestroyed()
  );

  kudoBoardFormGroup = inject(FormBuilder).nonNullable.group({
    title: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(TITLE_MAX_LENGTH)],
    }),
    background: new FormControl<string>('', {
      nonNullable: true,
    }),
    recipient: new FormControl<string>('', { nonNullable: true }),
    status: new FormControl<KudoBoardStatus>(KudoBoardStatus.Draft, {
      nonNullable: true,
    }),
  });

  isBucketUrl = isValidBucketUrl();
  isHexColor = isHexColor;
  readonly titleMaxLength = TITLE_MAX_LENGTH;
  readonly kudoBoardStatus = KudoBoardStatus;

  @ViewChild('statusTmpl', { read: TemplateRef })
  statusTmpl?: TemplateRef<any>;

  ngAfterViewInit(): void {
    // non essential task to provide parent status update functionality
    setTimeout(() => {
      if (this.statusTmpl) {
        this.statusUpdateTmpl.emit(this.statusTmpl);
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
          status: kudoBoard.status,
        });
        this.#cdr.detectChanges();
      });
    }

    this.kudoBoardFormGroup.valueChanges
      .pipe(
        takeUntilDestroyed(this.#destroyRef),
        // when its new farewell we don't update until farewell is created
        skipUntil(this.id() ? of(true) : this.#kudoBoard$),
        debounceTime(5000),
        withLatestFrom(this.#kudoBoard$)
      )
      .subscribe(([{ title, recipient, background, status }, kudoBoard]) =>
        this.#updateKudoBoard({
          ...kudoBoard,
          title: title ?? '',
          recipient,
          background,
          status: status ?? KudoBoardStatus.Draft,
        })
      );
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

  updateStatus(currentStatus?: KudoBoardStatus) {
    if (currentStatus === KudoBoardStatus.Published) {
      this.kudoBoardFormGroup.patchValue({
        status: KudoBoardStatus.Draft,
      });
    } else {
      this.kudoBoardFormGroup.patchValue({
        status: KudoBoardStatus.Published,
      });
    }

    this.#cdr.detectChanges();
  }

  gotoBoard(kudoboardId: KudoBoard['id']) {
    this.#router.navigateByUrl(
      `/s/${APP_PATH_ALLOW_ANONYMOUS.KudoBoard}/${kudoboardId}`
    );
  }

  #autoCreateKudoBoard() {
    const autoCreate$ = this.kudoBoardFormGroup.valueChanges.pipe(
      takeUntilDestroyed(this.#destroyRef),
      takeUntil(this.kudoBoardCreated$),
      take(1),
      debounceTime(2500),
      filter(
        ({ recipient, background, title }) =>
          !!title || !!background || !!recipient
      ),
      shareReplay({
        refCount: true,
        bufferSize: 1,
      })
    );

    autoCreate$.subscribe(({ recipient, background, title }) =>
      this.#store.dispatch(
        FeatKudoBoardActions.createKudoBoard({
          kudoboard: {
            title: title ?? '',
            background,
            recipient,
            status: KudoBoardStatus.Draft,
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
