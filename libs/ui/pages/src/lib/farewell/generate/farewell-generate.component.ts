import { Component } from '@angular/core';
import { FeatFarewellGenerateComponent } from '@kitouch/feat-farewell-ui';
import { ButtonModule } from 'primeng/button';
import { EditorModule } from 'primeng/editor';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  standalone: true,
  templateUrl: './farewell-generate.component.html',
  imports: [
    // ReactiveFormsModule,
    //
    FeatFarewellGenerateComponent,
    //
    EditorModule,
    FloatLabelModule,
    InputTextModule,
    ButtonModule,
  ],
})
export class PageFarewellGenerateComponent {}
