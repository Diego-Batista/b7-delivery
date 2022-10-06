export type Product = {
    id: number;
    image: string;
    categoryName: string;
    name: string;
    price: number;
    min?: number;
    max?: number;
    description?: string;
}