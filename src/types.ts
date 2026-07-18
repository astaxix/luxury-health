export type Category = string;

export interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  imageUrl: string;
  category: Category;
  affiliateUrl: string;
  isTrending?: boolean;
}
