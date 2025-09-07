import { Component, model, effect, output, computed, 
  ViewChild, ElementRef, AfterViewInit, 
  Type} from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as ts from "typescript";
import { RenderedMarkdownComponent } from '../rendered-markdown/rendered-markdown';
import { AutoResize } from '../../directives/auto-resize';
import { OutputInterface } from '../../models/cell.model';

@Component({
  selector: 'app-cell',
  imports: [FormsModule, RenderedMarkdownComponent, AutoResize],
  templateUrl: './cell.html',
  styleUrl: './cell.css',
})
export class CellComponent implements AfterViewInit {
  public cell_type = model<string>('javascript');
  public source = model<string>('');
  public outputs = model<OutputInterface[]>([]);
  public execution_count = model<number>(0);
  
  public isRendered = model<boolean>(false);
  public out = output<OutputInterface>();

  public sourceRows = computed(() => {
    return this.source().split(/\r\n|\r|\n/).length - 1;
  });

  public addAbove = output<CellComponent>();
  public addBelow = output<CellComponent>();
  public remove = output<CellComponent>();

  @ViewChild('textarea') textarea!: ElementRef<HTMLTextAreaElement>;

  ngAfterViewInit(): void {
    this.textarea.nativeElement.focus();
  }

  constructor(){
    effect(() => {
      if(this.cell_type() !== 'markdown' && this.isRendered()){
        this.isRendered.set(false);
      }
    });

    this.out.subscribe((output) => {
      this.outputs.update(outputs => {
        outputs.push(output);
        return outputs;
      })
    })
  }

  public run(): void {
    switch(this.cell_type()){
      case 'markdown':
        this.runMD();
        this.execution_count.set(0);
        break;

      case 'javascript':
        this.clear()
        try{
          const result = this.runJS();
          this.out.emit({output_type: "execute_result", name: "stdout", text: result});
        }catch(e: any){
          this.out.emit({output_type: "text/plain", name: "stderr", text: e.stack});
        }
        this.execution_count.update(c => c + 1);
        break;

      case 'typescript':
        this.clear();
        try{
          const result = this.runTS();
          this.out.emit({output_type: "execute_result", name: "stdout", text: result});
        }catch(e: any){
          this.out.emit({output_type: "text/plain", name: "stderr", text: e.stack});
        }
        this.execution_count.update(c => c + 1);
        break;
    }
  }

  public clear(): void {
    this.outputs.set([]);
    this.execution_count.set(0);
  }

  private wrapRun(actual: (src: string) => any): void {
    const originalLog = console.log;
    console.log = (...args: any[]): void => {
      originalLog.apply(console, args);
      this.out.emit({output_type: "text/plain", name: 'stdout', text: args.join(' ')});
    }

    const originalError = console.error;
    console.error = (...args: any[]): void => {
      originalError.apply(console, args);
      this.out.emit({output_type: "text/plain", name: 'stderr', text: args.join(' ')});
    }
    
    let result;
    try{
      result = actual(this.source());
    }catch(e: any){
      console.error(e.message);
    }

    console.log = originalLog.bind(console);
    console.error = originalError.bind(console);

    return result;
  }

  private runMD(){
    this.isRendered.update(cur => !cur);
    this.outputs.set([]);
  }

  private runJS(): any {
    try{
      return this.wrapRun((source) => (0, eval)(source));
    }catch(e: any){
      console.error("JavaScript Error", e.stack);
    }
  }

  private runTS(): any {
    try{
      return this.wrapRun((source) => {
        let js = ts.transpileModule(source, {
          compilerOptions: {
            module: ts.ModuleKind.CommonJS
          }
        }).outputText;

        return (0, eval)(js);
      })
    }catch(e: any){
      console.error("TypeScript Error", e.stack)
    }
  }

  adjust(event: any): void{
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }
}
