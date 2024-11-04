import { Location, NgOptimizedImage, NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  DestroyRef,
  effect,
  inject,
  Input,
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
  UiKitPicUploadableComponent,
  UiKitPicUploadableDirective,
  UIKitSmallerHintTextUXDirective,
} from '@kitouch/ui-components';
import { APP_PATH_ALLOW_ANONYMOUS } from '@kitouch/ui-shared';
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

@Component({
  standalone: true,
  selector: 'feat-kudoboard-wrapper',
  template: ` <ng-container *ngTemplateOutlet="templateRef"></ng-container> `,
  imports: [NgTemplateOutlet],
})
export class WrapperComponent {
  @Input() templateRef: TemplateRef<any>;
}

const TITLE_MAX_LENGTH = 128;

@Component({
  standalone: true,
  selector: 'feat-kudoboard-edit',
  templateUrl: './edit.component.html',
  imports: [
    //
    ReactiveFormsModule,
    NgOptimizedImage,
    NgTemplateOutlet,
    //
    FloatLabelModule,
    InputTextModule,
    ButtonModule,
    //
    UIKitSmallerHintTextUXDirective,
    UiKitPicUploadableComponent,
    UiKitPicUploadableDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatKudoBoardEditComponent implements AfterViewInit {
  id = model<KudoBoard['id']>();
  statusTmplPlaceholder = input<ViewContainerRef>();

  statusUpdateTmpl = output<TemplateRef<any>>();

  #location = inject(Location);
  #cdr = inject(ChangeDetectorRef);
  #destroyRef = inject(DestroyRef);
  #componentFactoryResolver = inject(ComponentFactoryResolver);
  #store = inject(Store);
  #actions$ = inject(Actions);

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

  readonly titleMaxLength = TITLE_MAX_LENGTH;
  readonly kudoBoardStatus = KudoBoardStatus;

  @ViewChild('statusTmpl', { read: TemplateRef })
  statusTmpl?: TemplateRef<any>;

  constructor() {
    effect(() =>
      console.log(
        `kudoboardId: ${this.id()}, board and profile`,
        this.currentProfile()
      )
    );
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.statusTmpl) {
        console.log(this.statusTmpl);
        this.statusUpdateTmpl.emit(this.statusTmpl);
      }
    });
    // setTimeout(() => {
    //   console.log(this.statusTmplPlaceholder());
    //   console.log(this.statusTmpl);

    //   // 1. Create a component factory
    //   const componentFactory = this.#componentFactoryResolver.resolveComponentFactory(WrapperComponent); // Replace with your actual component

    //   // 2. Clear the container (if needed)
    //   this.statusTmplPlaceholder()?.clear();

    //   // 3. Create the component
    //   const componentRef = this.statusTmplPlaceholder()?.createComponent(componentFactory);

    //   console.log('componentRef',componentRef);
    //   // 4. (Optional) Pass data to the component
    //   if(componentRef) {
    //     componentRef.instance.templateRef = this.statusTmpl;
    //   }
    // });

    this.kudoBoardFormGroup.valueChanges.subscribe((v) =>
      console.log('KUDOBOARD FORM', v)
    );

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
      .subscribe(([background, kudoboard]) => {
        this.kudoBoardFormGroup.patchValue({
          background,
        });
        // to update view
        this.#cdr.detectChanges();
        // assuming actions above are success (TODO handle error case)
        const prevBackground = kudoboard.background;
        if (prevBackground) {
          this.#store.dispatch(
            FeatKudoBoardMediaActions.deleteKudoBoardStorageMedia({
              url: prevBackground,
            })
          );
        }
      });

    const kudoBoardId = this.id();
    if (kudoBoardId) {
      this.#uploadBackground(kudoBoardId, images, this.currentProfile()?.id);
    } else {
      this.kudoBoardCreated$
        .pipe(take(1))
        .subscribe(({ kudoboard: { id } }) => {
          this.#updateJustCreatedKudoBoardUrl(id);
          this.#uploadBackground(id, images, this.currentProfile()?.id);
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
    console.log('CHILD');

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

  #uploadBackground(
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
      `/s/${APP_PATH_ALLOW_ANONYMOUS.KudoBoard}/${id}`
    );
  }
}
