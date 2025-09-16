// Mock data for development without database
import type { Workspace, List, Table, Form, Submission } from "./types"

export const mockForms: Form[] = [
  {
    id: "form-1",
    name: "Environment Monitoring Device",
    createdAt: new Date("2024-01-01"),
    fields: [
      { id: "field-1", formId: "form-1", name: "Device ID", type: "text" },
      { id: "field-2", formId: "form-1", name: "Temperature", type: "number" },
      { id: "field-3", formId: "form-1", name: "Humidity", type: "number" },
      { id: "field-4", formId: "form-1", name: "Air Quality Index", type: "number" },
      { id: "field-5", formId: "form-1", name: "CO2 Level", type: "number" },
      { id: "field-6", formId: "form-1", name: "Device Online", type: "boolean" },
      { id: "field-7", formId: "form-1", name: "Location", type: "text" },
      { id: "field-8", formId: "form-1", name: "Battery Level", type: "number" },
      { id: "field-9", formId: "form-1", name: "Last Calibration", type: "date" },
      {
        id: "field-10",
        formId: "form-1",
        name: "Alert Status",
        type: "enum",
        options: ["Normal", "Warning", "Critical", "Maintenance"],
      },
    ],
  },
  {
    id: "form-2",
    name: "Weather Reporting Station",
    createdAt: new Date("2024-01-15"),
    fields: [
      { id: "field-11", formId: "form-2", name: "Station ID", type: "text" },
      { id: "field-12", formId: "form-2", name: "Wind Speed", type: "number" },
      { id: "field-13", formId: "form-2", name: "Wind Direction", type: "number" },
      { id: "field-14", formId: "form-2", name: "Rainfall", type: "number" },
      { id: "field-15", formId: "form-2", name: "Atmospheric Pressure", type: "number" },
      { id: "field-16", formId: "form-2", name: "UV Index", type: "number" },
      { id: "field-17", formId: "form-2", name: "Visibility", type: "number" },
      { id: "field-18", formId: "form-2", name: "Storm Warning", type: "boolean" },
      {
        id: "field-19",
        formId: "form-2",
        name: "Weather Condition",
        type: "enum",
        options: ["Clear", "Cloudy", "Rainy", "Stormy", "Foggy"],
      },
    ],
  },
  {
    id: "form-3",
    name: "Plant Workshop Sensors",
    createdAt: new Date("2024-02-01"),
    fields: [
      { id: "field-20", formId: "form-3", name: "Sensor ID", type: "text" },
      { id: "field-21", formId: "form-3", name: "Machine Temperature", type: "number" },
      { id: "field-22", formId: "form-3", name: "Vibration Level", type: "number" },
      { id: "field-23", formId: "form-3", name: "Oil Pressure", type: "number" },
      { id: "field-24", formId: "form-3", name: "RPM", type: "number" },
      { id: "field-25", formId: "form-3", name: "Power Consumption", type: "number" },
      { id: "field-26", formId: "form-3", name: "Machine Active", type: "boolean" },
      { id: "field-27", formId: "form-3", name: "Maintenance Due", type: "boolean" },
      {
        id: "field-28",
        formId: "form-3",
        name: "Machine Type",
        type: "enum",
        options: ["Lathe", "Mill", "Press", "Grinder", "Welder"],
      },
      { id: "field-29", formId: "form-3", name: "Last Service Date", type: "date" },
    ],
  },
  {
    id: "form-4",
    name: "Site Conveyor Belt Monitor",
    createdAt: new Date("2024-02-15"),
    fields: [
      { id: "field-30", formId: "form-4", name: "Belt ID", type: "text" },
      { id: "field-31", formId: "form-4", name: "Belt Speed", type: "number" },
      { id: "field-32", formId: "form-4", name: "Load Weight", type: "number" },
      { id: "field-33", formId: "form-4", name: "Motor Current", type: "number" },
      { id: "field-34", formId: "form-4", name: "Belt Tension", type: "number" },
      { id: "field-35", formId: "form-4", name: "Emergency Stop", type: "boolean" },
      { id: "field-36", formId: "form-4", name: "Operational", type: "boolean" },
      {
        id: "field-37",
        formId: "form-4",
        name: "Operation Mode",
        type: "enum",
        options: ["Auto", "Manual", "Maintenance", "Emergency"],
      },
      { id: "field-38", formId: "form-4", name: "Total Runtime Hours", type: "number" },
      { id: "field-39", formId: "form-4", name: "Installation Date", type: "date" },
    ],
  },
  {
    id: "form-5",
    name: "Energy Management System",
    createdAt: new Date("2024-03-01"),
    fields: [
      { id: "field-40", formId: "form-5", name: "Meter ID", type: "text" },
      { id: "field-41", formId: "form-5", name: "Voltage", type: "number" },
      { id: "field-42", formId: "form-5", name: "Current", type: "number" },
      { id: "field-43", formId: "form-5", name: "Power Factor", type: "number" },
      { id: "field-44", formId: "form-5", name: "Energy Consumed", type: "number" },
      { id: "field-45", formId: "form-5", name: "Peak Demand", type: "number" },
      { id: "field-46", formId: "form-5", name: "Grid Connected", type: "boolean" },
      {
        id: "field-47",
        formId: "form-5",
        name: "Phase",
        type: "enum",
        options: ["Single", "Three Phase"],
      },
      { id: "field-48", formId: "form-5", name: "Frequency", type: "number" },
      { id: "field-49", formId: "form-5", name: "Reading Date", type: "date" },
    ],
  },
  {
    id: "form-6",
    name: "Security Access Control",
    createdAt: new Date("2024-03-15"),
    fields: [
      { id: "field-50", formId: "form-6", name: "Access Point ID", type: "text" },
      { id: "field-51", formId: "form-6", name: "Card ID", type: "text" },
      { id: "field-52", formId: "form-6", name: "Employee ID", type: "text" },
      { id: "field-53", formId: "form-6", name: "Access Granted", type: "boolean" },
      { id: "field-54", formId: "form-6", name: "Door Locked", type: "boolean" },
      {
        id: "field-55",
        formId: "form-6",
        name: "Access Level",
        type: "enum",
        options: ["Basic", "Supervisor", "Manager", "Admin"],
      },
      {
        id: "field-56",
        formId: "form-6",
        name: "Entry Type",
        type: "enum",
        options: ["Card", "Biometric", "PIN", "Emergency"],
      },
      { id: "field-57", formId: "form-6", name: "Access Time", type: "date" },
      { id: "field-58", formId: "form-6", name: "Area Name", type: "text" },
    ],
  },
  {
    id: "form-7",
    name: "HVAC Control System",
    createdAt: new Date("2024-04-01"),
    fields: [
      { id: "field-60", formId: "form-7", name: "Unit ID", type: "text" },
      { id: "field-61", formId: "form-7", name: "Set Temperature", type: "number" },
      { id: "field-62", formId: "form-7", name: "Current Temperature", type: "number" },
      { id: "field-63", formId: "form-7", name: "Fan Speed", type: "number" },
      { id: "field-64", formId: "form-7", name: "Filter Status", type: "boolean" },
      { id: "field-65", formId: "form-7", name: "Energy Efficiency", type: "number" },
      {
        id: "field-66",
        formId: "form-7",
        name: "Mode",
        type: "enum",
        options: ["Cooling", "Heating", "Auto", "Off"],
      },
      { id: "field-67", formId: "form-7", name: "Zone", type: "text" },
      { id: "field-68", formId: "form-7", name: "Last Maintenance", type: "date" },
    ],
  },
  {
    id: "form-8",
    name: "Water Quality Monitor",
    createdAt: new Date("2024-04-15"),
    fields: [
      { id: "field-70", formId: "form-8", name: "Sensor ID", type: "text" },
      { id: "field-71", formId: "form-8", name: "pH Level", type: "number" },
      { id: "field-72", formId: "form-8", name: "Dissolved Oxygen", type: "number" },
      { id: "field-73", formId: "form-8", name: "Turbidity", type: "number" },
      { id: "field-74", formId: "form-8", name: "Chlorine Level", type: "number" },
      { id: "field-75", formId: "form-8", name: "Temperature", type: "number" },
      { id: "field-76", formId: "form-8", name: "Flow Rate", type: "number" },
      { id: "field-77", formId: "form-8", name: "System Active", type: "boolean" },
      {
        id: "field-78",
        formId: "form-8",
        name: "Quality Status",
        type: "enum",
        options: ["Excellent", "Good", "Fair", "Poor", "Critical"],
      },
      { id: "field-79", formId: "form-8", name: "Sample Date", type: "date" },
    ],
  },
  {
    id: "form-9",
    name: "Fire Safety System",
    createdAt: new Date("2024-05-01"),
    fields: [
      { id: "field-80", formId: "form-9", name: "Detector ID", type: "text" },
      { id: "field-81", formId: "form-9", name: "Smoke Level", type: "number" },
      { id: "field-82", formId: "form-9", name: "Heat Level", type: "number" },
      { id: "field-83", formId: "form-9", name: "CO Level", type: "number" },
      { id: "field-84", formId: "form-9", name: "Alarm Active", type: "boolean" },
      { id: "field-85", formId: "form-9", name: "Sprinkler Armed", type: "boolean" },
      { id: "field-86", formId: "form-9", name: "Battery Level", type: "number" },
      {
        id: "field-87",
        formId: "form-9",
        name: "Zone",
        type: "enum",
        options: ["Office", "Warehouse", "Kitchen", "Server Room", "Exit"],
      },
      { id: "field-88", formId: "form-9", name: "Last Test Date", type: "date" },
    ],
  },
  {
    id: "form-10",
    name: "Parking Management",
    createdAt: new Date("2024-05-15"),
    fields: [
      { id: "field-90", formId: "form-10", name: "Space ID", type: "text" },
      { id: "field-91", formId: "form-10", name: "Occupied", type: "boolean" },
      { id: "field-92", formId: "form-10", name: "Vehicle Type", type: "text" },
      { id: "field-93", formId: "form-10", name: "Entry Time", type: "date" },
      { id: "field-94", formId: "form-10", name: "Duration Minutes", type: "number" },
      { id: "field-95", formId: "form-10", name: "Payment Status", type: "boolean" },
      {
        id: "field-96",
        formId: "form-10",
        name: "Level",
        type: "enum",
        options: ["Ground", "Level 1", "Level 2", "Level 3", "Roof"],
      },
      { id: "field-97", formId: "form-10", name: "Sensor Active", type: "boolean" },
      { id: "field-98", formId: "form-10", name: "License Plate", type: "text" },
    ],
  },
  {
    id: "form-11",
    name: "Lighting Control System",
    createdAt: new Date("2024-06-01"),
    fields: [
      { id: "field-100", formId: "form-11", name: "Light ID", type: "text" },
      { id: "field-101", formId: "form-11", name: "Brightness Level", type: "number" },
      { id: "field-102", formId: "form-11", name: "Power Consumption", type: "number" },
      { id: "field-103", formId: "form-11", name: "Motion Detected", type: "boolean" },
      { id: "field-104", formId: "form-11", name: "Daylight Sensor", type: "number" },
      { id: "field-105", formId: "form-11", name: "Schedule Active", type: "boolean" },
      {
        id: "field-106",
        formId: "form-11",
        name: "Control Mode",
        type: "enum",
        options: ["Manual", "Auto", "Schedule", "Motion", "Daylight"],
      },
      { id: "field-107", formId: "form-11", name: "Zone", type: "text" },
      { id: "field-108", formId: "form-11", name: "Last Updated", type: "date" },
    ],
  },
  {
    id: "form-12",
    name: "Waste Management System",
    createdAt: new Date("2024-06-15"),
    fields: [
      { id: "field-110", formId: "form-12", name: "Bin ID", type: "text" },
      { id: "field-111", formId: "form-12", name: "Fill Level", type: "number" },
      { id: "field-112", formId: "form-12", name: "Weight", type: "number" },
      { id: "field-113", formId: "form-12", name: "Temperature", type: "number" },
      { id: "field-114", formId: "form-12", name: "Collection Due", type: "boolean" },
      { id: "field-115", formId: "form-12", name: "Compactor Active", type: "boolean" },
      {
        id: "field-116",
        formId: "form-12",
        name: "Waste Type",
        type: "enum",
        options: ["General", "Recyclable", "Organic", "Hazardous", "Electronic"],
      },
      { id: "field-117", formId: "form-12", name: "Location", type: "text" },
      { id: "field-118", formId: "form-12", name: "Last Collection", type: "date" },
    ],
  },
]

export const mockSubmissions: Submission[] = [
  // Environment Monitoring Device submissions (35 entries)
  ...Array.from({ length: 35 }, (_, i) => ({
    id: `sub-env-${i + 1}`,
    formId: "form-1",
    timestamp: new Date(Date.now() - i * 2 * 60 * 60 * 1000),
    values: {
      "field-1": `ENV-${String(i + 1).padStart(3, "0")}`,
      "field-2": Math.round((20 + Math.random() * 15) * 10) / 10,
      "field-3": Math.round((40 + Math.random() * 40) * 10) / 10,
      "field-4": Math.round(50 + Math.random() * 100),
      "field-5": Math.round(400 + Math.random() * 600),
      "field-6": Math.random() > 0.1,
      "field-7": ["Building A", "Building B", "Warehouse", "Office Floor 1", "Office Floor 2"][
        Math.floor(Math.random() * 5)
      ],
      "field-8": Math.round(20 + Math.random() * 80),
      "field-9": new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      "field-10": ["Normal", "Warning", "Critical", "Maintenance"][Math.floor(Math.random() * 4)],
    },
  })),

  // Weather Reporting Station submissions (32 entries)
  ...Array.from({ length: 32 }, (_, i) => ({
    id: `sub-weather-${i + 1}`,
    formId: "form-2",
    timestamp: new Date(Date.now() - i * 3 * 60 * 60 * 1000),
    values: {
      "field-11": `WS-${String(i + 1).padStart(2, "0")}`,
      "field-12": Math.round(Math.random() * 25 * 10) / 10,
      "field-13": Math.round(Math.random() * 360),
      "field-14": Math.round(Math.random() * 50 * 10) / 10,
      "field-15": Math.round((980 + Math.random() * 60) * 10) / 10,
      "field-16": Math.round(Math.random() * 11),
      "field-17": Math.round((1 + Math.random() * 19) * 10) / 10,
      "field-18": Math.random() > 0.8,
      "field-19": ["Clear", "Cloudy", "Rainy", "Stormy", "Foggy"][Math.floor(Math.random() * 5)],
    },
  })),

  // Plant Workshop Sensors submissions (38 entries)
  ...Array.from({ length: 38 }, (_, i) => ({
    id: `sub-plant-${i + 1}`,
    formId: "form-3",
    timestamp: new Date(Date.now() - i * 1.5 * 60 * 60 * 1000),
    values: {
      "field-20": `PS-${String(i + 1).padStart(3, "0")}`,
      "field-21": Math.round((60 + Math.random() * 40) * 10) / 10,
      "field-22": Math.round(Math.random() * 10 * 100) / 100,
      "field-23": Math.round((2 + Math.random() * 8) * 10) / 10,
      "field-24": Math.round(500 + Math.random() * 2500),
      "field-25": Math.round((5 + Math.random() * 45) * 10) / 10,
      "field-26": Math.random() > 0.2,
      "field-27": Math.random() > 0.7,
      "field-28": ["Lathe", "Mill", "Press", "Grinder", "Welder"][Math.floor(Math.random() * 5)],
      "field-29": new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
    },
  })),

  // Site Conveyor Belt Monitor submissions (34 entries)
  ...Array.from({ length: 34 }, (_, i) => ({
    id: `sub-belt-${i + 1}`,
    formId: "form-4",
    timestamp: new Date(Date.now() - i * 2.5 * 60 * 60 * 1000),
    values: {
      "field-30": `CB-${String(i + 1).padStart(2, "0")}`,
      "field-31": Math.round((0.5 + Math.random() * 4.5) * 10) / 10,
      "field-32": Math.round(100 + Math.random() * 900),
      "field-33": Math.round((10 + Math.random() * 40) * 10) / 10,
      "field-34": Math.round((500 + Math.random() * 1500) * 10) / 10,
      "field-35": Math.random() > 0.95,
      "field-36": Math.random() > 0.1,
      "field-37": ["Auto", "Manual", "Maintenance", "Emergency"][Math.floor(Math.random() * 4)],
      "field-38": Math.round(1000 + Math.random() * 8000),
      "field-39": new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
    },
  })),

  // Energy Management System submissions (36 entries)
  ...Array.from({ length: 36 }, (_, i) => ({
    id: `sub-energy-${i + 1}`,
    formId: "form-5",
    timestamp: new Date(Date.now() - i * 2 * 60 * 60 * 1000),
    values: {
      "field-40": `EM-${String(i + 1).padStart(3, "0")}`,
      "field-41": Math.round((220 + Math.random() * 20) * 10) / 10,
      "field-42": Math.round((10 + Math.random() * 90) * 10) / 10,
      "field-43": Math.round((0.8 + Math.random() * 0.2) * 100) / 100,
      "field-44": Math.round((50 + Math.random() * 450) * 10) / 10,
      "field-45": Math.round((20 + Math.random() * 80) * 10) / 10,
      "field-46": Math.random() > 0.05,
      "field-47": Math.random() > 0.3 ? "Three Phase" : "Single",
      "field-48": Math.round((49.5 + Math.random() * 1) * 10) / 10,
      "field-49": new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    },
  })),

  // Security Access Control submissions (40 entries)
  ...Array.from({ length: 40 }, (_, i) => ({
    id: `sub-security-${i + 1}`,
    formId: "form-6",
    timestamp: new Date(Date.now() - i * 1 * 60 * 60 * 1000),
    values: {
      "field-50": `AP-${String(Math.floor(i / 5) + 1).padStart(2, "0")}`,
      "field-51": `CARD-${String(i + 1000).padStart(4, "0")}`,
      "field-52": `EMP-${String(i + 100).padStart(3, "0")}`,
      "field-53": Math.random() > 0.1,
      "field-54": Math.random() > 0.05,
      "field-55": ["Basic", "Supervisor", "Manager", "Admin"][Math.floor(Math.random() * 4)],
      "field-56": ["Card", "Biometric", "PIN", "Emergency"][Math.floor(Math.random() * 4)],
      "field-57": new Date(Date.now() - i * 60 * 60 * 1000),
      "field-58": ["Main Entrance", "Server Room", "Lab Area", "Executive Floor", "Warehouse"][
        Math.floor(Math.random() * 5)
      ],
    },
  })),

  // HVAC Control System submissions (33 entries)
  ...Array.from({ length: 33 }, (_, i) => ({
    id: `sub-hvac-${i + 1}`,
    formId: "form-7",
    timestamp: new Date(Date.now() - i * 2 * 60 * 60 * 1000),
    values: {
      "field-60": `HVAC-${String(i + 1).padStart(2, "0")}`,
      "field-61": Math.round(18 + Math.random() * 8),
      "field-62": Math.round((18 + Math.random() * 8) * 10) / 10,
      "field-63": Math.round(20 + Math.random() * 80),
      "field-64": Math.random() > 0.2,
      "field-65": Math.round((70 + Math.random() * 25) * 10) / 10,
      "field-66": ["Cooling", "Heating", "Auto", "Off"][Math.floor(Math.random() * 4)],
      "field-67": ["Zone A", "Zone B", "Zone C", "Zone D"][Math.floor(Math.random() * 4)],
      "field-68": new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000),
    },
  })),

  // Water Quality Monitor submissions (31 entries)
  ...Array.from({ length: 31 }, (_, i) => ({
    id: `sub-water-${i + 1}`,
    formId: "form-8",
    timestamp: new Date(Date.now() - i * 4 * 60 * 60 * 1000),
    values: {
      "field-70": `WQ-${String(i + 1).padStart(3, "0")}`,
      "field-71": Math.round((6.5 + Math.random() * 2) * 100) / 100,
      "field-72": Math.round((5 + Math.random() * 10) * 10) / 10,
      "field-73": Math.round(Math.random() * 5 * 10) / 10,
      "field-74": Math.round((0.2 + Math.random() * 1.8) * 100) / 100,
      "field-75": Math.round((15 + Math.random() * 10) * 10) / 10,
      "field-76": Math.round((50 + Math.random() * 200) * 10) / 10,
      "field-77": Math.random() > 0.05,
      "field-78": ["Excellent", "Good", "Fair", "Poor", "Critical"][Math.floor(Math.random() * 5)],
      "field-79": new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    },
  })),

  // Fire Safety System submissions (29 entries)
  ...Array.from({ length: 29 }, (_, i) => ({
    id: `sub-fire-${i + 1}`,
    formId: "form-9",
    timestamp: new Date(Date.now() - i * 3 * 60 * 60 * 1000),
    values: {
      "field-80": `FS-${String(i + 1).padStart(3, "0")}`,
      "field-81": Math.round(Math.random() * 100),
      "field-82": Math.round(20 + Math.random() * 60),
      "field-83": Math.round(Math.random() * 50),
      "field-84": Math.random() > 0.95,
      "field-85": Math.random() > 0.1,
      "field-86": Math.round(70 + Math.random() * 30),
      "field-87": ["Office", "Warehouse", "Kitchen", "Server Room", "Exit"][Math.floor(Math.random() * 5)],
      "field-88": new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
    },
  })),

  // Parking Management submissions (37 entries)
  ...Array.from({ length: 37 }, (_, i) => ({
    id: `sub-parking-${i + 1}`,
    formId: "form-10",
    timestamp: new Date(Date.now() - i * 1 * 60 * 60 * 1000),
    values: {
      "field-90": `P-${String(i + 1).padStart(3, "0")}`,
      "field-91": Math.random() > 0.3,
      "field-92": ["Car", "SUV", "Truck", "Motorcycle", "Van"][Math.floor(Math.random() * 5)],
      "field-93": new Date(Date.now() - Math.random() * 12 * 60 * 60 * 1000),
      "field-94": Math.round(15 + Math.random() * 480),
      "field-95": Math.random() > 0.2,
      "field-96": ["Ground", "Level 1", "Level 2", "Level 3", "Roof"][Math.floor(Math.random() * 5)],
      "field-97": Math.random() > 0.05,
      "field-98": `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(
        Math.random() * 1000,
      )
        .toString()
        .padStart(3, "0")}`,
    },
  })),

  // Lighting Control System submissions (35 entries)
  ...Array.from({ length: 35 }, (_, i) => ({
    id: `sub-lighting-${i + 1}`,
    formId: "form-11",
    timestamp: new Date(Date.now() - i * 2 * 60 * 60 * 1000),
    values: {
      "field-100": `L-${String(i + 1).padStart(3, "0")}`,
      "field-101": Math.round(Math.random() * 100),
      "field-102": Math.round((5 + Math.random() * 45) * 10) / 10,
      "field-103": Math.random() > 0.7,
      "field-104": Math.round(Math.random() * 1000),
      "field-105": Math.random() > 0.4,
      "field-106": ["Manual", "Auto", "Schedule", "Motion", "Daylight"][Math.floor(Math.random() * 5)],
      "field-107": ["Lobby", "Office", "Corridor", "Parking", "Emergency"][Math.floor(Math.random() * 5)],
      "field-108": new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
    },
  })),

  // Waste Management System submissions (32 entries)
  ...Array.from({ length: 32 }, (_, i) => ({
    id: `sub-waste-${i + 1}`,
    formId: "form-12",
    timestamp: new Date(Date.now() - i * 6 * 60 * 60 * 1000),
    values: {
      "field-110": `WM-${String(i + 1).padStart(3, "0")}`,
      "field-111": Math.round(Math.random() * 100),
      "field-112": Math.round(10 + Math.random() * 190),
      "field-113": Math.round((15 + Math.random() * 20) * 10) / 10,
      "field-114": Math.random() > 0.7,
      "field-115": Math.random() > 0.6,
      "field-116": ["General", "Recyclable", "Organic", "Hazardous", "Electronic"][Math.floor(Math.random() * 5)],
      "field-117": ["Building A", "Building B", "Parking Lot", "Cafeteria", "Workshop"][Math.floor(Math.random() * 5)],
      "field-118": new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000),
    },
  })),
]

export const mockWorkspaces: Workspace[] = []

export const mockLists: List[] = []

export const mockTables: Table[] = []
