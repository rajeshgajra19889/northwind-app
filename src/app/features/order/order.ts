export interface Order {
  orderId?: number;
  customerId?: string | null;
  employeeId?: number | null;
  orderDate?: string | null;
  requiredDate?: string | null;
  shippedDate?: string | null;
  shipVia?: number | null;
  freight?: number | null;
  shipName?: string | null;
  shipAddress?: string | null;
  shipCity?: string | null;
  shipRegion?: string | null;
  shipPostalCode?: string | null;
  shipCountry?: string | null;
  customerName?: string | null;
  employeeName?: string | null;
}

export interface OrderListItem {
  orderId: number;
  customerName: string | null;
  employeeName: string | null;
  orderDate: string | null;
  freight: number | null;
  shipCity: string | null;
  shipCountry: string | null;
}