"use client"
import { useState, useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { GlobalTimePicker } from "@/components/global-time-picker"
import { ThemeToggle } from "@/components/theme-toggle"
import { ModeToggle } from "@/components/mode-toggle"
import { Plus, Save, Edit2, Trash2 } from "lucide-react"
import type { Workspace, TimeRange } from "@/lib/types"

type TitleDisplayMode = "table-name" | "device-id" | "device-name"

interface SavedView {
  id: string
  name: string
  tableIds: string[]
  createdAt: Date
}

interface TopHeaderProps {
  workspace: Workspace
  timeRange: TimeRange
  multiViewMode: boolean
  currentTable?: { id: string; name: string; listName?: string; formId?: string } | null
  appMode: "edit" | "view"
  selectedTableIds?: string[]
  onAppModeChange: (mode: "edit" | "view") => void
  onTimeRangeChange: (range: TimeRange) => void
  onMultiViewToggle: (enabled: boolean) => void
  onWorkspaceUpdate: (updates: Partial<Workspace>) => void
  onWorkspaceSettingsUpdate?: (workspaceId: string, settings: any) => void
  onLoadView?: (tableIds: string[]) => void
  onCurrentViewChange?: (viewName: string | null) => void
}

export function TopHeader({
  workspace,
  timeRange,
  multiViewMode,
  currentTable,
  appMode,
  selectedTableIds = [],
  onAppModeChange,
  onTimeRangeChange,
  onMultiViewToggle,
  onWorkspaceUpdate,
  onWorkspaceSettingsUpdate,
  onLoadView,
  onCurrentViewChange,
}: TopHeaderProps) {
  const [savedViews, setSavedViews] = useState<SavedView[]>([])
  const [activeViewId, setActiveViewId] = useState<string | null>(null)
  const [saveViewDialogOpen, setSaveViewDialogOpen] = useState(false)
  const [newViewName, setNewViewName] = useState("")
  const [editingViewId, setEditingViewId] = useState<string | null>(null)
  const [editingViewName, setEditingViewName] = useState("")
  const [saveNotification, setSaveNotification] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Clear any existing saved views to start fresh
      localStorage.removeItem("multiview-saved-views")
      setSavedViews([])
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("multiview-saved-views", JSON.stringify(savedViews))
    }
  }, [savedViews])

  useEffect(() => {
    if (saveNotification) {
      const timer = setTimeout(() => {
        setSaveNotification(null)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [saveNotification])

  const handleCreateNewView = () => {
    console.log("[v0] Creating new view from header")
    setActiveViewId(null)
    if (onCurrentViewChange) {
      onCurrentViewChange(null)
    }
    if (onLoadView) {
      onLoadView([])
    }
  }

  const handleSaveView = () => {
    const currentTableIds = selectedTableIds

    if (activeViewId) {
      const existingView = savedViews.find((v) => v.id === activeViewId)
      if (existingView) {
        const updatedViews = savedViews.map((view) =>
          view.id === activeViewId ? { ...view, tableIds: currentTableIds } : view,
        )
        setSavedViews(updatedViews)
        setSaveViewDialogOpen(false)
        setSaveNotification("View updated")
        return
      }
    }

    if (!newViewName.trim()) return

    if (activeViewId) {
      const updatedViews = savedViews.map((view) =>
        view.id === activeViewId ? { ...view, name: newViewName.trim(), tableIds: currentTableIds } : view,
      )
      setSavedViews(updatedViews)
      setSaveNotification("View updated")
    } else {
      const newView: SavedView = {
        id: `view-${Date.now()}`,
        name: newViewName.trim(),
        tableIds: currentTableIds,
        createdAt: new Date(),
      }
      const updatedViews = [...savedViews, newView]
      setSavedViews(updatedViews)
      setActiveViewId(newView.id)
      setSaveNotification("View saved")
    }

    setNewViewName("")
    setSaveViewDialogOpen(false)
  }

  const handleLoadView = (viewId: string) => {
    const view = savedViews.find((v) => v.id === viewId)
    if (!view) return

    console.log("[v0] Loading view:", view.name, "with tables:", view.tableIds)
    setActiveViewId(viewId)
    if (onCurrentViewChange) {
      onCurrentViewChange(view.name)
    }
    if (onLoadView) {
      onLoadView(view.tableIds)
    }
  }

  const handleEditViewName = (viewId: string) => {
    const view = savedViews.find((v) => v.id === viewId)
    if (view) {
      setEditingViewId(viewId)
      setEditingViewName(view.name)
    }
  }

  const handleSaveViewName = () => {
    if (!editingViewName.trim() || !editingViewId) return

    const updatedViews = savedViews.map((view) =>
      view.id === editingViewId ? { ...view, name: editingViewName.trim() } : view,
    )
    setSavedViews(updatedViews)
    setEditingViewId(null)
    setEditingViewName("")
  }

  const handleDeleteView = () => {
    if (!activeViewId) return

    console.log("[v0] Deleting view:", activeViewId)
    const updatedViews = savedViews.filter((view) => view.id !== activeViewId)
    setSavedViews(updatedViews)
    setActiveViewId(null)
    if (onCurrentViewChange) {
      onCurrentViewChange(null)
    }
  }

  const isUpdatingExistingView = activeViewId && savedViews.find((v) => v.id === activeViewId)
  const currentViewName = activeViewId ? savedViews.find((v) => v.id === activeViewId)?.name : null

  const handleOpenSaveDialog = () => {
    if (isUpdatingExistingView) {
      handleSaveView()
    } else {
      setNewViewName("")
      setSaveViewDialogOpen(true)
    }
  }

  const getDisplayTitle = () => {
    if (!currentTable) return workspace.name

    return (
      <span>
        {workspace.name}
        {currentTable.listName && (
          <>
            <span className="text-muted-foreground mx-2">/</span>
            <span className="text-muted-foreground">{currentTable.listName}</span>
          </>
        )}
        <span className="text-muted-foreground mx-2">/</span>
        <span>{currentTable.name}</span>
      </span>
    )
  }

  return (
    <header className="border-b bg-background">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">{getDisplayTitle()}</h1>
            <ModeToggle mode={appMode} onModeChange={onAppModeChange} />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex justify-center flex-1">
              <GlobalTimePicker timeRange={timeRange} onTimeRangeChange={onTimeRangeChange} />
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />

              <div className="flex items-center gap-2">
                <Switch id="multi-view" checked={multiViewMode} onCheckedChange={onMultiViewToggle} />
                <Label htmlFor="multi-view" className="text-sm font-medium">
                  MultiView
                </Label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {multiViewMode && (
        <div className="border-t bg-muted/20 px-6 py-2 min-h-[50px] flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto flex-1">
            {savedViews.length === 0 ? (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <span>No saved views</span>
              </div>
            ) : (
              <>
                {savedViews.map((view) => (
                  <div key={view.id} className="flex items-center gap-1">
                    {editingViewId === view.id ? (
                      <div className="flex items-center gap-1">
                        <Input
                          value={editingViewName}
                          onChange={(e) => setEditingViewName(e.target.value)}
                          className="h-7 text-xs w-32"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleSaveViewName()
                            } else if (e.key === "Escape") {
                              setEditingViewId(null)
                              setEditingViewName("")
                            }
                          }}
                          onBlur={handleSaveViewName}
                          autoFocus
                        />
                      </div>
                    ) : (
                      <Button
                        variant={activeViewId === view.id ? "default" : "ghost"}
                        size="sm"
                        onClick={() => handleLoadView(view.id)}
                        className={`whitespace-nowrap text-xs h-7 ${
                          activeViewId === view.id ? "bg-primary text-primary-foreground" : ""
                        }`}
                      >
                        {view.name}
                      </Button>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>

          <div className="flex items-center gap-2 ml-4">
            {appMode === "edit" && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCreateNewView}
                  className="h-7 w-7 p-0"
                  title="Create new view"
                >
                  <Plus className="h-3 w-3" />
                </Button>

                {selectedTableIds.length > 0 && (
                  <>
                    {isUpdatingExistingView ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1 h-7 text-xs"
                        title="Save changes to current view"
                        onClick={handleOpenSaveDialog}
                      >
                        <Save className="h-3 w-3" />
                        Save
                      </Button>
                    ) : (
                      <Dialog open={saveViewDialogOpen} onOpenChange={setSaveViewDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-1 h-7 text-xs"
                            title="Save current view"
                          >
                            <Save className="h-3 w-3" />
                            Save
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Save MultiView</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium">View Name</label>
                              <Input
                                value={newViewName}
                                onChange={(e) => setNewViewName(e.target.value)}
                                placeholder="Enter view name..."
                                className="mt-1"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    handleSaveView()
                                  }
                                }}
                              />
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" onClick={() => setSaveViewDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button onClick={handleSaveView} disabled={!newViewName.trim()}>
                                Save View
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}

                    {currentViewName && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditViewName(activeViewId!)}
                        className="h-7 w-7 p-0"
                        title="Edit view name"
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                    )}

                    {activeViewId && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive h-7 w-7 p-0"
                            title="Delete current view"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete View</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete the view "{currentViewName}"? This action cannot be
                              undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDeleteView}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete View
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </>
                )}
              </>
            )}

            {saveNotification && (
              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">{saveNotification}</span>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
