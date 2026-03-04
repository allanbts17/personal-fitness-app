import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoutineExecutionPage } from './routine-execution.page';

describe('RoutineExecutionPage', () => {
  let component: RoutineExecutionPage;
  let fixture: ComponentFixture<RoutineExecutionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutineExecutionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
