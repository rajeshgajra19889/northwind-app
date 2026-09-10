import { Routes } from '@angular/router';
import { CustomerList } from './features/customer/customer-list/customer-list';
import { AdminLayout } from './features/layout/admin-layout/admin-layout';
import { CustomerForm } from './features/customer/customer-form/customer-form';
import { CustomerOrders } from './features/customer/customer-orders/customer-orders';
import { ProductList } from './features/product/product-list/product-list';
import { ProductForm } from './features/product/product-form/product-form';
import { EmployeeList } from './features/employee/employee-list/employee-list';
import { EmployeeForm } from './features/employee/employee-form/employee-form';
import { CategoryList } from './features/category/category-list/category-list';
import { CategoryForm } from './features/category/category-form/category-form';
import { OrderList } from './features/order/order-list/order-list';
import { OrderForm } from './features/order/order-form/order-form';
import { OrderDetailPage } from './features/order/order-detail-page/order-detail-page';
import { RegionList } from './features/region/region-list/region-list';
import { RegionForm } from './features/region/region-form/region-form';
import { TerritoryList } from './features/territory/territory-list/territory-list';
import { TerritoryForm } from './features/territory/territory-form/territory-form';
import { EmployeeDetail } from './features/employee/employee-detail/employee-detail';
import { ShipperList } from './features/shipper/shipper-list/shipper-list';
import { ShipperForm } from './features/shipper/shipper-form/shipper-form';
import { SupplierList } from './features/supplier/supplier-list/supplier-list';
import { SupplierForm } from './features/supplier/supplier-form/supplier-form';
import { SupplierDetail } from './features/supplier/supplier-detail/supplier-detail';
import { EmployeeOrders } from './features/employee/employee-orders/employee-orders';
import { Dashboard } from './features/dashboard/dashboard';

export const routes: Routes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },
      { path: 'customers', component: CustomerList },
      { path: 'customers/new', component: CustomerForm },
      { path: 'customers/edit/:id', component: CustomerForm },
      { path: 'customers/orders/:id', component: CustomerOrders },
      { path: 'products', component: ProductList },
      { path: 'products/new', component: ProductForm },
      { path: 'products/edit/:id', component: ProductForm },
      { path: 'employees', component: EmployeeList },
      { path: 'employees/new', component: EmployeeForm },
      { path: 'employees/edit/:id', component: EmployeeForm },
      { path: 'employees/details/:id', component: EmployeeDetail },
      { path: 'employees/orders/:id', component: EmployeeOrders },
      { path: 'categories', component: CategoryList },
      { path: 'categories/new', component: CategoryForm },
      { path: 'categories/edit/:id', component: CategoryForm },
      { path: 'suppliers', component: SupplierList },
      { path: 'suppliers/new', component: SupplierForm },
      { path: 'suppliers/edit/:id', component: SupplierForm },
      { path: 'suppliers/details/:id', component: SupplierDetail },
      { path: 'orders', component: OrderList },
      { path: 'orders/new', component: OrderForm },
      { path: 'orders/edit/:id', component: OrderForm },
      { path: 'orders/details/:id', component: OrderDetailPage },
      { path: 'regions', component: RegionList },
      { path: 'regions/new', component: RegionForm },
      { path: 'regions/edit/:id', component: RegionForm },
      { path: 'territories', component: TerritoryList },
      { path: 'territories/new', component: TerritoryForm },
      { path: 'territories/edit/:id', component: TerritoryForm },
      { path: 'shippers', component: ShipperList },
      { path: 'shippers/new', component: ShipperForm },
      { path: 'shippers/edit/:id', component: ShipperForm },
    ],
  },
];
