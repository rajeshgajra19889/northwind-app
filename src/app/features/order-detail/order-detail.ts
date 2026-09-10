export interface OrderDetail {
  orderId?: number;
  productId?: number;
  unitPrice?: number | null;
  quantity?: number | null;
  discount?: number | null;
}

export interface OrderDetailListItem {
  orderId: number;
  productId: number;
  productName: string | null;
  orderDate: string | null;
  unitPrice: number | null;
  quantity: number | null;
  discount: number | null;
  lineTotal: number;
}