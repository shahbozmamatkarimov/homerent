import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentWindow } from './rent-window';

describe('RentWindow', () => {
  let component: RentWindow;
  let fixture: ComponentFixture<RentWindow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RentWindow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentWindow);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
