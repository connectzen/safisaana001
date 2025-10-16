export type ProductType = 'plugin' | 'ebook' | 'course';

export interface ProductFormData {
  title: string;
  type: ProductType;
  price: number;
  imageUrl: string;
  fileUrl: string;
  shortDescription: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product extends Omit<ProductFormData, 'createdAt' | 'updatedAt'> {
  id: string;
  createdAt: string;
  updatedAt: string;
}
