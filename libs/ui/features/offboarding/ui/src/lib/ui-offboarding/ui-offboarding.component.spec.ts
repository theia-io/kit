import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiOffboardingComponent } from './ui-offboarding.component';

describe('UiOffboardingComponent', () => {
  let component: UiOffboardingComponent;
  let fixture: ComponentFixture<UiOffboardingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiOffboardingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiOffboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
