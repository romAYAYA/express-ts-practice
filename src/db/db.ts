export type ProductType = {
  id: number
  title: string
  productsCount: number
}

export const db: { products: ProductType[] } = {
  products: [
    { id: 1, title: 'tomato', productsCount: 15 },
    { id: 2, title: 'orange', productsCount: 19 },
    { id: 3, title: 'juice', productsCount: 5634 },
    { id: 4, title: 'laptop', productsCount: 23 },
  ],
}

export type dbType = {products: ProductType[]}