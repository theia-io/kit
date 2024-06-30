import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Experience,
  ExperienceType,
  LocationType,
} from '@kitouch/shared/models';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipsModule } from 'primeng/chips';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { StepperModule } from 'primeng/stepper';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'lib-feat-settings-experience-add',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    //
    FloatLabelModule,
    InputTextModule,
    CheckboxModule,
    DropdownModule,
    CalendarModule,
    InputSwitchModule,
    ChipsModule,
    FileUploadModule,
    StepperModule,
    ButtonModule,
    //
  ],
  templateUrl: './experience-add.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService],
})
export class FeatSettingsExperienceAddComponent {
  #fb = inject(FormBuilder);

  stepperActive = 0;

  experienceForm = this.#fb.group({
    title: ['', { validators: [Validators.required, Validators.minLength(2)] }],
    type: new FormControl<ExperienceType | null>(null, [Validators.required]),
    company: [
      '',
      { validators: [Validators.required, Validators.minLength(2)] },
    ],
    location: [''],
    locationType: new FormControl<LocationType | null>(null, [
      Validators.required,
    ]),
    startDate: new FormControl<Date | null>(null, [Validators.required]),
    endDate: new FormControl<Date | null>(null),
    description: [''],
    skills: [''],
    links: [''],
    media: [''],
  });

  experienceType = Object.values(ExperienceType);
  locationType = Object.values(LocationType);

  uploadedFiles: any[] = [];

  constructor(private messageService: MessageService) {}

  onUpload(event: UploadEvent) {
    for (const file of event.files) {
      this.uploadedFiles.push(file);
    }

    this.messageService.add({
      severity: 'info',
      summary: 'File Uploaded',
      detail: '',
    });
  }

  saveExperience(experience: Experience) {
    console.log(experience);
  }
}
