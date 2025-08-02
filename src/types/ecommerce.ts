/**
 * Types for ecommerce tracking
 */

/**
 * Product item for ecommerce tracking
 */
export type ProductItem = {
  item_id: string;
  item_name: string;
  price: number;
  quantity: number;
  item_category?: string;
  item_variant?: string;
  discount?: number;
  currency?: string;
};

/**
 * Order details for purchase tracking
 */
export type OrderDetails = {
  transaction_id: string;
  value: number;
  tax?: number;
  shipping?: number;
  currency?: string;
  coupon?: string;
  items: ProductItem[];
};