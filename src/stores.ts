
import { persisted } from 'svelte-local-storage-store'
import type { Checklist } from './lib/checklist/checklist'
import type { Progress } from './lib/progress/progress'

export const checklist = persisted('checklist', {
  checklist: [] as Checklist,
  doneDates: []  // "YYYY-MM-DD"
})

export const progress = persisted('progress', [] as Progress)