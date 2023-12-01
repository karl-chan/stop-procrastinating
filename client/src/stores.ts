
import { persisted } from 'svelte-local-storage-store'
import { defaultChecklistStore, type ChecklistStore } from './lib/checklist/checklist'
import { defaultDecisionStore, type DecisionStore } from './lib/decision/decision'
import { defaultProgressStore, type ProgressStore } from './lib/progress/progress'

export const store = persisted('store', <Store>{
  checklist: defaultChecklistStore,
  progress: defaultProgressStore,
  decisions: defaultDecisionStore,
})

interface Store {
  checklist: ChecklistStore;
  progress: ProgressStore;
  decisions: DecisionStore;
}