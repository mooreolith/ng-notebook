import { Directive, ElementRef, HostListener, AfterViewInit } from '@angular/core';

@Directive({
  selector: 'textarea[appAutoResize]',
  standalone: true
})
export class AutoResize {
  constructor(private elementRef: ElementRef<HTMLTextAreaElement>) { }

  @HostListener('input')
  onInput(): void {
    this.adjust();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.adjust(), 0);
  }

  private adjust(): void {
    const el = this.elementRef.nativeElement;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }
}
