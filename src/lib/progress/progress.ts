import type { TreeNodeId } from "carbon-components-svelte/types/TreeView/TreeView.svelte";

export interface ProgressStore {
  tree: ProgressTree[];
  settings: ProgressSettings
}
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

export interface AddProgressArgs {
  progress: ProgressTree;
  parent?: ProgressTree
}

export interface EditProgressArgs {
  id: TreeNodeId
  name: string
  description: string
  current: number
  total: number
}

export interface RemoveProgressArgs {
  progress: ProgressTree
}

export interface ProgressTreeMappingChangeArgs {
  mapping: Map<TreeNodeId, ProgressTree>
  parentMapping: Map<TreeNodeId, TreeNodeId> // Child id to parent id

}

export interface ProgressSettings {
  showDescription: boolean,
  expand: boolean
}


export const defaultProgressStore: ProgressStore = {
  tree: [],
  settings: {
    showDescription: false,
    expand: false
  },
}
