export type ProductType = {
  id: string
  name: string
}

export type ProductCategory = {
  id: string
  name: string
  types: ProductType[]
}

export type CategoryContextType = {
  categories: ProductCategory[]
  updateCategories: (categories: ProductCategory[]) => Promise<void>
  isLoading: boolean
  error: string | null
}

