export interface Product {
  productId?: number;
  productName: string;
  supplierId?: number | null;
  categoryId?: number | null;
  quantityPerUnit?: string;
  unitPrice?: number | null;
  unitsInStock?: number | null;
  unitsOnOrder?: number | null;
  reorderLevel?: number | null;
  discontinued: boolean;
}

export interface Category {
  categoryId: number;
  categoryName: string;
}

export interface Supplier {
  supplierId: number;
  companyName: string;
}

