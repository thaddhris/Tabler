"use client"

import { EnhancedTableView } from "@/components/enhanced-table-view"
import { MultiTableView } from "@/components/multi-table-view"
import type { Table, TimeRange, Workspace } from "@/lib/types"

interface CenterCanvasProps {
  viewMode: "empty" | "table" | "multi-view"
  currentTable: Table | null
  selectedTables: Table[]
  timeRange: TimeRange
  currentWorkspace?: Workspace // Added workspace prop to pass settings to tables
  appMode: "edit" | "view" // Added appMode prop to control configuration visibility
  onUpdateTable: (id: string, updates: Partial<Table>) => void
  onTableSelect: (tableId: string) => void
  onRemoveTable?: (tableId: string) => void
  onReorderTables?: (tableIds: string[]) => void
  selectedTableIds?: string[]
  onLoadView?: (tableIds: string[]) => void
}

export function CenterCanvas({
  viewMode,
  currentTable,
  selectedTables,
  timeRange,
  currentWorkspace, // Added workspace parameter
  appMode, // Added appMode parameter
  onUpdateTable,
  onTableSelect,
  onRemoveTable,
  onReorderTables,
  selectedTableIds = [],
  onLoadView,
}: CenterCanvasProps) {
  if (viewMode === "empty") {
    return (
      <main className="flex-1 flex items-center justify-center bg-muted/20">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-muted-foreground">Please configure a table to get started</h2>
          <p className="text-muted-foreground">
            Create a new table from the navigation bar or select an existing one to begin analyzing your IoT device
            data.
          </p>
        </div>
      </main>
    )
  }

  if (viewMode === "multi-view") {
    return (
      <main className="flex-1 overflow-hidden">
        <MultiTableView
          tables={selectedTables}
          timeRange={timeRange}
          workspace={currentWorkspace} // Pass workspace settings to multi-table view
          appMode={appMode} // Pass appMode to multi-table view
          onUpdateTable={onUpdateTable}
          onTableSelect={onTableSelect}
          onRemoveTable={onRemoveTable}
          onReorderTables={onReorderTables}
          selectedTableIds={selectedTableIds}
          onLoadView={onLoadView}
        />
      </main>
    )
  }

  if (viewMode === "table" && currentTable) {
    return (
      <main className="flex-1 overflow-hidden">
        <EnhancedTableView
          table={currentTable}
          timeRange={timeRange}
          workspace={currentWorkspace} // Pass workspace settings to single table view
          appMode={appMode} // Pass appMode to control device config visibility
          onUpdateTable={(updates) => onUpdateTable(currentTable.id, updates)}
        />
      </main>
    )
  }

  return null
}
