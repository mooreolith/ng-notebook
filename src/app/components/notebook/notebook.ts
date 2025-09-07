import { Component, model, ViewChildren, QueryList, inject, AfterViewInit } from '@angular/core';
import { CellComponent } from "../cell/cell";
import { CellModel } from '../../models/cell.model';
import { NotebookService } from '../../services/notebook.service';
import { NotebookModel } from '../../models/notebook.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-notebook',
  imports: [CellComponent, FormsModule],
  templateUrl: './notebook.html',
  styleUrl: './notebook.css'
})
export class NotebookComponent implements AfterViewInit {
  private notebookService = inject(NotebookService);
  public notebook = model<NotebookModel>(this.notebookService.getInstance());

  @ViewChildren(CellComponent) cellComps: QueryList<CellComponent> = new QueryList<CellComponent>();

  ngAfterViewInit(){
    this.notebook().metadata.title = "Untitled Notebook";
    if(this.notebook().cells.length === 0){
      this.notebook().cells.push(new CellModel());
    }
  }

  onAdd(): void {
    this.notebook().cells.push(new CellModel());
  }

  onRunAll(): void {
    this.cellComps.forEach(cell => cell.run());
  }

  onClearAll(){
    this.cellComps.forEach(cell => cell.clear());
  }

  onAddAbove(id: string){
    this.notebookService.addAbove(id);
  }

  onAddBelow(id: string){
    this.notebookService.addBelow(id);
  }

  onClone(id: string){
    this.notebookService.clone(id);
  }

  onRemove(id: string){
    this.notebookService.remove(id);
  }

  onLoad(method: string){
    this.notebookService.readNotebook(method);
  }

  onStore(method: string){
    this.notebookService.writeNotebook(method);
  }
}
