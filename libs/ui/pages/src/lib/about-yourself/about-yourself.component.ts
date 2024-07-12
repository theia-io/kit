import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  FeatLegalApiActions,
  FeatUserApiActions,
  selectCurrentProfile,
  selectProfilePicture,
} from '@kitouch/features/kit/data';
import { FeatSettingsExperienceAddComponent, FeatSettingsProfileInformationComponent } from '@kitouch/features/settings/ui';
import { Experience } from '@kitouch/shared/models';
import { Store } from '@ngrx/store';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { filter } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'kit-page-about-yourself',
  templateUrl: './about-yourself.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        @keyframes slidedown-icon {
          0% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(20px);
          }

          100% {
            transform: translateY(0);
          }
        }

        .slidedown-icon {
          animation: slidedown-icon;
          animation-duration: 3s;
          animation-iteration-count: infinite;
        }

        .box {
          background-image: radial-gradient(
            var(--primary-300),
            var(--primary-600)
          );
          border-radius: 50% !important;
          color: var(--primary-color-text);
        }
      }
    `,
  ],
  imports: [
    CommonModule,
    //
    AnimateOnScrollModule,
    //
    FeatSettingsExperienceAddComponent,
    FeatSettingsProfileInformationComponent,
  ],
})
export class PageAboutYourselfComponent implements OnInit {
  #router = inject(Router);
  #store = inject(Store);

  profile$ = this.#store.select(selectCurrentProfile).pipe(filter(Boolean));

  profilePic$ = this.#store.select(selectProfilePicture);

  scroll(el: HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth' });
  }

  ngOnInit(): void {
    this.#store.dispatch(FeatLegalApiActions.getCompanies());
  }

  saveExperienceHandler(experience: Experience) {
    this.#store.dispatch(FeatUserApiActions.addExperience({ experience }));
    this.#router.navigateByUrl('/');
  }
}
