export interface ChecklistStore {
  checklist: Checklist;
  doneDates: string[]; // "YYYY-MM-DD"
}

export interface ChecklistItem {
  text: string;
  actionUrl: string | undefined
}

export type Checklist = ChecklistItem[]

export const defaultChecklistStore: ChecklistStore = {
  checklist: [],
  doneDates: []
}