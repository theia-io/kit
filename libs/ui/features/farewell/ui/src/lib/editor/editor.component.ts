import {
  ChangeDetectionStrategy,
  Component,
  effect,
  forwardRef,
  input,
  OnDestroy,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { ContractUploadedMedia } from '@kitouch/shared-models';
import {
  Editor,
  EditorInitEvent,
  EditorModule,
  EditorSelectionChangeEvent,
  EditorTextChangeEvent,
} from 'primeng/editor';
import Quill, { Bounds } from 'quill';
import { Delta } from 'quill/core';
import { Observable } from 'rxjs';
import { FeatFarewellQuillActionsComponent } from '../editor-actions/quill-actions.component';
import { FeatFarewellQuillSideActionsComponent } from '../editor-side-actions/quill-side-actions.component';
import { ImageConfiguration } from './bloats-leaf';
import { quillBackspaceImageHandler } from './quill';

export interface Range {
  index: number;
  length: number;
}

/** Note! This component has to be covered with unit tests before major refactoring  */
@Component({
  standalone: true,
  selector: 'feat-farewell-editor',
  templateUrl: './editor.component.html',
  styles: [
    `
      :host {
        position: relative;
      }
    `,
  ],
  imports: [
    ReactiveFormsModule,
    //
    FeatFarewellQuillActionsComponent,
    FeatFarewellQuillSideActionsComponent,
    //
    EditorModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FeatFarewellEditorComponent),
      multi: true,
    },
  ],
})
export class FeatFarewellEditorComponent
  implements OnDestroy, ControlValueAccessor
{
  imageStorageProvider =
    input<(images: Array<File>) => Observable<Array<ContractUploadedMedia>>>();
  deleteImage = input<(imageSrc: string) => void>();
  /** e.g. when user updates title we don't want to autofocus editor automatically */
  disableEditorAutoFocus = input<boolean>(false);
  editorTextChange = output<string>();

  editorComponent = viewChild(Editor);

  #editorControlEnabled = true;
  editorControl = new FormControl<string>('');

  quill = signal<Quill | null>(null);
  /** Extra state to limit number of calls to DOM API. Default is true */
  quillPlaceholderShown = signal(true);
  /** Likely is replaced by `#editorControlEnabled` and should be @deprecated */
  quillTextChangeActive = signal(true);

  actionsShow = signal<boolean>(false);
  actionsBounds = signal<Bounds | null>(null);

  sideActionsShow = signal(false);
  sideActionsBounds = signal<Bounds | null>(null);
  sideActionOpened = signal<boolean>(this.sideActionsShow()); // default value same as initial value `show`

  /** Used to auto focus quill to then end on initial page load  */
  #autoFocusToEndTimeout: NodeJS.Timeout | null = null;
  /** when component is destroyed all ongoing timeout have to be cleared */
  #clearSetTimeouts: Array<NodeJS.Timeout> = [];

  constructor() {
    effect(() => {
      if (this.disableEditorAutoFocus()) {
        this.#disableAutoFocus();
      }
    });

    this.editorControl.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((v) => {
        if (!this.#editorControlEnabled) {
          return;
        }
        this.#disableAutoFocus();
        this.onChange(v ?? '');
      });

    effect(
      () => {
        this.#limitedQuillPlaceholderVisibility(
          this.sideActionsShow(),
          this.sideActionOpened(),
          this.editorControl.value ?? '',
          this.quill(),
          this.quillPlaceholderShown()
        );
      },
      {
        allowSignalWrites: true,
      }
    );
  }

  ngOnDestroy(): void {
    this.#clearSetTimeouts.forEach((timeout) => {
      clearTimeout(timeout);
    });
    this.#clearSetTimeouts = [];
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function -- Implemented
  onChange = (value: string) => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function -- Implemented
  onTouched = () => {};

  writeValue(value: string): void {
    this.editorControl.setValue(value);
    // has to be done after quill sets value
    this.#autoFocusToEndTimeout = setTimeout(() => {
      this.#setFocusToEnd(this.quill());
    }, 2000);
    this.#clearSetTimeouts.push(this.#autoFocusToEndTimeout);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  quillInit({ editor }: EditorInitEvent) {
    this.quill.set(editor);

    const deleteImageCb = this.deleteImage();
    if (deleteImageCb) {
      const testedChromex20Throttle = 1250; // come up with better solution
      this.#clearSetTimeouts.push(
        setTimeout(() => {
          const quillObserver = new MutationObserver((mutationsList) => {
            mutationsList.forEach((mutation, idx) => {
              if (
                mutation.type === 'childList' &&
                mutation.removedNodes.length > 0
              ) {
                mutation.removedNodes.forEach((removedNode) => {
                  if (
                    (removedNode as HTMLImageElement).dataset?.['id'] ===
                    'loading-gif'
                  ) {
                    console.info('loading gif removed', removedNode);
                  } else {
                    // Check if the removed node is an image
                    if (
                      quillBackspaceImageHandler(
                        removedNode,
                        mutationsList[idx + 1]?.addedNodes?.[0]
                      )
                    ) {
                      deleteImageCb(removedNode.src);
                      // Do something with the removed image element
                    }
                  }
                });
              }
            });
          });

          quillObserver.observe((editor as Quill).root, {
            childList: true,
            subtree: true,
          });
        }, testedChromex20Throttle)
      );
    }
  }

  dividerHandler(quill: Quill) {
    this.quillTextChangeActive.set(false);

    const range = quill.getSelection(true);
    let idx = range.index;

    quill.insertEmbed(idx++, 'divider', false, Quill.sources.USER);
    quill.insertText(idx++, '\n', Quill.sources.USER);
    quill.insertText(idx++, '\n', Quill.sources.USER);
    quill.setSelection(idx++, Quill.sources.SILENT);
    quill.focus();

    // this.sideActionsShow.set(false);
    this.quillTextChangeActive.set(true);
    this.#keepSideActionOpened({ quill, updateBoundOnly: true });
  }

  imageFilesHandler(quill: Quill, mediaFiles: Array<File>) {
    const imageStorageProvider = this.imageStorageProvider();
    if (imageStorageProvider) {
      const imagesStorageProvider$ = imageStorageProvider(mediaFiles);

      this.quillTextChangeActive.set(false);

      const range = quill.getSelection(true);
      let idx = range.index;

      this.#editorControlEnabled = false;
      quill.insertEmbed(
        idx++,
        'image',
        {
          alt: 'KIT kitouch farewell image placeholder',
          src: '/loading.gif',
          dataId: 'loading-gif',
        },
        Quill.sources.USER
      );
      const insertedImageIdx = idx - 1;

      imagesStorageProvider$.subscribe(
        (urls) => {
          this.#editorControlEnabled = true;
          const imageSrc = urls[0];

          const kitQuillImageBloat: ImageConfiguration = {
            alt: 'KIT kitouch farewell image',
            src: imageSrc.optimizedUrls[0] ?? imageSrc.url,
            width: imageSrc.width ?? 300,
            height: imageSrc.height ?? 300,
            loadedCb: () => {
              quill.deleteText(insertedImageIdx, 1, Quill.sources.USER);
              this.#keepSideActionOpened({ quill });
            },
          };

          quill.insertEmbed(
            idx++,
            'image',
            kitQuillImageBloat,
            Quill.sources.USER
          );
          quill.insertText(idx++, '\n', Quill.sources.USER);
          quill.insertText(idx++, '\n', Quill.sources.USER);
          quill.setSelection(idx++, Quill.sources.SILENT);
          quill.focus();

          this.quillTextChangeActive.set(true);
        },
        () => {
          this.#editorControlEnabled = true;
          quill.deleteText(insertedImageIdx, 1, Quill.sources.USER);
          this.#keepSideActionOpened({ quill });
        }
      );
    } else {
      console.warn(
        'Image storage provider has not been provided, image is not loaded'
      );
    }
  }

  onTextChangeHandler({ textValue, delta }: EditorTextChangeEvent) {
    if (!this.quillTextChangeActive()) {
      return;
    }

    this.editorTextChange.emit(textValue);
    this.actionsShow.set(false);

    const quill = this.quill();
    if (!quill) {
      console.error('Quill should be initialized by now, report this bug');
      return;
    }

    const deltaOps = (delta as unknown as Delta).ops ?? [];
    const [deltaFirstOp = {}, deltaSecOp = {}] = deltaOps ?? [];

    // when the first in delta ops is delete and its larger than 0 - means that row/section deleted completely
    if (deltaFirstOp.delete ?? 0 > 0) {
      this.#keepSideActionOpened({ quill });
      return;
    }

    // OR when 2 items retain & deleted then also show
    if (
      deltaOps.length === 2 &&
      typeof deltaFirstOp.retain === 'number' &&
      deltaFirstOp.retain > 0 &&
      deltaSecOp.delete &&
      deltaSecOp.delete > 0
    ) {
      const range = quill.getSelection(true);
      this.#checkSideActionShow(quill, range);
      return;
    }

    const deltaLastOp = deltaOps[deltaOps.length - 1];
    const newLine =
      typeof deltaLastOp.insert === 'string' && deltaLastOp.insert === '\n';
    if (newLine) {
      this.#keepSideActionOpened({ quill });
      return;
    }

    this.sideActionsShow.set(false);
    return;
  }

  selectionChangeHandler(event: EditorSelectionChangeEvent) {
    const quill = this.quill();
    if (!quill) {
      console.error('Quill should be initialized by now, report this bug');
      return;
    }

    const range = (event.range ?? {}) as unknown as Range; // API interface needs override TODO add this to .d.ts file

    this.#checkActionShow(quill, range);
    this.#checkSideActionShow(quill, range);
  }

  #disableAutoFocus() {
    if (this.#autoFocusToEndTimeout) {
      clearTimeout(this.#autoFocusToEndTimeout);
      this.#autoFocusToEndTimeout = null;
    }
  }

  #setFocusToEnd(quill: Quill | null) {
    if (!quill) {
      console.warn('quill is not initialized');
      return;
    }

    let length = quill.getLength();
    if (length > 100) {
      (this.editorComponent()?.el.nativeElement as HTMLElement).scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'start',
      });
    }

    this.#clearSetTimeouts.push(
      setTimeout(() => {
        if (length > 1) {
          quill.insertText(length++, '\n', Quill.sources.USER);
        }
        quill.setSelection(length, Quill.sources.SILENT);
        quill.focus();
        this.sideActionsShow.set(true);
        this.#keepSideActionOpened({ quill, updateBoundOnly: true });
      }, 750)
    ); // come up with better delay (should happen just after scroll above `scrollIntoView`)
  }

  #checkActionShow(quill: Quill, { index, length }: Range) {
    if (length > 0) {
      this.actionsShow.set(true);
      this.actionsBounds.set(quill.getBounds(index, length));
    }
  }

  #checkSideActionShow(quill: Quill, { index, length }: Range) {
    if (length !== 0) {
      this.sideActionsShow.set(false);
      return;
    }

    const [_, lineIndex] = quill.getLine(index);
    if (lineIndex !== 0) {
      this.sideActionsShow.set(false);
      return;
    }

    const delta = quill.getContents(index);
    const firstDeltaInsert = delta.ops[0]?.insert;
    if (
      !firstDeltaInsert &&
      !(
        typeof firstDeltaInsert === 'string' &&
        firstDeltaInsert.startsWith('\n')
      )
    ) {
      this.sideActionsShow.set(false);
      return;
    }

    this.sideActionsShow.set(true);
    this.sideActionsBounds.set(quill.getBounds(index));
  }

  // TODO add unit test for this
  /** Show or hide placeholder applying limited number of DOM manipulation  */
  #limitedQuillPlaceholderVisibility(
    sideActionShown: boolean,
    sideActionOpened: boolean,
    editorContent: string,
    quill: Quill | null,
    placeholderAlreadyShown: boolean
  ) {
    if (!quill) {
      return;
    }

    //
    if (!sideActionShown) {
      // we don't need to keep track on other conditions because we can always guarantee correctness of state
      return;
    }

    const textLength = editorContent.length;
    if (textLength < 4) {
      // we don't need to keep track on other conditions because we can always guarantee correctness of state
      return;
    }

    if (sideActionOpened && placeholderAlreadyShown) {
      quill.root.classList.remove('ql-blank');
      this.quillPlaceholderShown.set(false);

      return;
    }

    if (!sideActionOpened && !placeholderAlreadyShown && textLength < 4) {
      quill.root.classList.add('ql-blank');
      this.quillPlaceholderShown.set(true);

      return;
    }
  }

  /** This is layer of code to refactor. Since currently there is no way to keep side actions opened hence re-opened it again with timeout! In a correct final version we should get "this ( = Keeping Side Action panel opened.)" functionality with this.sideActionsShow w/o setTimeout */
  #keepSideActionOpened({
    quill,
    updateBoundOnly,
    autofocus,
  }: {
    quill: Quill;
    updateBoundOnly?: boolean;
    autofocus?: boolean;
  }) {
    const updateBounds = () => {
      const newRange = quill.getSelection(true);
      this.sideActionsBounds.set(quill.getBounds(newRange));
    };

    this.#clearSetTimeouts.push(
      setTimeout(() => {
        if (updateBoundOnly) {
          updateBounds();
          return;
        }

        this.sideActionsShow.set(true);
        updateBounds();

        if (autofocus) {
          quill.focus();
        }
      }, 0)
    );
  }
}
