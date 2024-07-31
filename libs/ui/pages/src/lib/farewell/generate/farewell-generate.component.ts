import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  standalone: true,
  templateUrl: './farewell-generate.component.html',
  imports: [
    ReactiveFormsModule,
    //
    FloatLabelModule,
    InputTextModule,
    ButtonModule,
  ],
})
export class FarewellGenerateComponent {
  farewellControl = new FormControl<string>('', [
    Validators.required,
    Validators.minLength(100),
    Validators.maxLength(10000),
  ]);

  saveFarewellHandler() {
    if (!this.farewellControl.valid) {
      return;
    }

    console.log(this.farewellControl.value);
  }
}
