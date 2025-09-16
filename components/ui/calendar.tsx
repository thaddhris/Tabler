"use client"

import type * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface CalendarProps {
  mode?: "single" | "range"
  selected?: Date | { from?: Date; to?: Date }
  onSelect?: (date: Date | { from?: Date; to?: Date } | undefined) => void
  className?: string
  numberOfMonths?: number
}

function Calendar({ mode = "single", selected, onSelect, className, numberOfMonths = 1 }: CalendarProps) {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value)
    if (!isNaN(date.getTime()) && onSelect) {
      if (mode === "single") {
        onSelect(date)
      } else {
        // For range mode, we'll use two separate inputs
        onSelect({ from: date, to: undefined })
      }
    }
  }

  const formatDateForInput = (date: Date | undefined) => {
    if (!date) return ""
    return date.toISOString().split("T")[0]
  }

  if (mode === "range") {
    const rangeSelected = selected as { from?: Date; to?: Date } | undefined
    return (
      <div className={cn("p-3 space-y-2", className)}>
        <div>
          <label className="text-sm font-medium">From:</label>
          <input
            type="date"
            value={formatDateForInput(rangeSelected?.from)}
            onChange={(e) => {
              const date = new Date(e.target.value)
              if (!isNaN(date.getTime()) && onSelect) {
                onSelect({ from: date, to: rangeSelected?.to })
              }
            }}
            className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
          />
        </div>
        <div>
          <label className="text-sm font-medium">To:</label>
          <input
            type="date"
            value={formatDateForInput(rangeSelected?.to)}
            onChange={(e) => {
              const date = new Date(e.target.value)
              if (!isNaN(date.getTime()) && onSelect) {
                onSelect({ from: rangeSelected?.from, to: date })
              }
            }}
            className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
          />
        </div>
      </div>
    )
  }

  return (
    <div className={cn("p-3", className)}>
      <input
        type="date"
        value={formatDateForInput(selected as Date)}
        onChange={handleDateChange}
        className="w-full px-3 py-2 border border-input rounded-md bg-background"
      />
    </div>
  )
}

function CalendarDayButton({ className, ...props }: any) {
  return <Button className={className} {...props} />
}

export { Calendar, CalendarDayButton }
