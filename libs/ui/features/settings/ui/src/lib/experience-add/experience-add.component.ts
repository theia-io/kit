import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { selectCompaniesState } from '@kitouch/features/kit/data';
import {
  Experience,
  ExperienceType,
  LocationType,
} from '@kitouch/shared/models';
import { GeolocationService } from '@kitouch/ui/shared';
import { Store } from '@ngrx/store';
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
import { combineLatest, map, tap } from 'rxjs';

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
  #store = inject(Store);
  #messageService = inject(MessageService);
  //
  #geolocationService = inject(GeolocationService);

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

  suggestedCompanies$ = combineLatest([
    this.#store.select(selectCompaniesState),
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.experienceForm.get('company')!.valueChanges, //.pipe(map(v => v.company))
  ]).pipe(
    tap((v) => console.log('suggestedCompanies', v)),
    map(([companies, typedCompany]) =>
      companies
        // @TODO add fuzzy search ? https://en.wikipedia.org/wiki/Approximate_string_matching
        .filter((company) => company.name.includes(typedCompany ?? ''))
        .splice(-10)
    ),
    tap((v) => console.log('suggestedCompanies', v))
  );

  readonly geolocationAvailable = this.#geolocationService.geolocationAvailable;

  setCurrentGeolocation() {
    this.#geolocationService
      .getCurrentUserLocationCity$()
      .subscribe((v) => console.log('CITY', v));
  }

  onUpload(event: UploadEvent) {
    for (const file of event.files) {
      this.uploadedFiles.push(file);
    }

    this.#messageService.add({
      severity: 'info',
      summary: 'File Uploaded',
      detail: '',
    });
  }

  saveExperience(experience: Experience) {
    console.log(experience);
  }
}