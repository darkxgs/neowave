export const getCustomProductSpecifications = (product: any) => {
  console.log("Custom product data:", product)

  const modelSpec = {
    name: product.name,
    generateCode: (specs: Record<string, string>) => {
      const allSpecsSelected = product.specifications.every((spec: any) => specs[spec.name])
      if (!allSpecsSelected) return ""

      const specCodes = product.specifications.map((spec: any) => {
        const selectedOption = spec.options.find((opt: any) => opt.value === specs[spec.name])
        return selectedOption?.code || ""
      })

      const baseCode = product.code.split("-").slice(0, -specCodes.length).join("-")
      return `${baseCode}-${specCodes.join("-")}`
    },
    availableOptions: product.specifications.reduce((acc: any, spec: any) => {
      acc[spec.name] = spec.options
      return acc
    }, {}),
  }

  console.log("Processed modelSpec for custom product:", modelSpec)
  return modelSpec
}

