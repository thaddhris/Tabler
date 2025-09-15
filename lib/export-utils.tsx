import type { Table, TimeRange } from "@/lib/types"

export interface ExportData {
  tableName: string
  headers: string[]
  rows: (string | number | boolean | null)[][]
}

export function getWorkspaceExportData(
  workspaceId: string,
  tables: Table[],
  lists: any[],
  timeRange: TimeRange,
  mockSubmissions: any[],
  mockForms: any[],
): ExportData[] {
  const workspaceLists = lists.filter((l) => l.workspaceId === workspaceId)
  const workspaceListIds = workspaceLists.map((l) => l.id)
  const workspaceTables = tables.filter((t) => workspaceListIds.includes(t.listId))

  return getTablesExportData(workspaceTables, timeRange, mockSubmissions, mockForms)
}

export function getListExportData(
  listId: string,
  tables: Table[],
  timeRange: TimeRange,
  mockSubmissions: any[],
  mockForms: any[],
): ExportData[] {
  const listTables = tables.filter((t) => t.listId === listId)
  return getTablesExportData(listTables, timeRange, mockSubmissions, mockForms)
}

function getTablesExportData(
  tables: Table[],
  timeRange: TimeRange,
  mockSubmissions: any[],
  mockForms: any[],
): ExportData[] {
  return tables.map((table) => {
    const form = mockForms.find((f) => f.id === table.formId)
    if (!form) return { tableName: table.name, headers: [], rows: [] }

    const selectedFields = form.fields.filter((field) => table.selectedFieldIds.includes(field.id))

    const headers = selectedFields.map((field) => field.name)

    // Filter submissions by time range and form
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
}

export function exportToCSV(data: ExportData[], filename = "multiview-export") {
  let csvContent = ""

  data.forEach((tableData, index) => {
    if (index > 0) csvContent += "\n\n"

    // Add table name as header
    csvContent += `"${tableData.tableName}"\n`

    // Add headers
    csvContent += tableData.headers.map((header) => `"${header}"`).join(",") + "\n"

    // Add rows
    tableData.rows.forEach((row) => {
      csvContent +=
        row
          .map((cell) => {
            if (cell === null || cell === undefined) return '""'
            if (typeof cell === "string") return `"${cell.replace(/"/g, '""')}"`
            return `"${cell}"`
          })
          .join(",") + "\n"
    })
  })

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function exportToJSON(data: ExportData[], filename = "multiview-export") {
  const jsonData = {
    exportDate: new Date().toISOString(),
    tables: data.map((tableData) => ({
      name: tableData.tableName,
      headers: tableData.headers,
      data: tableData.rows.map((row) => {
        const obj: Record<string, any> = {}
        tableData.headers.forEach((header, index) => {
          obj[header] = row[index]
        })
        return obj
      }),
    })),
  }

  const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: "application/json" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}.json`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function printMultiView(containerId: string) {
  const printContent = document.getElementById(containerId)
  if (!printContent) return

  const printWindow = window.open("", "_blank")
  if (!printWindow) return

  printWindow.document.write(`
    <html>
      <head>
        <title>MultiView Export</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .table-section { margin-bottom: 40px; page-break-inside: avoid; }
          .table-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; font-weight: bold; }
          @media print { .no-print { display: none; } }
        </style>
      </head>
      <body>
        ${printContent.innerHTML}
      </body>
    </html>
  `)

  printWindow.document.close()
  printWindow.focus()
  setTimeout(() => {
    printWindow.print()
    printWindow.close()
  }, 250)
}

export async function exportToPDF(data: ExportData[], filename = "multiview-export") {
  // Create HTML content for PDF
  let htmlContent = `
    <html>
      <head>
        <title>${filename}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
          .export-header { text-align: center; margin-bottom: 30px; }
          .export-title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
          .export-date { font-size: 14px; color: #666; }
          .table-section { margin-bottom: 40px; page-break-inside: avoid; }
          .table-title { font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #2563eb; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #ddd; padding: 12px 8px; text-align: left; }
          th { background-color: #f8fafc; font-weight: bold; color: #374151; }
          tr:nth-child(even) { background-color: #f9fafb; }
          .no-data { text-align: center; color: #6b7280; font-style: italic; padding: 20px; }
        </style>
      </head>
      <body>
        <div class="export-header">
          <div class="export-title">Table Export</div>
          <div class="export-date">Generated on ${new Date().toLocaleString()}</div>
        </div>
  `

  data.forEach((tableData) => {
    htmlContent += `
      <div class="table-section">
        <div class="table-title">${tableData.tableName}</div>
        ${
          tableData.rows.length === 0
            ? '<div class="no-data">No data available</div>'
            : `<table>
            <thead>
              <tr>
                ${tableData.headers.map((header) => `<th>${header}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
              ${tableData.rows
                .map(
                  (row) =>
                    `<tr>
                  ${row.map((cell) => `<td>${cell ?? ""}</td>`).join("")}
                </tr>`,
                )
                .join("")}
            </tbody>
          </table>`
        }
      </div>
    `
  })

  htmlContent += "</body></html>"

  // Create blob and download
  const blob = new Blob([htmlContent], { type: "text/html" })
  const url = URL.createObjectURL(blob)

  // Open in new window for printing to PDF
  const printWindow = window.open(url, "_blank")
  if (printWindow) {
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print()
      }, 500)
    }
  }
}

export async function exportToPNG(data: ExportData[], filename = "multiview-export") {
  // Create a temporary container for rendering
  const container = document.createElement("div")
  container.style.position = "absolute"
  container.style.left = "-9999px"
  container.style.top = "0"
  container.style.width = "1200px"
  container.style.backgroundColor = "white"
  container.style.padding = "40px"
  container.style.fontFamily = "Arial, sans-serif"

  // Build HTML content
  let htmlContent = `
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="font-size: 24px; margin-bottom: 10px; color: #333;">Table Export</h1>
      <p style="font-size: 14px; color: #666;">Generated on ${new Date().toLocaleString()}</p>
    </div>
  `

  data.forEach((tableData, index) => {
    htmlContent += `
      <div style="margin-bottom: ${index < data.length - 1 ? "40px" : "0"};">
        <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #2563eb;">${tableData.tableName}</h2>
        ${
          tableData.rows.length === 0
            ? '<div style="text-align: center; color: #6b7280; font-style: italic; padding: 20px;">No data available</div>'
            : `<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr>
                ${tableData.headers
                  .map(
                    (header) =>
                      `<th style="border: 1px solid #ddd; padding: 12px 8px; background-color: #f8fafc; font-weight: bold; color: #374151;">${header}</th>`,
                  )
                  .join("")}
              </tr>
            </thead>
            <tbody>
              ${tableData.rows
                .map(
                  (row, rowIndex) =>
                    `<tr style="${rowIndex % 2 === 1 ? "background-color: #f9fafb;" : ""}">
                  ${row
                    .map((cell) => `<td style="border: 1px solid #ddd; padding: 12px 8px;">${cell ?? ""}</td>`)
                    .join("")}
                </tr>`,
                )
                .join("")}
            </tbody>
          </table>`
        }
      </div>
    `
  })

  container.innerHTML = htmlContent
  document.body.appendChild(container)

  try {
    // Use html2canvas if available, otherwise fallback to opening in new window
    if (typeof window !== "undefined" && (window as any).html2canvas) {
      const canvas = await (window as any).html2canvas(container, {
        backgroundColor: "white",
        scale: 2,
        useCORS: true,
        allowTaint: true,
      })

      // Convert to blob and download
      canvas.toBlob((blob: Blob) => {
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `${filename}.png`
        link.click()
        URL.revokeObjectURL(url)
      }, "image/png")
    } else {
      // Fallback: open in new window for manual save
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${filename}</title>
              <style>
                body { margin: 0; padding: 40px; font-family: Arial, sans-serif; }
              </style>
            </head>
            <body>
              ${htmlContent}
              <script>
                // Auto-trigger right-click context menu hint
                setTimeout(() => {
                  alert('Right-click on this page and select "Save as..." to save as an image file.');
                }, 1000);
              </script>
            </body>
          </html>
        `)
        printWindow.document.close()
      }
    }
  } finally {
    document.body.removeChild(container)
  }
}
