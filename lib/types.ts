// Core data types for the Forms → Tables Workspaces App

export interface Workspace {
  id: string
  name: string
  settings: {
    fontSize: "small" | "medium" | "large"
    alignment: "left" | "center" | "right"
  }
  createdAt: Date
}

export interface List {
  id: string
  workspaceId: string
  name: string
  order: number
  createdAt: Date
}

export interface Table {
  id: string
  listId: string
  formId: string
  name: string
  selectedFieldIds: string[]
  primaryKeyFieldId: string
  isLocked: boolean
  createdAt: Date
}

export interface Form {
  id: string
  name: string
  fields: Field[]
  createdAt: Date
}

export interface Field {
  id: string
  formId: string
  name: string
  type: "text" | "number" | "date" | "boolean" | "enum"
  options?: string[] // For enum fields
}

export interface Submission {
  id: string
  formId: string
  timestamp: Date
  values: Record<string, any>
}

export interface TimeRange {
  start: Date
  end: Date
  preset?: string
}

export interface TableFilter {
  fieldId: string
  operator: string
  value: any
}

export interface TableSort {
  fieldId: string
  direction: "asc" | "desc"
}
