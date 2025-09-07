import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenderedMarkdownComponent } from './rendered-markdown';

describe('RenderedMarkdown', () => {
  let component: RenderedMarkdownComponent;
  let fixture: ComponentFixture<RenderedMarkdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RenderedMarkdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenderedMarkdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
