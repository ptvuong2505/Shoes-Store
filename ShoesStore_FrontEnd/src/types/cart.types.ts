export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  variantLabel?: string;
  color?: string;
  size: string;
  quantity: number;
  unitPrice: number;
  imageUrl: string;
  isAvailable: boolean;
  selected: boolean;
}

export interface CartSummary {
  selectedItems: number;
  selectedSubtotal: number;
  shippingFee: number;
  estimatedTax: number;
  totalPrice: number;
}

export interface CartResponse {
  items: CartItem[];
  summary?: CartSummary;
}
