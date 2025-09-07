import { Injectable } from "@angular/core";
import { CellModel } from '../models/cell.model';
import { NotebookModel } from "../models/notebook.model";

@Injectable({
  providedIn: "root"
})
export class NotebookService {
  instance: NotebookModel = new NotebookModel();

  constructor(){
    this.instance = new NotebookModel();
  }

  public getInstance(): NotebookModel {
    this.instance ??= new NotebookModel();
    return this.instance;
  }

  addCell(){
    this.instance.cells.push(new CellModel());
  }

  addAbove(id: string){
    const index = this.instance.cells.findIndex(c => c.id === id);
    this.instance.cells.splice(index > 0 ? index - 1 : 0, 0, new CellModel());
  }

  addBelow(id: string){
    const index = this.instance.cells.findIndex(c => c.id === id);
    this.instance.cells.splice(index + 1, 0, new CellModel());
  }

  clone(id: string){
    const index = this.instance.cells.findIndex(c => c.id === id);
    const original = this.instance.cells[index];
    const clone = new CellModel();
    clone.source = original.source;
    this.instance.cells.splice(index + 1, 0, clone);
  }

  remove(id: string){
    const index = this.instance.cells.findIndex(c => c.id === id);
    this.instance.cells.splice(index, 1);
  }

  public readNotebook(title: string): NotebookModel {
    const str = localStorage.getItem(title) ?? '';
    const obj = JSON.parse(str);
    this.instance.metadata.title = obj.metadata.title ?? 'Untitled Notebook';
    this.instance.cells = obj.cells.map((c: CellModel) => {
      let cell = new CellModel();

      switch(c.cell_type){
        case 'markdown':
          cell.cell_type = "markdown"
          break;

        case 'code':
          cell.cell_type = c.metadata.language; 
          cell.execution_count = c.execution_count;
          cell.outputs = c.outputs;
          break;
      }

      cell.source = c.source;

      return cell;
    });

    return this.instance;
  }

  public writeNotebook(): void {
    const str = JSON.stringify({
      metadata: {
        title: this.instance.metadata.title ?? '',
        kernel_info: { name: "javascript" },
        language_info: { name: "javascript", version: "2022", codemirror_mode: "javascript" }
      },
      nbformat: 4,
      nbformat_minor: 0,
      cells: this.instance.cells.map(c => {
        let cell = new CellModel();
        
        if(c.cell_type === 'markdown'){
          cell.cell_type = 'markdown'
        }else{
          cell.cell_type = 'code';
          cell.metadata.language = c.cell_type
        }

        cell.source = c.source;

        return cell;
      })
    });

    localStorage.setItem(this.instance.metadata.title, str);
  }
}