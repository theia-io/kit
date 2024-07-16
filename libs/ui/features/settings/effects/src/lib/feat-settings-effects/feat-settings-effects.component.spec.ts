import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatSettingsEffectsComponent } from './feat-settings-effects.component';

describe('FeatSettingsEffectsComponent', () => {
  let component: FeatSettingsEffectsComponent;
  let fixture: ComponentFixture<FeatSettingsEffectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatSettingsEffectsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatSettingsEffectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
