import type {
  Bottle,
  BottlePayload,
  Category,
  CategoryPayload,
  SubCategory,
  SubCategoryPayload,
  Storage,
  StoragePayload,
} from '@/types/api'

export function delay(ms = 200): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export class MockStore<T extends { id: number }, P> {
  private items: T[]
  private nextId: number

  constructor(seed: T[]) {
    this.items = [...seed]
    this.nextId = Math.max(0, ...seed.map(item => item.id)) + 1
  }

  list(): T[] {
    return this.items.map(item => ({ ...item }))
  }

  create(payload: P): T {
    const item = { ...payload, id: this.nextId++ } as T
    this.items.push(item)
    return { ...item }
  }

  update(id: number, payload: P): T {
    const index = this.items.findIndex(item => item.id === id)
    if (index === -1) throw new Error(`Item with id ${id} not found`)
    const item = { ...this.items[index], ...payload }
    this.items[index] = item
    return { ...item }
  }

  delete(id: number): void {
    const index = this.items.findIndex(item => item.id === id)
    if (index === -1) throw new Error(`Item with id ${id} not found`)
    this.items.splice(index, 1)
  }
}

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------

const seedCategories: Category[] = [
  { id: 1, name: 'Whiskey' },
  { id: 2, name: 'Gin' },
  { id: 3, name: 'Vodka' },
  { id: 4, name: 'Rum' },
  { id: 5, name: 'Tequila' },
  { id: 6, name: 'Brandy' },
  { id: 7, name: 'Liqueur' },
  { id: 8, name: 'Bitters' },
]

const seedSubCategories: SubCategory[] = [
  { id: 1, name: 'Bourbon', category_id: 1 },
  { id: 2, name: 'Rye', category_id: 1 },
  { id: 3, name: 'Scotch', category_id: 1 },
  { id: 4, name: 'Irish', category_id: 1 },
  { id: 5, name: 'Japanese', category_id: 1 },
  { id: 6, name: 'London Dry', category_id: 2 },
  { id: 7, name: 'Old Tom', category_id: 2 },
  { id: 8, name: 'White', category_id: 4 },
  { id: 9, name: 'Dark', category_id: 4 },
  { id: 10, name: 'Spiced', category_id: 4 },
  { id: 11, name: 'Blanco', category_id: 5 },
  { id: 12, name: 'Reposado', category_id: 5 },
  { id: 13, name: 'Anejo', category_id: 5 },
  { id: 14, name: 'Cognac', category_id: 6 },
  { id: 15, name: 'Armagnac', category_id: 6 },
  { id: 16, name: 'Amaro', category_id: 7 },
  { id: 17, name: 'Orange', category_id: 8 },
  { id: 18, name: 'Aromatic', category_id: 8 },
]

const seedStorage: Storage[] = [
  { id: 1, name: 'Bar Cart', room: 'Living Room', shelf: 'Top Shelf' },
  { id: 2, name: 'Bar Cart', room: 'Living Room', shelf: 'Bottom Shelf' },
  { id: 3, name: 'Whiskey Cabinet', room: 'Den', shelf: 'Top Shelf' },
  { id: 4, name: 'Whiskey Cabinet', room: 'Den', shelf: 'Middle Shelf' },
  { id: 5, name: 'Whiskey Cabinet', room: 'Den', shelf: 'Bottom Shelf' },
  { id: 6, name: 'Pantry', room: 'Kitchen', shelf: 'Top Shelf' },
]

const seedBottles: Bottle[] = [
  { id: 1, name: 'Buffalo Trace', category_id: 1, sub_category_ids: [1], storage_id: 1 },
  { id: 2, name: 'Woodford Reserve', category_id: 1, sub_category_ids: [1], storage_id: 3 },
  { id: 3, name: 'Bulleit Rye', category_id: 1, sub_category_ids: [2], storage_id: 3 },
  { id: 4, name: 'Rittenhouse Rye', category_id: 1, sub_category_ids: [2], storage_id: 1 },
  { id: 5, name: 'Lagavulin 16', category_id: 1, sub_category_ids: [3], storage_id: 4 },
  { id: 6, name: 'Laphroaig 10', category_id: 1, sub_category_ids: [3], storage_id: 4 },
  { id: 7, name: 'Redbreast 12', category_id: 1, sub_category_ids: [4], storage_id: 5 },
  { id: 8, name: 'Nikka Coffey Grain', category_id: 1, sub_category_ids: [5], storage_id: 5 },
  { id: 9, name: 'Tanqueray', category_id: 2, sub_category_ids: [6], storage_id: 1 },
  { id: 10, name: "Hendrick's", category_id: 2, sub_category_ids: [6], storage_id: 2 },
  { id: 11, name: "Tito's", category_id: 3, sub_category_ids: [], storage_id: 6 },
  { id: 12, name: 'Diplomático Reserva Exclusiva', category_id: 4, sub_category_ids: [9], storage_id: 2 },
  { id: 13, name: 'Plantation 3 Stars', category_id: 4, sub_category_ids: [8], storage_id: 2 },
  { id: 14, name: 'Espolòn Blanco', category_id: 5, sub_category_ids: [11], storage_id: 1 },
  { id: 15, name: 'Fortaleza Reposado', category_id: 5, sub_category_ids: [12], storage_id: 6 },
  { id: 16, name: 'Rémy Martin VSOP', category_id: 6, sub_category_ids: [14], storage_id: 5 },
  { id: 17, name: 'Angostura Bitters', category_id: 8, sub_category_ids: [18], storage_id: 1 },
]

// ---------------------------------------------------------------------------
// Exported store instances
// ---------------------------------------------------------------------------

export const categoryStore = new MockStore<Category, CategoryPayload>(seedCategories)
export const subCategoryStore = new MockStore<SubCategory, SubCategoryPayload>(seedSubCategories)
export const storageStore = new MockStore<Storage, StoragePayload>(seedStorage)
export const bottleStore = new MockStore<Bottle, BottlePayload>(seedBottles)
