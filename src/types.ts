
export interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: {
        rate: number;
        count: number;
    };
}

export interface CartItem extends Product {
    quantity: number;
}

export interface OrderItem {
    id: string; 
    name: string;
    quantity: number;
    price: number;
    image: string; 
}

export interface Order {
    id: string;
    userId: string; 
    items: OrderItem[];
    totalPrice: number;
    createdAt: any; 
}
