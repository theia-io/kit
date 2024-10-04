import {
  ChangeDetectionStrategy,
  Component,
  effect,
  forwardRef,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  EditorInitEvent,
  EditorModule,
  EditorSelectionChangeEvent,
  EditorTextChangeEvent,
} from 'primeng/editor';
import Quill, { Bounds } from 'quill';
import { Delta } from 'quill/core';
import { FeatFarewellQuillActionsComponent } from '../editor-actions/quill-actions.component';
import { FeatFarewellQuillSideActionsComponent } from '../editor-side-actions/quill-side-actions.component';
import { ImageConfiguration } from './bloats-leaf';
import { Observable, of } from 'rxjs';

export interface Range {
  index: number;
  length: number;
}

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
export class FeatFarewellEditorComponent implements ControlValueAccessor {
  imageStorageProvider =
    input<(images: Array<File>) => Observable<Array<string>>>();
  editorTextChange = output<string>();

  editorText = signal<string>('');
  editorControl = new FormControl<string>('');

  quill = signal<Quill | null>(null);
  /** Extra state to limit number of calls to DOM API. Default is true */
  quillPlaceholderShown = signal(true);

  actionsShow = signal<boolean>(false);
  actionsBounds = signal<Bounds | null>(null);
  sideActionsShow = signal(false);
  sideActionsBounds = signal<Bounds | null>(null);
  sideActionOpened = signal<boolean>(this.sideActionsShow()); // default value same as initial value `show`

  constructor() {
    this.editorControl.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((v) => this.onChange(v ?? ''));

    effect(
      () => {
        this.#limitedQuillPlaceholderVisibility(
          this.sideActionsShow(),
          this.sideActionOpened(),
          this.editorText(),
          this.quill(),
          this.quillPlaceholderShown()
        );
      },
      {
        allowSignalWrites: true,
      }
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function -- Implemented
  onChange = (value: string) => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function -- Implemented
  onTouched = () => {};

  writeValue(value: string): void {
    this.editorControl.setValue(value);
    // check if this needed
    //   this.onChange(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  quillInit({ editor }: EditorInitEvent) {
    this.quill.set(editor);
  }

  dividerHandler(quill: Quill) {
    const range = quill.getSelection(true);
    quill.insertEmbed(range.index, 'divider', true, Quill.sources.USER);
    quill.insertText(range.index + 1, '\n', Quill.sources.USER);
    quill.setSelection(range.index + 2, Quill.sources.SILENT);
    quill.focus();

    // this.sideActionsShow.set(false);
    setTimeout(() => {
      const newRange = quill.getSelection(true);
      console.log('newRange', newRange, quill.getBounds(newRange));
      this.sideActionsBounds.set(quill.getBounds(newRange));
    });
  }

  imageFilesHandler(quill: Quill, mediaFiles: Array<File>) {
    const imageStorageProvider = this.imageStorageProvider();
    if (imageStorageProvider) {
      const imagesStorageProvider$ = imageStorageProvider(mediaFiles); //?? of([URL.createObjectURL(mediaFiles[0])]);

      imagesStorageProvider$.subscribe((urls) => {
        const imageSrc = urls[0];
        const kitQuillImageBloat: ImageConfiguration = {
          alt: 'Quill Cloud',
          // url: 'https://quilljs.com/0.20/assets/images/cloud.png'
          src: imageSrc,
          width: 300,
          height: 300,
        };
        const range = quill.getSelection(true);
        quill.insertEmbed(
          range.index,
          'image',
          kitQuillImageBloat,
          Quill.sources.USER
        );
        quill.insertText(range.index + 1, '\n', Quill.sources.USER);
        quill.setSelection(range.index + 2, Quill.sources.SILENT);
        quill.focus();

        this.sideActionsShow.set(false);
      });
    } else {
      console.warn('Image storage provider has not been provided');
    }
  }

  onTextChangeHandler({ textValue, delta }: EditorTextChangeEvent) {
    this.editorText.set(textValue);
    this.editorTextChange.emit(textValue);
    this.actionsShow.set(false);

    const quill = this.quill();
    if (!quill) {
      console.error('Quill should be initialized by now, report this bug');
      return;
    }

    const deltaOps = (delta as unknown as Delta).ops ?? [];
    const deltaFirstOp = deltaOps[0] ?? {};

    // if the first in delta ops is delete and its larger than 0 - means that row/section deleted completely
    if (deltaFirstOp.delete ?? 0 > 0) {
      this.sideActionsShow.set(true);
      this.sideActionsBounds.set(quill.getBounds(0));
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

  enterHandler() {
    const quill = this.quill();
    if (!quill) {
      console.error('Quill should be initialized by now, report this bug');
      return;
    }

    const selection = quill.getSelection();

    if (selection) {
      this.#checkSideActionShow(quill, selection);
    }
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
      !firstDeltaInsert ||
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
    editorText: string,
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

    const textLength = editorText.length;
    if (textLength !== 0) {
      // we don't need to keep track on other conditions because we can always guarantee correctness of state
      return;
    }

    if (sideActionOpened && placeholderAlreadyShown) {
      quill.root.classList.remove('ql-blank');
      this.quillPlaceholderShown.set(false);

      return;
    }

    if (!sideActionOpened && !placeholderAlreadyShown) {
      quill.root.classList.add('ql-blank');
      this.quillPlaceholderShown.set(true);

      return;
    }
  }
}
