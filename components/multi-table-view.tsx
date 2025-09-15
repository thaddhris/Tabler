"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { GripVertical, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EnhancedTableView } from "@/components/enhanced-table-view"
import { ExportDropdown } from "@/components/export-dropdown"
import { mockSubmissions, mockForms } from "@/lib/mock-data"
import type { Table, TimeRange } from "@/lib/types"
import type { ExportData } from "@/lib/export-utils"

interface MultiTableViewProps {
  tables: Table[]
  timeRange: TimeRange
  workspace?: any
  appMode?: "edit" | "view"
  onUpdateTable: (id: string, updates: Partial<Table>) => void
  onTableSelect: (tableId: string) => void
  onRemoveTable?: (tableId: string) => void
  onReorderTables?: (tableIds: string[]) => void
  selectedTableIds?: string[]
}

export function MultiTableView({
  tables,
  timeRange,
  workspace,
  appMode = "edit",
  onUpdateTable,
  onTableSelect,
  onRemoveTable,
  onReorderTables,
  selectedTableIds = [],
}: MultiTableViewProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const selectedTables = new Set(selectedTableIds)

  const exportData = useMemo((): ExportData[] => {
    return tables.map((table) => {
      const form = mockForms.find((f) => f.id === table.formId)
      if (!form) return { tableName: table.name, headers: [], rows: [] }

      const selectedFields = form.fields.filter((field) => table.selectedFieldIds.includes(field.id))

      const headers = selectedFields.map((field) => field.name)

      const submissions = mockSubmissions
        .filter((sub) => sub.formId === table.formId)
        .filter((sub) => {
          const subTime = new Date(sub.timestamp)
          return subTime >= timeRange.start && subTime <= timeRange.end
        })

      const rows = submissions.map((submission) => selectedFields.map((field) => submission.values[field.id] || null))

      return {
        tableName: table.name,
        headers,
        rows,
      }
    })
  }, [tables, timeRange])

  const handleSelectAll = () => {
    if (onReorderTables) {
      onReorderTables(tables.map((t) => t.id))
    }
  }

  const handleClearAll = () => {
    if (onReorderTables) {
      onReorderTables([])
    }
  }

  const handleTableClick = (tableId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const currentSelected = new Set(selectedTableIds)
    if (currentSelected.has(tableId)) {
      currentSelected.delete(tableId)
    } else {
      currentSelected.add(tableId)
    }
    if (onReorderTables) {
      onReorderTables(Array.from(currentSelected))
    }
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/html", "")
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null)
      setDragOverIndex(null)
      return
    }

    const newTables = [...tables]
    const draggedTable = newTables[draggedIndex]

    newTables.splice(draggedIndex, 1)

    const insertIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex
    newTables.splice(insertIndex, 0, draggedTable)

    if (onReorderTables) {
      onReorderTables(newTables.map((t) => t.id))
    }

    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        {tables.length === 0 ? (
          <div className="flex-1 flex items-center justify-center bg-muted/20 min-h-[400px]">
            <div className="text-center space-y-4 max-w-md">
              <h3 className="text-lg font-semibold text-muted-foreground">Ready to Create Views</h3>
              <p className="text-muted-foreground">
                Select tables from the sidebar to create a multi-table view. You can then save this combination as a
                view using the controls in the header above.
              </p>
              <div className="text-sm text-muted-foreground/80">
                💡 Tip: Use the + button in the header to start creating a new view
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 p-6" id="multiview-print-container">
            <div className="flex items-center justify-between sticky top-0 bg-background z-10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">MultiView</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  Viewing {tables.length} table{tables.length !== 1 ? "s" : ""} • Click to select • Drag to reorder
                </p>
                {tables.length > 1 && (
                  <div className="flex items-center gap-2 mt-2">
                    <Button variant="ghost" size="sm" onClick={handleSelectAll} className="text-xs h-6 px-2">
                      Select All
                    </Button>
                    <span className="text-muted-foreground">•</span>
                    <Button variant="ghost" size="sm" onClick={handleClearAll} className="text-xs h-6 px-2">
                      Clear All
                    </Button>
                    {selectedTables.size > 0 && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {selectedTables.size} selected
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <ExportDropdown
                  data={exportData}
                  filename={`multiview-${new Date().toISOString().split("T")[0]}`}
                  printContainerId="multiview-print-container"
                />
                <Badge variant="secondary" className="flex items-center gap-1">
                  {tables.length} Tables
                </Badge>
              </div>
            </div>

            {tables.map((table, index) => (
              <div
                key={table.id}
                className={`
                  border rounded-lg overflow-hidden transition-all duration-200 mb-8 ${appMode === "view" ? "" : "cursor-pointer"}
                  ${draggedIndex === index ? "opacity-50 scale-95" : ""}
                  ${dragOverIndex === index ? "border-primary shadow-lg" : ""}
                  ${selectedTables.has(table.id) ? "ring-2 ring-primary bg-primary/5 border-primary" : appMode === "view" ? "" : "hover:border-primary/50"}
                `}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                onClick={appMode === "view" ? undefined : (e) => handleTableClick(table.id, e)}
              >
                <div
                  className={`bg-muted/50 px-4 py-3 border-b flex items-center justify-between ${
                    selectedTables.has(table.id) ? "bg-primary/10 border-primary/20" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="cursor-grab active:cursor-grabbing p-1 hover:bg-accent rounded"
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        {table.name}
                        {selectedTables.has(table.id) && (
                          <Badge variant="default" className="text-xs bg-primary text-primary-foreground">
                            Selected
                          </Badge>
                        )}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Table {index + 1} of {tables.length}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onTableSelect(table.id)
                      }}
                      className="text-xs"
                    >
                      View Solo
                    </Button>
                    {onRemoveTable && appMode !== "view" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          onRemoveTable(table.id)
                        }}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="min-h-[400px] overflow-hidden">
                  <EnhancedTableView
                    table={table}
                    timeRange={timeRange}
                    workspace={workspace}
                    appMode={appMode}
                    onUpdateTable={(updates) => onUpdateTable(table.id, updates)}
                    compact={true}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
