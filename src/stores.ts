
import { persisted } from 'svelte-local-storage-store'
import type { Checklist } from './lib/checklist/checklist'
import type { ProgressStore } from './lib/progress/progress'

export const checklist = persisted('checklist', {
  checklist: [] as Checklist,
  doneDates: []  // "YYYY-MM-DD"
})

export const progress = persisted('progress', <ProgressStore>{
  tree: [],
  settings: {
    showDescription: false,
    expand: false
  },
})