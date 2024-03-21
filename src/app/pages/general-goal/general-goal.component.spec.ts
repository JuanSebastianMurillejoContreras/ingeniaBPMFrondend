import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralGoalComponent } from './general-goal.component';

describe('GeneralGoalComponent', () => {
  let component: GeneralGoalComponent;
  let fixture: ComponentFixture<GeneralGoalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GeneralGoalComponent]
    });
    fixture = TestBed.createComponent(GeneralGoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
