import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Notebook } from './notebook';

describe('Notebook', () => {
  let component: Notebook;
  let fixture: ComponentFixture<Notebook>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Notebook]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Notebook);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
