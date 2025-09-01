import { tool } from "ai"
import { z } from "zod"

export const unitConverterTool = tool({
  description:
    "Convert between different units of measurement (length, weight, temperature, volume, etc.).",
  inputSchema: z.object({
    value: z.number().describe("The value to convert"),
    fromUnit: z
      .string()
      .describe("The source unit (e.g., 'm', 'kg', 'C', 'gal')"),
    toUnit: z.string().describe("The target unit (e.g., 'ft', 'lb', 'F', 'L')"),
    category: z
      .enum([
        "length",
        "weight",
        "temperature",
        "volume",
        "area",
        "speed",
        "time",
        "digital",
      ])
      .optional()
      .describe("Optional category to help with conversion"),
  }),
  execute: async ({ value, fromUnit, toUnit, category }) => {
    const result = convertUnit(value, fromUnit, toUnit, category)

    if (result === null) {
      throw new Error(
        `Cannot convert from ${fromUnit} to ${toUnit}. Unsupported unit combination.`
      )
    }

    return result
  },
})

export interface UnitConversionResult {
  value: number
  fromUnit: string
  toUnit: string
  result: number
  category: string
}

// Conversion functions
function convertUnit(
  value: number,
  fromUnit: string,
  toUnit: string,
  category?: string
): UnitConversionResult | null {
  const from = fromUnit.toLowerCase()
  const to = toUnit.toLowerCase()

  // Temperature conversions
  if (isTemperature(from) || isTemperature(to)) {
    const result = convertTemperature(value, from, to)
    if (result !== null) {
      return { value, fromUnit, toUnit, result, category: "temperature" }
    }
  }

  // Length conversions
  if (isLength(from) || isLength(to)) {
    const result = convertLength(value, from, to)
    if (result !== null) {
      return { value, fromUnit, toUnit, result, category: "length" }
    }
  }

  // Weight conversions
  if (isWeight(from) || isWeight(to)) {
    const result = convertWeight(value, from, to)
    if (result !== null) {
      return { value, fromUnit, toUnit, result, category: "weight" }
    }
  }

  // Volume conversions
  if (isVolume(from) || isVolume(to)) {
    const result = convertVolume(value, from, to)
    if (result !== null) {
      return { value, fromUnit, toUnit, result, category: "volume" }
    }
  }

  // Area conversions
  if (isArea(from) || isArea(to)) {
    const result = convertArea(value, from, to)
    if (result !== null) {
      return { value, fromUnit, toUnit, result, category: "area" }
    }
  }

  // Speed conversions
  if (isSpeed(from) || isSpeed(to)) {
    const result = convertSpeed(value, from, to)
    if (result !== null) {
      return { value, fromUnit, toUnit, result, category: "speed" }
    }
  }

  // Digital storage conversions
  if (isDigital(from) || isDigital(to)) {
    const result = convertDigital(value, from, to)
    if (result !== null) {
      return { value, fromUnit, toUnit, result, category: "digital" }
    }
  }

  return null
}

// Temperature conversions
function isTemperature(unit: string): boolean {
  return [
    "c",
    "f",
    "k",
    "celsius",
    "fahrenheit",
    "kelvin",
    "°c",
    "°f",
    "°k",
  ].includes(unit)
}

function convertTemperature(
  value: number,
  from: string,
  to: string
): number | null {
  // Convert to Celsius first
  let celsius: number

  switch (from) {
    case "c":
    case "celsius":
    case "°c":
      celsius = value
      break
    case "f":
    case "fahrenheit":
    case "°f":
      celsius = ((value - 32) * 5) / 9
      break
    case "k":
    case "kelvin":
    case "°k":
      celsius = value - 273.15
      break
    default:
      return null
  }

  // Convert from Celsius to target
  switch (to) {
    case "c":
    case "celsius":
    case "°c":
      return celsius
    case "f":
    case "fahrenheit":
    case "°f":
      return (celsius * 9) / 5 + 32
    case "k":
    case "kelvin":
    case "°k":
      return celsius + 273.15
    default:
      return null
  }
}

// Length conversions (meters as base)
function isLength(unit: string): boolean {
  return [
    "m",
    "km",
    "cm",
    "mm",
    "mi",
    "yd",
    "ft",
    "in",
    "meter",
    "meters",
    "kilometer",
    "kilometers",
    "centimeter",
    "centimeters",
    "millimeter",
    "millimeters",
    "mile",
    "miles",
    "yard",
    "yards",
    "foot",
    "feet",
    "inch",
    "inches",
  ].includes(unit)
}

function convertLength(value: number, from: string, to: string): number | null {
  // Convert to meters first
  let meters: number

  switch (from) {
    case "m":
    case "meter":
    case "meters":
      meters = value
      break
    case "km":
    case "kilometer":
    case "kilometers":
      meters = value * 1000
      break
    case "cm":
    case "centimeter":
    case "centimeters":
      meters = value / 100
      break
    case "mm":
    case "millimeter":
    case "millimeters":
      meters = value / 1000
      break
    case "mi":
    case "mile":
    case "miles":
      meters = value * 1609.344
      break
    case "yd":
    case "yard":
    case "yards":
      meters = value * 0.9144
      break
    case "ft":
    case "foot":
    case "feet":
      meters = value * 0.3048
      break
    case "in":
    case "inch":
    case "inches":
      meters = value * 0.0254
      break
    default:
      return null
  }

  // Convert from meters to target
  switch (to) {
    case "m":
    case "meter":
    case "meters":
      return meters
    case "km":
    case "kilometer":
    case "kilometers":
      return meters / 1000
    case "cm":
    case "centimeter":
    case "centimeters":
      return meters * 100
    case "mm":
    case "millimeter":
    case "millimeters":
      return meters * 1000
    case "mi":
    case "mile":
    case "miles":
      return meters / 1609.344
    case "yd":
    case "yard":
    case "yards":
      return meters / 0.9144
    case "ft":
    case "foot":
    case "feet":
      return meters / 0.3048
    case "in":
    case "inch":
    case "inches":
      return meters / 0.0254
    default:
      return null
  }
}

// Weight conversions (grams as base)
function isWeight(unit: string): boolean {
  return [
    "g",
    "kg",
    "mg",
    "lb",
    "oz",
    "ton",
    "gram",
    "grams",
    "kilogram",
    "kilograms",
    "milligram",
    "milligrams",
    "pound",
    "pounds",
    "ounce",
    "ounces",
    "tons",
  ].includes(unit)
}

function convertWeight(value: number, from: string, to: string): number | null {
  // Convert to grams first
  let grams: number

  switch (from) {
    case "g":
    case "gram":
    case "grams":
      grams = value
      break
    case "kg":
    case "kilogram":
    case "kilograms":
      grams = value * 1000
      break
    case "mg":
    case "milligram":
    case "milligrams":
      grams = value / 1000
      break
    case "lb":
    case "pound":
    case "pounds":
      grams = value * 453.59237
      break
    case "oz":
    case "ounce":
    case "ounces":
      grams = value * 28.349523125
      break
    case "ton":
    case "tons":
      grams = value * 907184.74 // US ton
      break
    default:
      return null
  }

  // Convert from grams to target
  switch (to) {
    case "g":
    case "gram":
    case "grams":
      return grams
    case "kg":
    case "kilogram":
    case "kilograms":
      return grams / 1000
    case "mg":
    case "milligram":
    case "milligrams":
      return grams * 1000
    case "lb":
    case "pound":
    case "pounds":
      return grams / 453.59237
    case "oz":
    case "ounce":
    case "ounces":
      return grams / 28.349523125
    case "ton":
    case "tons":
      return grams / 907184.74
    default:
      return null
  }
}

// Volume conversions (liters as base)
function isVolume(unit: string): boolean {
  return [
    "l",
    "ml",
    "gal",
    "qt",
    "pt",
    "cup",
    "liter",
    "liters",
    "milliliter",
    "milliliters",
    "gallon",
    "gallons",
    "quart",
    "quarts",
    "pint",
    "pints",
    "cups",
  ].includes(unit)
}

function convertVolume(value: number, from: string, to: string): number | null {
  // Convert to liters first
  let liters: number

  switch (from) {
    case "l":
    case "liter":
    case "liters":
      liters = value
      break
    case "ml":
    case "milliliter":
    case "milliliters":
      liters = value / 1000
      break
    case "gal":
    case "gallon":
    case "gallons":
      liters = value * 3.78541
      break
    case "qt":
    case "quart":
    case "quarts":
      liters = value * 0.946353
      break
    case "pt":
    case "pint":
    case "pints":
      liters = value * 0.473176
      break
    case "cup":
    case "cups":
      liters = value * 0.236588
      break
    default:
      return null
  }

  // Convert from liters to target
  switch (to) {
    case "l":
    case "liter":
    case "liters":
      return liters
    case "ml":
    case "milliliter":
    case "milliliters":
      return liters * 1000
    case "gal":
    case "gallon":
    case "gallons":
      return liters / 3.78541
    case "qt":
    case "quart":
    case "quarts":
      return liters / 0.946353
    case "pt":
    case "pint":
    case "pints":
      return liters / 0.473176
    case "cup":
    case "cups":
      return liters / 0.236588
    default:
      return null
  }
}

// Area conversions (square meters as base)
function isArea(unit: string): boolean {
  return [
    "m2",
    "km2",
    "cm2",
    "ft2",
    "yd2",
    "acre",
    "hectare",
    "sqm",
    "sqft",
    "sqyd",
    "square meter",
    "square meters",
    "square kilometer",
    "square kilometers",
    "square centimeter",
    "square centimeters",
    "square foot",
    "square feet",
    "square yard",
    "square yards",
    "acres",
    "hectares",
  ].includes(unit)
}

function convertArea(value: number, from: string, to: string): number | null {
  // Convert to square meters first
  let sqMeters: number

  switch (from) {
    case "m2":
    case "sqm":
    case "square meter":
    case "square meters":
      sqMeters = value
      break
    case "km2":
    case "square kilometer":
    case "square kilometers":
      sqMeters = value * 1000000
      break
    case "cm2":
    case "square centimeter":
    case "square centimeters":
      sqMeters = value / 10000
      break
    case "ft2":
    case "sqft":
    case "square foot":
    case "square feet":
      sqMeters = value * 0.092903
      break
    case "yd2":
    case "sqyd":
    case "square yard":
    case "square yards":
      sqMeters = value * 0.836127
      break
    case "acre":
    case "acres":
      sqMeters = value * 4046.86
      break
    case "hectare":
    case "hectares":
      sqMeters = value * 10000
      break
    default:
      return null
  }

  // Convert from square meters to target
  switch (to) {
    case "m2":
    case "sqm":
    case "square meter":
    case "square meters":
      return sqMeters
    case "km2":
    case "square kilometer":
    case "square kilometers":
      return sqMeters / 1000000
    case "cm2":
    case "square centimeter":
    case "square centimeters":
      return sqMeters * 10000
    case "ft2":
    case "sqft":
    case "square foot":
    case "square feet":
      return sqMeters / 0.092903
    case "yd2":
    case "sqyd":
    case "square yard":
    case "square yards":
      return sqMeters / 0.836127
    case "acre":
    case "acres":
      return sqMeters / 4046.86
    case "hectare":
    case "hectares":
      return sqMeters / 10000
    default:
      return null
  }
}

// Speed conversions (m/s as base)
function isSpeed(unit: string): boolean {
  return [
    "mps",
    "kph",
    "mph",
    "knot",
    "fps",
    "meters/second",
    "kilometers/hour",
    "miles/hour",
    "feet/second",
    "knots",
  ].includes(unit)
}

function convertSpeed(value: number, from: string, to: string): number | null {
  // Convert to m/s first
  let mps: number

  switch (from) {
    case "mps":
    case "meters/second":
      mps = value
      break
    case "kph":
    case "kilometers/hour":
      mps = value / 3.6
      break
    case "mph":
    case "miles/hour":
      mps = value * 0.44704
      break
    case "knot":
    case "knots":
      mps = value * 0.514444
      break
    case "fps":
    case "feet/second":
      mps = value * 0.3048
      break
    default:
      return null
  }

  // Convert from m/s to target
  switch (to) {
    case "mps":
    case "meters/second":
      return mps
    case "kph":
    case "kilometers/hour":
      return mps * 3.6
    case "mph":
    case "miles/hour":
      return mps / 0.44704
    case "knot":
    case "knots":
      return mps / 0.514444
    case "fps":
    case "feet/second":
      return mps / 0.3048
    default:
      return null
  }
}

// Digital storage conversions (bytes as base)
function isDigital(unit: string): boolean {
  return [
    "b",
    "kb",
    "mb",
    "gb",
    "tb",
    "byte",
    "bytes",
    "kilobyte",
    "kilobytes",
    "megabyte",
    "megabytes",
    "gigabyte",
    "gigabytes",
    "terabyte",
    "terabytes",
  ].includes(unit)
}

function convertDigital(
  value: number,
  from: string,
  to: string
): number | null {
  // Convert to bytes first
  let bytes: number

  switch (from) {
    case "b":
    case "byte":
    case "bytes":
      bytes = value
      break
    case "kb":
    case "kilobyte":
    case "kilobytes":
      bytes = value * 1024
      break
    case "mb":
    case "megabyte":
    case "megabytes":
      bytes = value * 1024 * 1024
      break
    case "gb":
    case "gigabyte":
    case "gigabytes":
      bytes = value * 1024 * 1024 * 1024
      break
    case "tb":
    case "terabyte":
    case "terabytes":
      bytes = value * 1024 * 1024 * 1024 * 1024
      break
    default:
      return null
  }

  // Convert from bytes to target
  switch (to) {
    case "b":
    case "byte":
    case "bytes":
      return bytes
    case "kb":
    case "kilobyte":
    case "kilobytes":
      return bytes / 1024
    case "mb":
    case "megabyte":
    case "megabytes":
      return bytes / (1024 * 1024)
    case "gb":
    case "gigabyte":
    case "gigabytes":
      return bytes / (1024 * 1024 * 1024)
    case "tb":
    case "terabyte":
    case "terabytes":
      return bytes / (1024 * 1024 * 1024 * 1024)
    default:
      return null
  }
}

export default unitConverterTool
