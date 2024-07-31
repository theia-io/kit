import { Component, computed, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { EditorModule, EditorTextChangeEvent } from 'primeng/editor';

@Component({
  standalone: true,
  templateUrl: './farewell-generate.component.html',
  imports: [
    // ReactiveFormsModule,
    //
    EditorModule,
    FloatLabelModule,
    InputTextModule,
    ButtonModule,
  ],
})
export class FarewellGenerateComponent {
  modules = {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],
        ['link'],
      
        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      
        ['clean']                                         // remove formatting button
      ]
    };

  editorText = signal<EditorTextChangeEvent | null>(null);
  textValue = computed(() => this.editorText()?.textValue ?? '');

  // farewellControl = new FormControl<string>('', [
  //   Validators.required,
  //   Validators.minLength(100),
  //   Validators.maxLength(10000),
  // ]);

  onTextChangeHandler(value: EditorTextChangeEvent) {
    this.editorText.set(value);
  }

  saveFarewellHandler() {
    console.log(this.editorText());
  }
}
