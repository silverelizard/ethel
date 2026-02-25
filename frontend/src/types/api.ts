export interface Bottle {
  id: number
  name: string
  category_id: number
  sub_category_ids: number[]
  storage_id: number
}

export interface BottlePayload {
  name: string
  category_id: number
  sub_category_ids: number[]
  storage_id: number
}

export interface Category {
  id: number
  name: string
}

export interface CategoryPayload {
  name: string
}

export interface SubCategory {
  id: number
  name: string
  category_id: number
}

export interface SubCategoryPayload {
  name: string
  category_id: number
}

export interface Storage {
  id: number
  name: string
  room: string
  shelf: string
}

export interface StoragePayload {
  name: string
  room: string
  shelf: string
}

export interface ApiErrorResponse {
  details: string
}
