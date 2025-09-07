import { CellModel } from './cell.model';

export class NotebookModel {
  metadata = {
    "kernel_info": { "name": "typescript" },
    "language_info": { "name": "typescript", "version": "2022", "codemirror_mode": "typescript" },
    "title": ""
  }

  nbformat = 4;
  nbformat_minor = 0;

  cells: any[] = [];
}
