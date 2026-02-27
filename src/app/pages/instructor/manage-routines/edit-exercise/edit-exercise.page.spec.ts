import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditExercisePage } from './edit-exercise.page';

describe('EditExercisePage', () => {
  let component: EditExercisePage;
  let fixture: ComponentFixture<EditExercisePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditExercisePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
