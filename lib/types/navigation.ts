export type NavigationLink = {
  href: string
  label: string
  current?: boolean
  hasDropdown?: boolean
}

export type ProductCategory = {
  title: string
  items: {
    name: string
    href: string
  }[]
}

export type MegaMenuData = {
  categories: ProductCategory[]
}

