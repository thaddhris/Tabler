"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronDown, ChevronRight, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FilterValue {
  value: string
  label: string
  count?: number
}

interface AdvancedColumnFilterProps {
  fieldName: string
  fieldType: string
  values: FilterValue[]
  selectedValues: string[]
  onSelectionChange: (values: string[]) => void
  onClose: () => void
  anchorElement?: HTMLElement
}

export function AdvancedColumnFilter({
  fieldName,
  fieldType,
  values,
  selectedValues,
  onSelectionChange,
  onClose,
  anchorElement,
}: AdvancedColumnFilterProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["values"]))
  const [position, setPosition] = useState({ top: 0, left: 0, maxHeight: 400 })
  const [selectedCondition, setSelectedCondition] = useState("none")
  const [conditionValue, setConditionValue] = useState("")
  const [conditionValue2, setConditionValue2] = useState("") // For "between" conditions
  const filterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (anchorElement && filterRef.current) {
      const anchorRect = anchorElement.getBoundingClientRect()
      const filterRect = filterRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const viewportWidth = window.innerWidth

      let top = anchorRect.bottom + 4
      let left = anchorRect.left
      let maxHeight = viewportHeight - top - 20

      // Adjust if filter would go off-screen vertically
      if (top + 400 > viewportHeight) {
        top = anchorRect.top - 400 - 4
        maxHeight = anchorRect.top - 20
      }

      // Adjust if filter would go off-screen horizontally
      if (left + 320 > viewportWidth) {
        left = viewportWidth - 320 - 20
      }

      setPosition({ top, left, width: Math.min(320, window.innerWidth - 40), maxHeight: Math.max(300, maxHeight) })
    }
  }, [anchorElement])

  const getFilterConditions = () => {
    const baseConditions = [
      { value: "none", label: "None" },
      { value: "is_empty", label: "is empty" },
      { value: "is_not_empty", label: "is not empty" },
    ]

    switch (fieldType) {
      case "text":
        return [
          ...baseConditions,
          { value: "text_contains", label: "Text contains" },
          { value: "text_does_not_contain", label: "Text does not contain" },
          { value: "text_starts_with", label: "Text starts with" },
          { value: "text_ends_with", label: "Text ends with" },
          { value: "is_equal_to", label: "is equal to" },
          { value: "is_not_equal_to", label: "is not equal to" },
        ]
      case "number":
        return [
          ...baseConditions,
          { value: "greater_than", label: "Greater than" },
          { value: "greater_than_or_equal", label: "Greater than or equal to" },
          { value: "less_than", label: "Less than" },
          { value: "less_than_or_equal", label: "Less than or equal to" },
          { value: "is_equal_to", label: "is equal to" },
          { value: "is_not_equal_to", label: "is not equal to" },
          { value: "is_between", label: "is between" },
          { value: "is_not_between", label: "is not between" },
        ]
      case "date":
        return [
          ...baseConditions,
          { value: "date_is", label: "Date is" },
          { value: "date_is_before", label: "Date is before" },
          { value: "date_is_after", label: "Date is after" },
          { value: "is_between", label: "is between" },
          { value: "is_not_between", label: "is not between" },
          { value: "date_validated", label: "Date validated" },
          { value: "date_not_validated", label: "Date not validated" },
        ]
      default:
        return [
          ...baseConditions,
          { value: "is_equal_to", label: "is equal to" },
          { value: "is_not_equal_to", label: "is not equal to" },
          { value: "custom_formula", label: "Custom formula" },
        ]
    }
  }

  const needsInput = (condition: string) => {
    return !["none", "is_empty", "is_not_empty", "date_validated", "date_not_validated"].includes(condition)
  }

  const needsTwoInputs = (condition: string) => {
    return ["is_between", "is_not_between"].includes(condition)
  }

  const getInputType = () => {
    switch (fieldType) {
      case "number":
        return "number"
      case "date":
        return "date"
      default:
        return "text"
    }
  }

  const handleConditionApply = () => {
    console.log("[v0] Applying filter condition:", {
      condition: selectedCondition,
      value: conditionValue,
      value2: conditionValue2,
      fieldName,
      fieldType,
    })
    // Here you would implement the actual filtering logic
    onClose()
  }

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const handleSelectAll = () => {
    if (selectedValues.length === values.length) {
      onSelectionChange([])
    } else {
      onSelectionChange(values.map((v) => v.value))
    }
  }

  const handleValueToggle = (value: string) => {
    if (selectedValues.includes(value)) {
      onSelectionChange(selectedValues.filter((v) => v !== value))
    } else {
      onSelectionChange([...selectedValues, value])
    }
  }

  const getSortOptions = () => {
    switch (fieldType) {
      case "text":
        return ["Sort A to Z", "Sort Z to A"]
      case "number":
        return ["Sort Smallest to Largest", "Sort Largest to Smallest"]
      case "date":
        return ["Sort Oldest to Newest", "Sort Newest to Oldest"]
      default:
        return ["Sort A to Z", "Sort Z to A"]
    }
  }

  const filteredValues = values.filter((item) => item.label.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />

      <div
        ref={filterRef}
        className="fixed bg-background border rounded-lg shadow-lg p-4 space-y-3 z-50"
        style={{
          top: position.top,
          left: position.left,
          width: Math.min(320, window.innerWidth - 40),
          maxHeight: position.maxHeight,
          overflow: "auto",
        }}
      >
        {/* Sort Options */}
        <div className="space-y-2">
          {getSortOptions().map((option) => (
            <Button
              key={option}
              variant="ghost"
              className="w-full justify-start text-sm h-8"
              onClick={() => {
                console.log(`Sort: ${option}`)
              }}
            >
              {option}
            </Button>
          ))}
        </div>

        <Separator />

        {/* Filter Options */}
        <div className="space-y-2">
          {fieldType !== "boolean" && (
            <>
              <Button
                variant="ghost"
                className="w-full justify-between text-sm h-8"
                onClick={() => toggleSection("condition")}
              >
                <span>Filter by condition</span>
                {expandedSections.has("condition") ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>

              {expandedSections.has("condition") && (
                <div className="ml-4 space-y-3 p-3 bg-muted/30 rounded">
                  <div className="space-y-2">
                    <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                      <SelectTrigger className="w-full h-8">
                        <SelectValue placeholder="Select condition..." />
                      </SelectTrigger>
                      <SelectContent>
                        {getFilterConditions().map((condition) => (
                          <SelectItem key={condition.value} value={condition.value}>
                            {condition.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {needsInput(selectedCondition) && (
                      <Input
                        type={getInputType()}
                        placeholder={`Enter ${fieldType === "date" ? "date" : fieldType === "number" ? "number" : "text"}...`}
                        value={conditionValue}
                        onChange={(e) => setConditionValue(e.target.value)}
                        className="h-8"
                      />
                    )}

                    {needsTwoInputs(selectedCondition) && (
                      <Input
                        type={getInputType()}
                        placeholder={`Enter second ${fieldType === "date" ? "date" : fieldType === "number" ? "number" : "text"}...`}
                        value={conditionValue2}
                        onChange={(e) => setConditionValue2(e.target.value)}
                        className="h-8"
                      />
                    )}

                    {selectedCondition !== "none" && (
                      <Button size="sm" className="w-full h-8" onClick={handleConditionApply}>
                        Apply Condition
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          <Button
            variant="ghost"
            className="w-full justify-between text-sm h-8"
            onClick={() => toggleSection("values")}
          >
            <span>Filter by values</span>
            {expandedSections.has("values") ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>

          {expandedSections.has("values") && (
            <div className="space-y-3">
              {/* Select All / Clear */}
              <div className="flex items-center justify-between text-sm">
                <Button variant="link" className="h-auto p-0 text-primary" onClick={handleSelectAll}>
                  {selectedValues.length === filteredValues.length ? "Clear" : `Select all ${filteredValues.length}`}
                </Button>
                <Badge variant="secondary" className="text-xs">
                  Displaying {filteredValues.length}
                </Badge>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search values..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-8"
                />
              </div>

              <div className="max-h-48 overflow-y-auto space-y-1 border rounded p-2">
                {filteredValues.map((item) => (
                  <div
                    key={item.value}
                    className="flex items-center space-x-2 p-1 hover:bg-accent/50 rounded cursor-pointer"
                    onClick={() => handleValueToggle(item.value)}
                  >
                    <Checkbox
                      checked={selectedValues.includes(item.value)}
                      onCheckedChange={() => handleValueToggle(item.value)}
                    />
                    <span className="text-sm flex-1 truncate">{item.label || "(Blanks)"}</span>
                    {item.count && (
                      <Badge variant="outline" className="text-xs">
                        {item.count}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex gap-2">
          <Button size="sm" onClick={onClose} className="flex-1">
            Apply
          </Button>
          <Button size="sm" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </>
  )
}
