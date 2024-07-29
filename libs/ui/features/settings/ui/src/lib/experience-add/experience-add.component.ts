import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  FeatUserApiActions,
  getMatchingCompanies,
} from '@kitouch/kit-data';
import {
  Experience,
  ExperienceType,
  LocationType,
} from '@kitouch/shared-models';
import {
  citiesInCountries,
  countries,
  GeolocationService,
} from '@kitouch/ui-shared';
import { Actions, ofType } from '@ngrx/effects';
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
import { filter, map, of, scan, startWith, switchMap, take } from 'rxjs';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'feat-settings-experience-add',
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
  onSaving = output();
  onSaved = output();
  onRemove = output();

  #actions = inject(Actions);
  #store = inject(Store);

  #fb = inject(FormBuilder);
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
    company: [
      '',
      { validators: [Validators.required, Validators.minLength(2)] },
    ],
    country: [''],
    city: [{ value: '', disabled: true }],
    type: new FormControl<ExperienceType | null>(null, [Validators.required]),
    locationType: new FormControl<LocationType | null>(null, [
      Validators.required,
    ]),
    startDate: new FormControl<string | null>(null, [Validators.required]),
    endDate: new FormControl<string | null>(null),
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

  countries = countries.map((country: {name: string, code: string}) => country.name);
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
    this.experienceForm
      .get('country')
      ?.valueChanges.pipe(this.#takeUntilDestroyed)
      .subscribe(() => this.experienceForm.get('city')?.reset());
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

  onSaveExperienceClick() {
    const experience = this.experienceForm.value as Experience;

    /** @TODO @FIXME we can also keep this experience form and create a new one next to this so user can update it straight away **/
    this.experienceForm.reset();
    this.stepperActive.set(0);

    this.onSaving.emit();

    this.#actions
      .pipe(ofType(FeatUserApiActions.addExperienceSuccess), take(1))
      .subscribe(() => this.onSaved.emit());
    this.#store.dispatch(FeatUserApiActions.addExperience({ experience }));
  }
}
