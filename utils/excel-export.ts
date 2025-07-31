import { utils, write } from "xlsx"
import { sensorTypes, sensorModels, modelSpecifications } from "@/lib/data"

// Excel configuration for styling and layout
const excelConfig = {
  rowHeights: {
    header: { hpt: 40 }, // Fixed height for header row
  },
  styles: {
    header: {
      font: {
        bold: true,
        color: { rgb: "FFFFFF" },
        name: "Arial",
        sz: 11,
      },
      fill: {
        fgColor: { rgb: "40C4FF" },
      },
      alignment: {
        vertical: "center",
        horizontal: "center",
        wrapText: true,
      },
      border: {
        top: { style: "medium", color: { rgb: "2A3744" } },
        bottom: { style: "medium", color: { rgb: "2A3744" } },
        left: { style: "medium", color: { rgb: "2A3744" } },
        right: { style: "medium", color: { rgb: "2A3744" } },
      },
    },
    cell: {
      font: {
        name: "Arial",
        sz: 10,
      },
      alignment: {
        vertical: "top",
        wrapText: true,
        horizontal: "center",
      },
      border: {
        top: { style: "thin", color: { rgb: "2A3744" } },
        bottom: { style: "thin", color: { rgb: "2A3744" } },
        left: { style: "thin", color: { rgb: "2A3744" } },
        right: { style: "thin", color: { rgb: "2A3744" } },
      },
    },
    specificationCell: {
      font: {
        name: "Consolas", // Monospaced font for specifications
        sz: 10,
      },
      alignment: {
        vertical: "top",
        wrapText: true,
        horizontal: "left",
      },
      border: {
        top: { style: "thin", color: { rgb: "2A3744" } },
        bottom: { style: "thin", color: { rgb: "2A3744" } },
        left: { style: "thin", color: { rgb: "2A3744" } },
        right: { style: "thin", color: { rgb: "2A3744" } },
      },
    },
  },
}

/**
 * Formats specifications into a single line with capitalized categories
 * @param {any} specs - The specifications data
 * @param {any} sensorTypeDetails - Details of the sensor type
 * @param {boolean} [isCustom=false] - Whether the model is custom
 * @returns {string} - Formatted specifications text
 */
const formatSpecifications = (specs, sensorTypeDetails, isCustom = false) => {
  if (!specs) return "No specifications available"

  const specArray = isCustom
    ? specs.map((spec) => ({
        name: spec.name.charAt(0).toUpperCase() + spec.name.slice(1), // Capitalize first letter
        options: spec.options.map((opt) => ({
          value: opt.value,
          label: opt.label,
        })),
      }))
    : Object.entries(specs).map(([name, options]) => {
        if (typeof options === "string") {
          options = sensorTypeDetails?.specifications[options] || []
        }
        return {
          name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize first letter
          options,
        }
      })

  return specArray
    .map(({ name, options }) => {
      const formattedOptions = Array.isArray(options)
        ? options.map((opt) => (typeof opt === "object" ? `${opt.value}=${opt.label}` : opt)).join(", ")
        : options.toString()
      return `${name}: ${formattedOptions}`
    })
    .join(" | ")
}

/**
 * Calculates the maximum length of content in each column
 * @param {any[][]} sheetData - Array of rows with data
 * @returns {number[]} - Array of maximum character lengths for each column
 */
const calculateMaxLengths = (sheetData) => {
  const maxLengths = [0, 0, 0, 0, 0] // For Model Code, Model Name, Type, Description, Specifications
  sheetData.forEach((row) => {
    row.forEach((cell, colIndex) => {
      const length = cell?.toString().length || 0
      if (length > maxLengths[colIndex]) maxLengths[colIndex] = length
    })
  })
  return maxLengths.map((length) => Math.min(Math.max(length + 2, 15), 100)) // Add buffer, min width 15, max width 100
}

/**
 * Applies styles and dynamic widths to the worksheet
 * @param {any} ws - The worksheet object
 * @param {number[]} maxLengths - Array of maximum column widths
 */
const applyWorksheetStyles = (ws, maxLengths) => {
  // Set dynamic column widths
  ws["!cols"] = maxLengths.map((length) => ({ wch: length }))

  // Set header row height; data rows auto-fit
  ws["!rows"] = [excelConfig.rowHeights.header]

  // Apply cell styles
  const range = utils.decode_range(ws["!ref"] || "A1:E1")
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell = utils.encode_cell({ r: R, c: C })
      if (!ws[cell]) ws[cell] = { v: "", t: "s" }

      if (R === 0) {
        ws[cell].s = excelConfig.styles.header
      } else {
        if (C === 4) {
          // Specifications column
          ws[cell].s = excelConfig.styles.specificationCell
        } else {
          ws[cell].s = excelConfig.styles.cell
        }
      }
    }
  }
}

/**
 * Exports sensor data to an Excel file
 * @param {string} selectedType - The type of sensor to export
 * @param {any[]} customProducts - Array of custom product data
 * @param {any[]} types - Array of all product types
 */
export const exportToExcel = (selectedType: string | null, customProducts: any[] = [], types: any[] = []) => {
  const wb = utils.book_new()

  // Prepare sheet data with headers
  const sheetData = [["Model Code", "Model Name", "Type", "Description", "Available Specifications"]]

  // Find type info from either sensorTypes or provided types
  let typeInfo = null
  let sensorTypeDetails = null

  if (selectedType) {
    // First try to find in sensorTypes
    sensorTypeDetails = sensorTypes.find((st) => st.id === selectedType)

    // If not found in sensorTypes, look in provided types
    if (!sensorTypeDetails) {
      typeInfo = types.find((t) => t.id === selectedType)
    } else {
      typeInfo = sensorTypeDetails
    }

    console.log("Type info for export:", { typeInfo, sensorTypeDetails })

    const standardModels = sensorModels[selectedType] || []
    const customTypeProducts = customProducts.filter((product) => product.type === selectedType)

    // Add standard models
    standardModels.forEach((model) => {
      const modelSpec = modelSpecifications[model.id]
      const description = `${model.name} - Standard model`
      const specifications = modelSpec
        ? formatSpecifications(modelSpec.availableOptions, sensorTypeDetails)
        : "Standard specifications"

      sheetData.push([model.code, model.name, typeInfo?.name || selectedType, description, specifications])
    })

    // Add custom products
    customTypeProducts.forEach((model) => {
      const specifications = model.specifications
        ? formatSpecifications(model.specifications, sensorTypeDetails, true)
        : "Custom specifications"

      sheetData.push([
        model.code,
        model.name,
        typeInfo?.name || selectedType,
        `${model.name} - Custom model`,
        specifications,
      ])
    })
  } else {
    // Export all types
    // First, add all standard models grouped by type
    sensorTypes.forEach((type) => {
      const standardModels = sensorModels[type.id] || []
      standardModels.forEach((model) => {
        const modelSpec = modelSpecifications[model.id]
        if (!modelSpec) return

        const description = `${model.name} - Standard model for ${type.name}`
        const specifications = formatSpecifications(modelSpec.availableOptions, type)

        sheetData.push([model.code, model.name, type.name, description, specifications])
      })
    })

    // Then add all custom products
    customProducts.forEach((model) => {
      const typeInfo = types.find((t) => t.id === model.type)
      const sensorTypeDetails = sensorTypes.find((st) => st.id === model.type)

      const specifications = model.specifications
        ? formatSpecifications(model.specifications, sensorTypeDetails, true)
        : "Custom specifications"

      sheetData.push([
        model.code,
        model.name,
        typeInfo?.name || "Unknown Type",
        `${model.name} - Custom model`,
        specifications,
      ])
    })
  }

  // Calculate maximum lengths for dynamic column widths
  const maxLengths = calculateMaxLengths(sheetData)

  // Create worksheet and apply styles
  const ws = utils.aoa_to_sheet(sheetData)
  applyWorksheetStyles(ws, maxLengths)

  // Add worksheet to workbook
  const sheetName = selectedType && typeInfo ? typeInfo.name.slice(0, 31) : "All Products"
  utils.book_append_sheet(wb, ws, sheetName)

  // Generate and download file
  const excelBuffer = write(wb, {
    bookType: "xlsx",
    type: "array",
    cellStyles: true,
  })

  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  })

  const url = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `${selectedType && typeInfo ? typeInfo.name.replace(/[^a-z0-9]/gi, "_") : "all_products"}-specifications-${
    new Date().toISOString().split("T")[0]
  }.xlsx`

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

