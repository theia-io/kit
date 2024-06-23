import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ChipsModule } from 'primeng/chips';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';

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
    //
  ],
  templateUrl: './experience-add.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService]
})
export class FeatSettingsExperienceAddComponent {
  #fb = inject(FormBuilder);

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
