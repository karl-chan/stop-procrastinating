
import { persisted } from 'svelte-persisted-store';
import { defaultChecklistStore, type ChecklistStore } from './lib/checklist/checklist';
import { defaultDecisionStore, type DecisionStore } from './lib/decision/decision';
import { defaultProgressStore, type ProgressStore } from './lib/progress/progress';

interface Store {
  checklist: ChecklistStore;
  progress: ProgressStore;
  decisions: DecisionStore;
}

export const defaultStore: Store = {
  checklist: defaultChecklistStore,
  progress: defaultProgressStore,
  decisions: defaultDecisionStore,
}

export const store = persisted('store', defaultStore)