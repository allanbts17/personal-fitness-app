import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterStudentsPage } from './register-students.page';

describe('RegisterStudentsPage', () => {
  let component: RegisterStudentsPage;
  let fixture: ComponentFixture<RegisterStudentsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterStudentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
