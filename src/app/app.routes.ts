import { Routes } from '@angular/router';
import { CustomerList } from './features/customer/customer-list/customer-list';
import { AdminLayout } from './features/layout/admin-layout/admin-layout';

export const routes: Routes = [
    {
        path: '',
        component: AdminLayout,
        children: [
            { path: 'customers', component: CustomerList }
        ]
    }
];
