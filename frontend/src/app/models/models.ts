export interface AuthToken {
    access: string;
};

export interface SignUpToken {
    username: string;
    first_name: string;
    last_name: string;
    password: string;
    email: string;
};

export interface Product {
    id:number
    user:string;
    name: string;
    image: string;
    price: number;
    rating: number;
    category_id:number;
    brand: string;
    description:string;
};


export interface Category{
    id:number;
    name:string;
}


export interface PaginatedProducts {
    count: number;
    next: string | null;
    previous: string | null;
    results: Product[];
}
  

export interface Review {
    product: number;
    content: string;
    rating: number;
    
}


export interface CartItem {
    id: any;
    product: number;
    quantity: number;
  }
  
export interface Cart {
    items: CartItem[];
    enrichedItems?: any[];
  }

