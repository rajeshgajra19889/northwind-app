export interface Customer {
    customer_id: string;
    company_name: string;
    contact_name: string;
    contact_title: string;
    city: string;
    country: string;

}

export interface DepartmentPagedRequest {
    pageNumber: number;
    pageSize: number;
    search: string;
    sortColumn: string;
    sortDirection: 'asc' | 'desc';
}