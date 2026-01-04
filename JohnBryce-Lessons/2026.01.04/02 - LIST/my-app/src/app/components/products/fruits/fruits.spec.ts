import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fruits } from './fruits';

describe('Fruits', () => {
  let component: Fruits;
  let fixture: ComponentFixture<Fruits>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Fruits]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Fruits);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
