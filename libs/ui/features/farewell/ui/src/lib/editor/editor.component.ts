import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
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
import { FeatFarewellQuillActionsComponent } from '../editor-actions/quill-actions.component';
import { FeatFarewellQuillSideActionsComponent } from '../editor-side-actions/quill-side-actions.component';

export interface Range {
  index: number;
  length: number;
}

@Component({
  standalone: true,
  selector: 'feat-farewell-editor',
  templateUrl: './editor.component.html',
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
  editorControl = new FormControl('');

  editorText = output<string>();

  quill: Quill;

  actionsShow = signal<boolean>(false);
  actionsBounds = signal<Bounds | null>(null);
  sideActionsShow = signal(false);
  sideActionsBounds = signal<Bounds | null>(null);

  constructor() {
    this.editorControl.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((v) => this.onChange(v ?? ''));
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
    this.quill = editor;
  }

  onTextChangeHandler({ textValue }: EditorTextChangeEvent) {
    this.editorText.emit(textValue);
    this.actionsShow.set(false);
    this.sideActionsShow.set(false);
  }

  selectionChangeHandler(event: EditorSelectionChangeEvent) {
    const range = (event.range ?? {}) as unknown as Range; // API interface needs override TODO add this to .d.ts file

    this.#checkActionShow(range);
    this.#checkSideActionShow(range);
  }

  #checkActionShow({ index, length }: Range) {
    if (length > 0) {
      this.actionsShow.set(true);
      this.actionsBounds.set(this.quill.getBounds(index, length));
    }
  }

  enterHandler() {
    const selection = this.quill.getSelection();
    console.log('\n\nenterHandler!', selection);

    if (selection) {
      this.#checkSideActionShow(selection);
    }
  }

  #checkSideActionShow({ index, length }: Range) {
    if (length !== 0) {
      this.sideActionsShow.set(false);
      return;
    }

    const [_, lineIndex] = this.quill.getLine(index);
    if (lineIndex !== 0) {
      this.sideActionsShow.set(false);
      return;
    }

    const delta = this.quill.getContents(index);
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
    this.sideActionsBounds.set(this.quill.getBounds(index));
  }
}
