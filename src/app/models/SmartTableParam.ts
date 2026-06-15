export interface Sort {
    Predicate: string;  
    Reverse: boolean;  
}

export interface Pagination {
    Page: number;       
    PageSize: number;  
    TotalItems: number; 
    Start: number;      
}


export interface Search {

    PredicateObject: Record<string, any>; 
}


export interface SmartTableParam {
    pagination?: Partial<Pagination>;
    sort?: Partial<Sort>;
    search?: Partial<Search>;
}


export interface SmartTableResult<T> {
    data: T[];         
    total: number;     
}