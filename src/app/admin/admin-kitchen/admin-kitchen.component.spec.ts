import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminKitchenComponent } from './admin-kitchen.component';

describe('AdminKitchenComponent', () => {
  let component: AdminKitchenComponent;
  let fixture: ComponentFixture<AdminKitchenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminKitchenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminKitchenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
