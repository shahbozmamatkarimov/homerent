import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentList } from './rent-list';

describe('RentList', () => {
  let component: RentList;
  let fixture: ComponentFixture<RentList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RentList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
