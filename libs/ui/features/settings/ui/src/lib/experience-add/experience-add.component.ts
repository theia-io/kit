import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  FeatLegalApiActions,
  FeatUserApiActions,
  getMatchingCompanies,
} from '@kitouch/features/kit/data';
import {
  Experience,
  ExperienceType,
  LocationType,
} from '@kitouch/shared/models';
import {
  citiesInCountries,
  countries,
  GeolocationService,
} from '@kitouch/ui/shared';
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
import { filter, map, of, scan, startWith, switchMap, take, takeUntil } from 'rxjs';
import { runInThisContext } from 'vm';

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
export class FeatSettingsExperienceAddComponent implements OnInit {
  #fb = inject(FormBuilder);
  #store = inject(Store);
  #messageService = inject(MessageService);
  //
  #geolocationService = inject(GeolocationService);
  //
  readonly #takeUntilDestroyed = takeUntilDestroyed();

  stepperActive = signal(0);
  #stepsVisited$ = toObservable(this.stepperActive).pipe(
    scan(
      (previouslyActivatedSteps, activatedStep) => ({
        ...previouslyActivatedSteps,
        [activatedStep]: true,
      }),
      {}
    )
  );
  allStepsVisited$ = this.#stepsVisited$.pipe(
    map(
      (stepsVisited) =>
        Object.values(stepsVisited).filter((visited) => visited).length === 3
    ),
    startWith(false)
  );

  experienceForm = this.#fb.group({
    title: ['', { validators: [Validators.required, Validators.minLength(2)] }],
    type: new FormControl<ExperienceType | null>(null, [Validators.required]),
    company: [
      '',
      { validators: [Validators.required, Validators.minLength(2)] },
    ],
    country: [''],
    city: [{value: '', disabled: true}],
    locationType: new FormControl<LocationType | null>(null, [
      Validators.required,
    ]),
    startDate: new FormControl<Date | null>(null, [Validators.required]),
    endDate: new FormControl<Date | null>(null),
    description: [''],
    skills: [''],
    links: [''],
    media: [[] as any],
  });

  currentlyWorkingHere = new FormControl();

  experienceType = Object.values(ExperienceType);
  locationType = Object.values(LocationType);

  suggestedCompanies$ = this.experienceForm
    .get('company')
    ?.valueChanges.pipe(
      switchMap((typedCompany: string | null) =>
        (typedCompany?.length ?? 0) > 2
          ? this.#store.select(getMatchingCompanies(typedCompany as string))
          : of([])
      )
    );

  countries = countries.map(country => country.name);
  citiesInCountries = toSignal(
    this.experienceForm.get('country')!.valueChanges.pipe(
      filter((country) => !!country),
      map(
        (country) =>
          citiesInCountries[country as keyof typeof citiesInCountries]
      ),
      startWith([])
    )
  );

  readonly geolocationAvailable = this.#geolocationService.geolocationAvailable;

  ngOnInit(): void {
    this.#store.dispatch(FeatLegalApiActions.getCompanies());

    this.experienceForm.get('country')
      ?.valueChanges
      .pipe(
        this.#takeUntilDestroyed
      )
      .subscribe(() => this.experienceForm.get('city')?.reset())

    this.experienceForm.valueChanges.subscribe((formValue) => {
      console.log(formValue, this.experienceForm.valid);
    });
  }

  setCurrentGeolocation() {
    this.#geolocationService
      .getCurrentUserLocationCity$()
      .pipe(take(1))
      .subscribe((yourLocation) => {
        this.experienceForm.get('country')?.setValue(yourLocation);
        this.experienceForm.get('city')?.setValue(yourLocation);
      });
  }

  onUpload(event: UploadEvent) {
    const uploadedFiles = [];
    for (const file of event.files) {
      uploadedFiles.push(file);
    }

    this.experienceForm.get('media')?.setValue(uploadedFiles);

    this.#messageService.add({
      severity: 'info',
      summary: 'File Uploaded',
      detail: '',
    });
  }

  saveExperience() {
    const experience = this.experienceForm.value as Experience;
    this.#store.dispatch(FeatUserApiActions.addExperience({ experience }));
  }
}
