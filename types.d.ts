export interface Item {
  name: string;
  categoryId: number;
  locationId: number;
  delivery: string;
  description: string;
  image: string | null;
}

export interface Category {
  title: string;
  description: string;
}