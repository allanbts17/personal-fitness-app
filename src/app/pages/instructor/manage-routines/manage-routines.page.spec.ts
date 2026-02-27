import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageRoutinesPage } from './manage-routines.page';

describe('ManageRoutinesPage', () => {
  let component: ManageRoutinesPage;
  let fixture: ComponentFixture<ManageRoutinesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageRoutinesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
