export interface Vehicle {
  id: string;
  title: string;
  price: number;
  description: string;
  features: string[];
  specifications: {
    [key: string]: string;
  };
  images: string[];
  // ... any other existing properties
} 