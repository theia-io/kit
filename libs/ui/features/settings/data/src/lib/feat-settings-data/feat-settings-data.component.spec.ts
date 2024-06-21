import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatSettingsDataComponent } from './feat-settings-data.component';

describe('FeatSettingsDataComponent', () => {
  let component: FeatSettingsDataComponent;
  let fixture: ComponentFixture<FeatSettingsDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatSettingsDataComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatSettingsDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
