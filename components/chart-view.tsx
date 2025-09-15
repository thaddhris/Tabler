"use client"

import { useRef } from "react"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import type { Config, TimeRange } from "@/lib/types"

interface ChartViewProps {
  config: Config
  timeRange: TimeRange
  className?: string
}

// Generate mock time series data for a config
function generateMockData(config: Config, timeRange: TimeRange) {
  const startTime = new Date(timeRange.start).getTime()
  const endTime = new Date(timeRange.end).getTime()
  const interval = (endTime - startTime) / 100 // 100 data points

  const data: [number, number][] = []

  for (let i = 0; i <= 100; i++) {
    const timestamp = startTime + i * interval
    let value: number

    // Generate realistic data based on sensor type
    switch (config.sensorType) {
      case "temperature":
        value = 20 + Math.sin(i * 0.1) * 5 + Math.random() * 2
        break
      case "humidity":
        value = 50 + Math.sin(i * 0.15) * 20 + Math.random() * 5
        break
      case "pressure":
        value = 1013 + Math.sin(i * 0.05) * 10 + Math.random() * 3
        break
      case "flow":
        value = Math.max(0, 10 + Math.sin(i * 0.2) * 8 + Math.random() * 2)
        break
      default:
        value = Math.random() * 100
    }

    data.push([timestamp, Math.round(value * 100) / 100])
  }

  return data
}

export function ChartView({ config, timeRange, className }: ChartViewProps) {
  const chartRef = useRef<HighchartsReact.RefObject>(null)

  const data = generateMockData(config, timeRange)

  const options: Highcharts.Options = {
    chart: {
      type: "line",
      backgroundColor: "transparent",
      height: 400,
    },
    title: {
      text: `${config.deviceName} - ${config.sensorName}`,
      style: {
        fontSize: "16px",
        fontWeight: "600",
      },
    },
    subtitle: {
      text: `${config.sensorType} (${config.unit})`,
      style: {
        fontSize: "12px",
        color: "#666",
      },
    },
    xAxis: {
      type: "datetime",
      title: {
        text: "Time",
      },
    },
    yAxis: {
      title: {
        text: `${config.sensorType} (${config.unit})`,
      },
    },
    series: [
      {
        type: "line",
        name: config.sensorName,
        data: data,
        color: "#3b82f6",
        lineWidth: 2,
        marker: {
          enabled: false,
          states: {
            hover: {
              enabled: true,
            },
          },
        },
      },
    ],
    tooltip: {
      shared: true,
      crosshairs: true,
      formatter: function () {
        return `<b>${this.series?.name}</b><br/>
                ${Highcharts.dateFormat("%Y-%m-%d %H:%M:%S", this.x as number)}<br/>
                ${this.y} ${config.unit}`
      },
    },
    legend: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
    plotOptions: {
      line: {
        animation: {
          duration: 1000,
        },
      },
    },
  }

  return (
    <div className={className}>
      <HighchartsReact highcharts={Highcharts} options={options} ref={chartRef} />
    </div>
  )
}
