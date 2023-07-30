export interface DecisionStore {
  workbooks: DecisionWorkbook[];
}

export interface DecisionWorkbook {
  name: string
  matrix: DecisionMatrix
}

export interface DecisionMatrix {
  rows: string[]
  columns: string[]
  cells: number[][]
}