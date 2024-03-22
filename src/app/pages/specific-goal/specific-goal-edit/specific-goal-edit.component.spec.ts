import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificGoalEditComponent } from './specific-goal-edit.component';

describe('SpecificGoalEditComponent', () => {
  let component: SpecificGoalEditComponent;
  let fixture: ComponentFixture<SpecificGoalEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpecificGoalEditComponent]
    });
    fixture = TestBed.createComponent(SpecificGoalEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
