"use client"

import { useState } from "react"
import { ResizableSidebar } from "@/components/resizable-sidebar"
import { LeftNavigationBar } from "@/components/left-navigation-bar"
import { TopHeader } from "@/components/top-header"
import { CenterCanvas } from "@/components/center-canvas"
import { mockWorkspaces, mockTables, mockForms, mockLists } from "@/lib/mock-data"
import type { TimeRange, Workspace, Table } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

type ViewMode = "empty" | "table" | "multi-view"
type AppMode = "edit" | "view"

export default function HomePage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(() => {
    if (mockWorkspaces.length === 0) {
      const defaultWorkspace: Workspace = {
        id: "ws-default",
        name: "My Workspace",
        settings: {
          fontSize: "medium",
          alignment: "left",
        },
        createdAt: new Date(),
      }
      return [defaultWorkspace]
    }
    return mockWorkspaces
  })
  const [forms, setForms] = useState(mockForms)
  const [tables, setTables] = useState(mockTables)
  const [lists, setLists] = useState(mockLists)
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState(() => {
    if (mockWorkspaces.length === 0) {
      return "ws-default"
    }
    return mockWorkspaces[0]?.id || "ws-default"
  })
  const [currentTableId, setCurrentTableId] = useState<string | null>(null)
  const [multiViewMode, setMultiViewMode] = useState(false)
  const [selectedTableIds, setSelectedTableIds] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>("empty")
  const [globalTimeRange, setGlobalTimeRange] = useState<TimeRange>({
    start: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
    end: new Date(),
    preset: "Last 24h",
  })
  const [sidebarWidth, setSidebarWidth] = useState(320) // Added sidebar width state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false) // Added sidebar collapse state management
  const [appMode, setAppMode] = useState<AppMode>("edit")
  const [currentViewName, setCurrentViewName] = useState<string | null>(null) // Added state to track current view name

  const currentWorkspace = workspaces.find((w) => w.id === currentWorkspaceId)

  const currentTable = currentTableId
    ? {
        ...tables.find((t) => t.id === currentTableId),
        workspace: currentWorkspace,
        listName: lists.find((l) => l.id === tables.find((t) => t.id === currentTableId)?.listId)?.name,
      }
    : null

  const selectedTables = tables
    .filter((t) => selectedTableIds.includes(t.id))
    .map((table) => ({
      ...table,
      workspace: currentWorkspace,
    }))

  const handleTableSelect = (tableId: string) => {
    setCurrentTableId(tableId)
    if (multiViewMode) {
      // In multi-view mode, add to selection instead of replacing
      if (!selectedTableIds.includes(tableId)) {
        const newSelection = [...selectedTableIds, tableId]
        setSelectedTableIds(newSelection)
        setViewMode("multi-view")
      }
    } else {
      setViewMode("table")
      setSelectedTableIds([])
    }
  }

  const handleMultiViewToggle = (enabled: boolean) => {
    setMultiViewMode(enabled)
    if (enabled) {
      // If we have a current table, add it to multi-view selection
      if (currentTableId && !selectedTableIds.includes(currentTableId)) {
        setSelectedTableIds([currentTableId])
        setViewMode("multi-view")
      } else if (selectedTableIds.length > 0) {
        setViewMode("multi-view")
      }
    } else {
      // Exit multi-view mode
      if (currentTableId) {
        setViewMode("table")
      } else {
        setViewMode("empty")
      }
    }
  }

  const handleMultiViewTableToggle = (tableId: string, selected: boolean) => {
    if (selected) {
      const newSelection = [...selectedTableIds, tableId]
      setSelectedTableIds(newSelection)
      setViewMode("multi-view")
      // Also set as current table
      setCurrentTableId(tableId)
    } else {
      const newSelection = selectedTableIds.filter((id) => id !== tableId)
      setSelectedTableIds(newSelection)
      if (newSelection.length === 0) {
        setViewMode("empty")
        setCurrentTableId(null)
      } else if (tableId === currentTableId) {
        // If removing current table, set first remaining as current
        setCurrentTableId(newSelection[0])
      }
    }
  }

  const handleRemoveFromMultiView = (tableId: string) => {
    handleMultiViewTableToggle(tableId, false)
  }

  const handleReorderMultiViewTables = (tableIds: string[]) => {
    setSelectedTableIds(tableIds)
  }

  const handleCreateWorkspace = (name: string) => {
    const newWorkspace: Workspace = {
      id: `ws-${Date.now()}`,
      name,
      settings: {
        fontSize: "medium",
        alignment: "left",
      },
      createdAt: new Date(),
    }
    setWorkspaces([...workspaces, newWorkspace])
    setCurrentWorkspaceId(newWorkspace.id)
  }

  const handleWorkspaceSettingsUpdate = (workspaceId: string, settings: any) => {
    console.log("[v0] Updating workspace settings:", { workspaceId, settings })

    setWorkspaces((prevWorkspaces) => {
      const updatedWorkspaces = prevWorkspaces.map((w) =>
        w.id === workspaceId ? { ...w, settings: { ...w.settings, ...settings } } : w,
      )

      console.log("[v0] Updated workspaces:", updatedWorkspaces)
      return updatedWorkspaces
    })

    // Force re-render of tables by updating their workspace reference
    setTables((prevTables) => [...prevTables])
  }

  const handleUpdateWorkspace = (id: string, updates: Partial<Workspace>) => {
    console.log("[v0] Updating workspace:", { id, updates })
    setWorkspaces(workspaces.map((w) => (w.id === id ? { ...w, ...updates } : w)))
  }

  const handleCreateTable = (listId: string, name?: string) => {
    const newTable: Table = {
      id: `table-${Date.now()}`,
      listId,
      formId: "", // Will be set in inline configuration
      name: name || "New Table",
      selectedFieldIds: [],
      primaryKeyFieldId: "",
      timeMapping: { startFieldId: "", endFieldId: "" },
      isLocked: false,
      createdAt: new Date(),
    }
    const updatedTables = [...tables, newTable]
    setTables(updatedTables)
    setCurrentTableId(newTable.id)
    setViewMode("table")

    setTimeout(() => {
      setTables([...updatedTables])
    }, 0)

    return newTable.id
  }

  const handleCreateList = (workspaceId: string, name: string) => {
    const newList = {
      id: `list-${Date.now()}`,
      workspaceId,
      name,
      order: lists.filter((l) => l.workspaceId === workspaceId).length,
      createdAt: new Date().toISOString(),
    }
    setLists([...lists, newList])
    return newList.id
  }

  const handleUpdateTable = (id: string, updates: Partial<Table>) => {
    setTables(tables.map((t) => (t.id === id ? { ...t, ...updates } : t)))
  }

  const handleMoveTable = (tableId: string, newListId: string) => {
    setTables(tables.map((t) => (t.id === tableId ? { ...t, listId: newListId } : t)))
    // Show success feedback (could add toast here)
    console.log(`Moved table ${tableId} to list ${newListId}`)
  }

  const handleMoveList = (listId: string, newWorkspaceId: string) => {
    setLists(lists.map((l) => (l.id === listId ? { ...l, workspaceId: newWorkspaceId } : l)))
    // Show success feedback (could add toast here)
    console.log(`Moved list ${listId} to workspace ${newWorkspaceId}`)
  }

  const handleDeleteWorkspace = (workspaceId: string) => {
    // Delete all lists and tables in this workspace first
    const workspaceLists = lists.filter((l) => l.workspaceId === workspaceId)
    const workspaceListIds = workspaceLists.map((l) => l.id)
    const workspaceTables = tables.filter((t) => workspaceListIds.includes(t.listId))

    // Remove tables
    setTables(tables.filter((t) => !workspaceListIds.includes(t.listId)))
    // Remove lists
    setLists(lists.filter((l) => l.workspaceId !== workspaceId))
    // Remove workspace
    const updatedWorkspaces = workspaces.filter((w) => w.id !== workspaceId)
    setWorkspaces(updatedWorkspaces)

    // If deleting current workspace, switch to first available
    if (workspaceId === currentWorkspaceId && updatedWorkspaces.length > 0) {
      setCurrentWorkspaceId(updatedWorkspaces[0].id)
    }

    // Reset view if current table was deleted
    if (workspaceTables.some((t) => t.id === currentTableId)) {
      setCurrentTableId(null)
      setViewMode("empty")
      setSelectedTableIds([])
    }
  }

  const handleDeleteList = (listId: string) => {
    // Delete all tables in this list first
    const listTables = tables.filter((t) => t.listId === listId)
    setTables(tables.filter((t) => t.listId !== listId))
    setLists(lists.filter((l) => l.id !== listId))

    // Reset view if current table was deleted
    if (listTables.some((t) => t.id === currentTableId)) {
      setCurrentTableId(null)
      setViewMode("empty")
      setSelectedTableIds([])
    }
  }

  const handleDeleteTable = (tableId: string) => {
    setTables(tables.filter((t) => t.id !== tableId))

    // Reset view if current table was deleted
    if (tableId === currentTableId) {
      setCurrentTableId(null)
      setViewMode("empty")
    }

    // Remove from multi-view selection
    setSelectedTableIds(selectedTableIds.filter((id) => id !== tableId))
  }

  const handleLoadView = (tableIds: string[]) => {
    console.log("[v0] Loading view with tables:", tableIds)
    setSelectedTableIds(tableIds)
    if (tableIds.length === 0) {
      setViewMode("empty")
      setCurrentTableId(null)
    } else {
      setViewMode("multi-view")
      // Set the first table as current if no current table is selected
      if (!currentTableId || !tableIds.includes(currentTableId)) {
        setCurrentTableId(tableIds[0])
      }
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {!isSidebarCollapsed ? (
        <ResizableSidebar
          workspaceId={currentWorkspaceId}
          onWidthChange={setSidebarWidth}
          defaultWidth={320}
          minWidth={200}
          maxWidth={600}
        >
          <LeftNavigationBar
            workspaces={workspaces}
            tables={tables}
            lists={lists}
            currentWorkspaceId={currentWorkspaceId}
            currentTableId={currentTableId}
            multiViewMode={multiViewMode}
            selectedTableIds={selectedTableIds}
            timeRange={globalTimeRange}
            sidebarWidth={sidebarWidth}
            isCollapsed={false}
            appMode={appMode}
            currentViewName={currentViewName}
            onCollapse={() => setIsSidebarCollapsed(true)}
            onWorkspaceSelect={setCurrentWorkspaceId}
            onTableSelect={handleTableSelect}
            onMultiViewTableToggle={handleMultiViewTableToggle}
            onCreateWorkspace={handleCreateWorkspace}
            onCreateList={handleCreateList}
            onCreateTable={handleCreateTable}
            onUpdateWorkspace={handleUpdateWorkspace}
            onMoveTable={handleMoveTable}
            onMoveList={handleMoveList}
            onWorkspaceSettingsUpdate={handleWorkspaceSettingsUpdate}
            onDeleteWorkspace={handleDeleteWorkspace}
            onDeleteList={handleDeleteList}
            onDeleteTable={handleDeleteTable}
          />
        </ResizableSidebar>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsSidebarCollapsed(false)}
          className="fixed top-16 left-2 z-50 h-8 w-8 p-0 bg-background border shadow-lg hover:bg-accent rounded-full"
          title="Expand sidebar"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}

      <div className="flex-1 flex flex-col">
        {currentWorkspace && (
          <TopHeader
            workspace={currentWorkspace}
            timeRange={globalTimeRange}
            multiViewMode={multiViewMode}
            currentTable={currentTable}
            appMode={appMode}
            selectedTableIds={selectedTableIds}
            onAppModeChange={setAppMode}
            onTimeRangeChange={setGlobalTimeRange}
            onMultiViewToggle={handleMultiViewToggle}
            onWorkspaceUpdate={(updates) => handleUpdateWorkspace(currentWorkspace.id, updates)}
            onWorkspaceSettingsUpdate={(settings) => handleWorkspaceSettingsUpdate(currentWorkspace.id, settings)}
            onLoadView={handleLoadView}
            onCurrentViewChange={setCurrentViewName}
          />
        )}

        <CenterCanvas
          viewMode={viewMode}
          currentTable={currentTable}
          selectedTables={selectedTables}
          timeRange={globalTimeRange}
          currentWorkspace={currentWorkspace}
          appMode={appMode}
          onUpdateTable={handleUpdateTable}
          onTableSelect={handleTableSelect}
          onRemoveTable={handleRemoveFromMultiView}
          onReorderTables={handleReorderMultiViewTables}
          selectedTableIds={selectedTableIds}
          onLoadView={handleLoadView}
        />
      </div>
    </div>
  )
}
