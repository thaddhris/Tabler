"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ChevronDown, Settings, Move, Eye, GripVertical, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MoveTableDialog } from "./move-table-dialog"
import { mockTables, mockForms, mockSubmissions } from "@/lib/mock-data"
import type { List, Workspace } from "@/lib/types"

interface EnhancedListViewProps {
  list: List
  workspaces: Workspace[]
  currentWorkspaceId: string
  savedSelections?: string[]
  onTableSelect: (tableId: string) => void
  onMultiView: (tableIds: string[]) => void
  onMoveTable: (tableId: string, newWorkspaceId: string, newListId: string) => void
  onReorderTables: (tableIds: string[]) => void
}

export function EnhancedListView({
  list,
  workspaces,
  currentWorkspaceId,
  savedSelections = [],
  onTableSelect,
  onMultiView,
  onMoveTable,
  onReorderTables,
}: EnhancedListViewProps) {
  const [selectedTableIds, setSelectedTableIds] = useState<string[]>(savedSelections)
  const [expandedCards, setExpandedCards] = useState<string[]>([])
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  useEffect(() => {
    setSelectedTableIds(savedSelections)
  }, [savedSelections])

  const listTables = mockTables.filter((t) => t.listId === list.id)

  const handleTableClick = (tableId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    let newSelection: string[]
    if (selectedTableIds.includes(tableId)) {
      newSelection = selectedTableIds.filter((id) => id !== tableId)
    } else {
      newSelection = [...selectedTableIds, tableId]
    }
    setSelectedTableIds(newSelection)

    if (newSelection.length > 1) {
      setTimeout(() => onMultiView(newSelection), 100)
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allTableIds = listTables.map((t) => t.id)
      setSelectedTableIds(allTableIds)
      // Trigger multi-view with all tables
      setTimeout(() => onMultiView(allTableIds), 100)
    } else {
      // Clear all selections and show last selected table if any
      const lastSelected = selectedTableIds.length > 0 ? selectedTableIds[selectedTableIds.length - 1] : null
      setSelectedTableIds([])
      if (lastSelected) {
        setTimeout(() => onTableSelect(lastSelected), 100)
      }
    }
  }

  const handleMultiView = () => {
    if (selectedTableIds.length > 0) {
      onMultiView(selectedTableIds)
    }
  }

  const toggleCardExpansion = (tableId: string) => {
    if (expandedCards.includes(tableId)) {
      setExpandedCards(expandedCards.filter((id) => id !== tableId))
    } else {
      setExpandedCards([...expandedCards, tableId])
    }
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    setDragOverIndex(index)
  }

  const handleDragEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      const newOrder = [...listTables]
      const [draggedItem] = newOrder.splice(draggedIndex, 1)
      newOrder.splice(dragOverIndex, 0, draggedItem)
      onReorderTables(newOrder.map((t) => t.id))
    }
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    handleDragEnd()
  }

  const allSelected = listTables.length > 0 && selectedTableIds.length === listTables.length
  const someSelected = selectedTableIds.length > 0 && selectedTableIds.length < listTables.length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-balance">{list.name}</h1>
          <p className="text-muted-foreground mt-1">
            {listTables.length} monitoring table{listTables.length !== 1 ? "s" : ""} • IoT Device Data
          </p>
          {selectedTableIds.length > 1 && (
            <p className="text-xs text-primary mt-1">✓ Auto Multi-View active with {selectedTableIds.length} tables</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {selectedTableIds.length > 0 && (
            <Badge variant="secondary" className="px-3 py-1">
              <Users className="w-3 h-3 mr-1" />
              {selectedTableIds.length} selected
            </Badge>
          )}
          <Button
            onClick={handleMultiView}
            disabled={selectedTableIds.length === 0}
            size="lg"
            className={selectedTableIds.length > 0 ? "bg-primary hover:bg-primary/90" : ""}
          >
            <Eye className="w-4 h-4 mr-2" />
            {selectedTableIds.length > 0 ? `Multi-View (${selectedTableIds.length})` : "Multi-View"}
          </Button>
        </div>
      </div>

      {listTables.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-muted/50 to-muted/30 rounded-lg border">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Click tables to select for multi-view</span>
            {selectedTableIds.length > 0 && (
              <Badge variant="outline" className="ml-2">
                {selectedTableIds.length} of {listTables.length}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {listTables.length > 1 && (
              <>
                <Button variant="ghost" size="sm" onClick={() => handleSelectAll(true)} className="text-xs h-6 px-2">
                  Select All
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleSelectAll(false)} className="text-xs h-6 px-2">
                  Clear All
                </Button>
              </>
            )}
            {selectedTableIds.length > 1 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground ml-2">
                <Eye className="w-4 h-4" />
                <span>Auto Multi-View Ready</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {listTables.map((table, index) => {
          const form = mockForms.find((f) => f.id === table.formId)
          const submissionCount = mockSubmissions.filter((s) => s.formId === table.formId).length
          const isExpanded = expandedCards.includes(table.id)
          const isSelected = selectedTableIds.includes(table.id)

          return (
            <Card
              key={table.id}
              className={`hover:shadow-md transition-all duration-200 cursor-pointer ${
                isSelected ? "ring-2 ring-primary bg-primary/5" : ""
              } ${draggedIndex === index ? "opacity-50 scale-95" : ""} ${
                dragOverIndex === index ? "border-primary" : ""
              }`}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              onDrop={handleDrop}
              onClick={(e) => handleTableClick(table.id, e)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="cursor-grab active:cursor-grabbing">
                      <GripVertical className="w-4 h-4 text-muted-foreground mt-1" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {table.name}
                        {isSelected && (
                          <Badge variant="secondary" className="text-xs">
                            <Eye className="w-3 h-3 mr-1" />
                            Selected
                          </Badge>
                        )}
                      </CardTitle>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleCardExpansion(table.id)
                    }}
                  >
                    <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  <p>Device: {form?.name}</p>
                  <p>Sensor Fields: {table.selectedFieldIds.length}</p>
                  <p>Data Entries: {submissionCount}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    PK: {form?.fields.find((f) => f.id === table.primaryKeyFieldId)?.name}
                  </Badge>
                  {table.isLocked && <Badge variant="secondary">Locked</Badge>}
                </div>

                {isExpanded && (
                  <div className="pt-3 border-t space-y-3">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Selected Sensor Fields</h4>
                      <div className="flex flex-wrap gap-1">
                        {form?.fields
                          .filter((f) => table.selectedFieldIds.includes(f.id))
                          .map((field) => (
                            <Badge key={field.id} variant="outline" className="text-xs">
                              {field.name}
                            </Badge>
                          ))}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">Created: {table.createdAt.toLocaleDateString()}</div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button size="sm" onClick={() => onTableSelect(table.id)} className="flex-1">
                    <Eye className="w-4 h-4 mr-2" />
                    Open Table
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                  <MoveTableDialog
                    table={table}
                    workspaces={workspaces}
                    currentWorkspaceId={currentWorkspaceId}
                    currentListId={list.id}
                    onMoveTable={onMoveTable}
                    trigger={
                      <Button variant="outline" size="sm">
                        <Move className="w-4 h-4" />
                      </Button>
                    }
                  />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {listTables.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No tables in this list yet.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Create a table using the "Add Table" button in the sidebar when you select this list.
          </p>
        </div>
      )}
    </div>
  )
}
