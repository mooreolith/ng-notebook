export interface OutputInterface {
  output_type: string,
  name: "stdout" | "stderr",
  text: string
}

export class CellModel {
  id?: string = Math.random().toString();
  cell_type: string = "javascript";
  execution_count: null | number = 0;
  metadata = {language: "javascript"};
  source: string = "";
  outputs: OutputInterface[] = [];
}