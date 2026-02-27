import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditRoutinePage } from './edit-routine.page';

describe('EditRoutinePage', () => {
  let component: EditRoutinePage;
  let fixture: ComponentFixture<EditRoutinePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRoutinePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
