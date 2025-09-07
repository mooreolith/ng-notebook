import { Component, model, inject, effect, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';

@Component({
  selector: 'rendered-markdown',
  imports: [],
  templateUrl: './rendered-markdown.html',
  styleUrl: './rendered-markdown.css',
})
export class RenderedMarkdownComponent {
  public source = model<string>('');
  public rendered = model<SafeHtml>('');
  private sanitizer = inject(DomSanitizer);

  constructor(){
    effect(async () => {
      const parsed = await marked.parse(this.source());
      const trusted = this.sanitizer.bypassSecurityTrustHtml(parsed);
      this.rendered.set(trusted);
    })
  }
}
