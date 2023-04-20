
import { persisted } from 'svelte-local-storage-store'

export const checklist = persisted('checklist', {
  checklist: [],
  doneDates: []  // "YYYY-MM-DD"
})