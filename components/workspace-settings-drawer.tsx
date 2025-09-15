"use client"

import { useState } from "react"
import { X, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import type { Workspace } from "@/lib/types"

interface WorkspaceSettingsDrawerProps {
  workspace: Workspace
  isOpen: boolean
  onClose: () => void
  onUpdateWorkspace: (updates: Partial<Workspace>) => void
  onWorkspaceSettingsUpdate?: (workspaceId: string, settings: any) => void
  onRenameWorkspace?: (name: string) => void
}

export function WorkspaceSettingsDrawer({
  workspace,
  isOpen,
  onClose,
  onUpdateWorkspace,
  onWorkspaceSettingsUpdate,
  onRenameWorkspace,
}: WorkspaceSettingsDrawerProps) {
  const [fontSize, setFontSize] = useState(workspace.settings.fontSize)
  const [alignment, setAlignment] = useState(workspace.settings.alignment)
  const [fontWeight, setFontWeight] = useState(workspace.settings.fontWeight || "normal")
  const [lineHeight, setLineHeight] = useState(workspace.settings.lineHeight || 1.5)
  const [letterSpacing, setLetterSpacing] = useState(workspace.settings.letterSpacing || 0)
  const [tableBorderStyle, setTableBorderStyle] = useState(workspace.settings.tableBorderStyle || "solid")
  const [tableRowHeight, setTableRowHeight] = useState(workspace.settings.tableRowHeight || "medium")
  const [tableCellPadding, setTableCellPadding] = useState(workspace.settings.tableCellPadding || "normal")
  const [tableHeaderStyle, setTableHeaderStyle] = useState(workspace.settings.tableHeaderStyle || "default")
  const [headerBackgroundColor, setHeaderBackgroundColor] = useState(
    workspace.settings.headerBackgroundColor || "#f1f5f9",
  )

  const colorOptions = [
    { value: "#f1f5f9", label: "Slate", category: "Grays" },
    { value: "#f8fafc", label: "Slate Light", category: "Grays" },
    { value: "#e2e8f0", label: "Slate Medium", category: "Grays" },
    { value: "#64748b", label: "Slate Dark", category: "Grays" },
    { value: "#f9fafb", label: "Gray Light", category: "Grays" },
    { value: "#e5e7eb", label: "Gray Medium", category: "Grays" },
    { value: "#6b7280", label: "Gray Dark", category: "Grays" },
    { value: "#fef2f2", label: "Red Light", category: "Reds" },
    { value: "#fecaca", label: "Red Medium", category: "Reds" },
    { value: "#f97316", label: "Red", category: "Reds" },
    { value: "#dc2626", label: "Red Dark", category: "Reds" },
    { value: "#fff7ed", label: "Orange Light", category: "Oranges" },
    { value: "#fed7aa", label: "Orange Medium", category: "Oranges" },
    { value: "#f97316", label: "Orange", category: "Oranges" },
    { value: "#ea580c", label: "Orange Dark", category: "Oranges" },
    { value: "#fefce8", label: "Yellow Light", category: "Yellows" },
    { value: "#fde047", label: "Yellow Medium", category: "Yellows" },
    { value: "#eab308", label: "Yellow", category: "Yellows" },
    { value: "#ca8a04", label: "Yellow Dark", category: "Yellows" },
    { value: "#f0fdf4", label: "Green Light", category: "Greens" },
    { value: "#bbf7d0", label: "Green Medium", category: "Greens" },
    { value: "#22c55e", label: "Green", category: "Greens" },
    { value: "#16a34a", label: "Green Dark", category: "Greens" },
    { value: "#ecfdf5", label: "Emerald Light", category: "Greens" },
    { value: "#a7f3d0", label: "Emerald Medium", category: "Greens" },
    { value: "#10b981", label: "Emerald", category: "Greens" },
    { value: "#059669", label: "Emerald Dark", category: "Greens" },
    { value: "#f0fdfa", label: "Teal Light", category: "Blues" },
    { value: "#99f6e4", label: "Teal Medium", category: "Blues" },
    { value: "#14b8a6", label: "Teal", category: "Blues" },
    { value: "#0d9488", label: "Teal Dark", category: "Blues" },
    { value: "#eff6ff", label: "Blue Light", category: "Blues" },
    { value: "#bfdbfe", label: "Blue Medium", category: "Blues" },
    { value: "#3b82f6", label: "Blue", category: "Blues" },
    { value: "#2563eb", label: "Blue Dark", category: "Blues" },
    { value: "#eef2ff", label: "Indigo Light", category: "Purples" },
    { value: "#c7d2fe", label: "Indigo Medium", category: "Purples" },
    { value: "#6366f1", label: "Indigo", category: "Purples" },
    { value: "#4f46e5", label: "Indigo Dark", category: "Purples" },
    { value: "#faf5ff", label: "Purple Light", category: "Purples" },
    { value: "#ddd6fe", label: "Purple Medium", category: "Purples" },
    { value: "#a855f7", label: "Purple", category: "Purples" },
    { value: "#9333ea", label: "Purple Dark", category: "Purples" },
    { value: "#fdf2f8", label: "Pink Light", category: "Pinks" },
    { value: "#fbcfe8", label: "Pink Medium", category: "Pinks" },
    { value: "#ec4899", label: "Pink", category: "Pinks" },
    { value: "#db2777", label: "Pink Dark", category: "Pinks" },
    { value: "#fff1f2", label: "Rose Light", category: "Pinks" },
    { value: "#fecdd3", label: "Rose Medium", category: "Pinks" },
    { value: "#f43f5e", label: "Rose", category: "Pinks" },
    { value: "#e11d48", label: "Rose Dark", category: "Pinks" },
  ]

  const handleApply = () => {
    console.log("[v0] Applying workspace settings:", {
      fontSize,
      alignment,
      fontWeight,
      lineHeight,
      letterSpacing,
      tableBorderStyle,
      tableRowHeight,
      tableCellPadding,
      tableHeaderStyle,
      headerBackgroundColor,
    })

    const newSettings = {
      fontSize,
      alignment,
      fontWeight,
      lineHeight,
      letterSpacing,
      tableBorderStyle,
      tableRowHeight,
      tableCellPadding,
      tableHeaderStyle,
      headerBackgroundColor,
    }

    onUpdateWorkspace({
      settings: {
        ...workspace.settings,
        ...newSettings,
      },
    })

    if (onWorkspaceSettingsUpdate) {
      onWorkspaceSettingsUpdate(workspace.id, newSettings)
    }

    onClose()
  }

  const handleFontSizeChange = (value: string) => {
    setFontSize(value as "small" | "medium" | "large")
  }

  const handleAlignmentChange = (value: string) => {
    setAlignment(value as "left" | "center" | "right")
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-96 bg-background border-l shadow-lg z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Workspace Settings</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 space-y-6">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Workspace</h4>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Workspace Name</Label>
              <div className="flex gap-2">
                <Input value={workspace.name} readOnly className="flex-1" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onRenameWorkspace?.(workspace.name)
                  }}
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Rename
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Click rename to change the workspace name.</p>
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-xs text-muted-foreground mb-4">
              These settings apply to all tables in this workspace by default.
            </p>
          </div>

          {/* Font Settings */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Font Settings</h4>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Font Size</Label>
              <Select value={fontSize} onValueChange={handleFontSizeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small (12px)</SelectItem>
                  <SelectItem value="medium">Medium (14px)</SelectItem>
                  <SelectItem value="large">Large (16px)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Font Weight</Label>
              <Select value={fontWeight} onValueChange={setFontWeight}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light (300)</SelectItem>
                  <SelectItem value="normal">Normal (400)</SelectItem>
                  <SelectItem value="medium">Medium (500)</SelectItem>
                  <SelectItem value="semibold">Semi Bold (600)</SelectItem>
                  <SelectItem value="bold">Bold (700)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Text Alignment</Label>
              <Select value={alignment} onValueChange={handleAlignmentChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Line Height: {lineHeight}</Label>
              <Slider
                value={[lineHeight]}
                onValueChange={(value) => setLineHeight(value[0])}
                min={1.0}
                max={2.0}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Tight (1.0)</span>
                <span>Loose (2.0)</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Letter Spacing: {letterSpacing}px</Label>
              <Slider
                value={[letterSpacing]}
                onValueChange={(value) => setLetterSpacing(value[0])}
                min={-2}
                max={4}
                step={0.5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Tight (-2px)</span>
                <span>Wide (4px)</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Table Formatting</h4>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Table Border Style</Label>
              <Select value={tableBorderStyle} onValueChange={setTableBorderStyle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Borders</SelectItem>
                  <SelectItem value="solid">Solid Lines</SelectItem>
                  <SelectItem value="dashed">Dashed Lines</SelectItem>
                  <SelectItem value="minimal">Minimal (Header Only)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Row Height</Label>
              <Select value={tableRowHeight} onValueChange={setTableRowHeight}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compact">Compact (32px)</SelectItem>
                  <SelectItem value="medium">Medium (40px)</SelectItem>
                  <SelectItem value="comfortable">Comfortable (48px)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Cell Padding</Label>
              <Select value={tableCellPadding} onValueChange={setTableCellPadding}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tight">Tight (8px)</SelectItem>
                  <SelectItem value="normal">Normal (12px)</SelectItem>
                  <SelectItem value="spacious">Spacious (16px)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Header Style</Label>
              <Select value={tableHeaderStyle} onValueChange={setTableHeaderStyle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="bold">Bold Headers</SelectItem>
                  <SelectItem value="colored">Colored Background</SelectItem>
                  <SelectItem value="minimal">Minimal Style</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {tableHeaderStyle === "colored" && (
              <div className="space-y-3">
                <Label className="text-sm font-medium">Header Background Color</Label>
                <Select value={headerBackgroundColor} onValueChange={setHeaderBackgroundColor}>
                  <SelectTrigger>
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded border" style={{ backgroundColor: headerBackgroundColor }} />
                        <span>{colorOptions.find((c) => c.value === headerBackgroundColor)?.label || "Custom"}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {["Grays", "Reds", "Oranges", "Yellows", "Greens", "Blues", "Purples", "Pinks"].map((category) => (
                      <div key={category}>
                        <div className="px-2 py-1 text-xs font-medium text-muted-foreground border-b">{category}</div>
                        {colorOptions
                          .filter((color) => color.category === category)
                          .map((color) => (
                            <SelectItem key={color.value} value={color.value}>
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded border" style={{ backgroundColor: color.value }} />
                                <span>{color.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <Separator />

          {/* Enhanced Preview */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Preview</Label>
            <div className="border rounded p-4 bg-muted/20 space-y-3">
              {/* Table Header Preview */}
              <div
                className={`
                  ${fontSize === "small" ? "text-sm" : fontSize === "large" ? "text-lg" : "text-base"}
                  ${alignment === "center" ? "text-center" : alignment === "right" ? "text-right" : "text-left"}
                  ${tableHeaderStyle === "bold" ? "font-bold" : "font-medium"}
                  ${tableHeaderStyle === "colored" ? `px-2 py-1 rounded` : ""}
                  border-b pb-2
                `}
                style={{
                  backgroundColor: tableHeaderStyle === "colored" ? headerBackgroundColor : "transparent",
                  color: tableHeaderStyle === "colored" ? "#000" : "inherit",
                  fontWeight:
                    tableHeaderStyle === "bold"
                      ? 700
                      : fontWeight === "light"
                        ? 300
                        : fontWeight === "medium"
                          ? 500
                          : fontWeight === "semibold"
                            ? 600
                            : fontWeight === "bold"
                              ? 700
                              : 400,
                  lineHeight: lineHeight,
                  letterSpacing: `${letterSpacing}px`,
                  padding: tableCellPadding === "tight" ? "8px" : tableCellPadding === "spacious" ? "16px" : "12px",
                }}
              >
                Device Name | Temperature | Status
              </div>

              {/* Table Cell Preview */}
              <div
                className={`
                  ${fontSize === "small" ? "text-xs" : fontSize === "large" ? "text-base" : "text-sm"}
                  ${alignment === "center" ? "text-center" : alignment === "right" ? "text-right" : "text-left"}
                  text-muted-foreground
                  ${tableBorderStyle === "solid" ? "border-b" : tableBorderStyle === "dashed" ? "border-b border-dashed" : ""}
                `}
                style={{
                  fontWeight:
                    fontWeight === "light"
                      ? 300
                      : fontWeight === "medium"
                        ? 500
                        : fontWeight === "semibold"
                          ? 600
                          : fontWeight === "bold"
                            ? 700
                            : 400,
                  lineHeight: lineHeight,
                  letterSpacing: `${letterSpacing}px`,
                  padding: tableCellPadding === "tight" ? "8px" : tableCellPadding === "spacious" ? "16px" : "12px",
                  height: tableRowHeight === "compact" ? "32px" : tableRowHeight === "comfortable" ? "48px" : "40px",
                }}
              >
                Sensor-001 | 23.5°C | Active
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleApply} className="flex-1">
              Apply Settings
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
