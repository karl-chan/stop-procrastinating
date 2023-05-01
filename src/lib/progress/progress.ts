export interface ProgressLeaf {
  current: number
  total: number
}

export interface ProgressTree {
  name: string,
  description: string,
  leaf?: ProgressLeaf
  children?: ProgressTree[]
}

export type Progress = ProgressTree[];

export interface AddProgressArgs {
  progress: ProgressTree;
  parent?: ProgressTree
}

export interface RemoveProgressArgs {
  progress: ProgressTree
}
