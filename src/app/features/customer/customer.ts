export interface Customer {
    customerId: string;
    companyName: string;
    contactName: string | null;
    contactTitle: string | null;
    address: string | null;
    city: string | null;
    region: string | null;
    postalCode: string | null;
    country: string | null;
    phone: string | null;
    fax: string | null;
}

export interface DepartmentPagedRequest {
    pageNumber: number;
    pageSize: number;
    search: string;
    sortColumn: string;
    sortDirection: 'asc' | 'desc';
}