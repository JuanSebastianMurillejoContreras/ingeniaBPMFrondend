import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificGoalComponent } from './specific-goal.component';

describe('SpecificGoalComponent', () => {
  let component: SpecificGoalComponent;
  let fixture: ComponentFixture<SpecificGoalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpecificGoalComponent]
    });
    fixture = TestBed.createComponent(SpecificGoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
