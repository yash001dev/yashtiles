export interface FrameCustomization {
  material: "classic" | "frameless" | "canvas";
  frameColor: "black" | "white" | "oak";
  size:
    | "8x8"
    | "8x10"
    | "10x8"
    | "9x12"
    | "12x9"
    | "12x12"
    | "12x18"
    | "18x12"
    | "18x18"
    | "18x24"
    | "24x18"
    | "24x32"
    | "32x24";
  effect: "original" | "silver" | "noir" | "vivid" | "dramatic";
  border: boolean;
  borderColor?: string;
  borderWidth?: number;
}

export interface FrameItem {
  id: string;
  image: UploadedImage;
  customization: FrameCustomization;
  createdAt: Date;
}

export interface FrameCollection {
  frames: FrameItem[];
  activeFrameId: string | null;
}

export interface MaterialOption {
  id: "classic" | "frameless" | "canvas";
  name: string;
  image: string;
  description: string;
}

export interface FrameColorOption {
  id: "black" | "white" | "oak";
  name: string;
  color: string;
  description: string;
}

export interface SizeOption {
  id:
    | "8x8"
    | "8x10"
    | "10x8"
    | "9x12"
    | "12x9"
    | "12x12"
    | "12x18"
    | "18x12"
    | "18x18"
    | "18x24"
    | "24x18"
    | "24x32"
    | "32x24";
  name: string;
  dimensions: string;
  aspectRatio: number;
  price: number;
}

export interface EffectOption {
  id: "original" | "silver" | "noir" | "vivid" | "dramatic";
  name: string;
  filter: string;
}

export interface ImageTransform {
  scale: number;
  rotation: number;
  x: number;
  y: number;
}

export interface UploadedImage {
  file: File;
  url: string;
  transform: ImageTransform;
}

export interface BorderOption {
  id: string;
  name: string;
  color: string;
  width: number;
  preview: string;
}

// Email verification types
export interface VerifyEmailDto {
  email: string;
  token: string;
}

export interface ResetPasswordDto {
  email: string;
  token: string;
  newPassword: string;
}

export interface VerifyEmailResponse {
  message: string;
  user: any;
  accessToken: string;
}

export interface Order {
  _id: string;
  userId: string;
  orderNumber: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  totalAmount: number;
  shippingCost: number;
  taxAmount: number;
  txnid: number;
  shippingAddress: Address;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  notes?: string;
  statusHistory: StatusHistoryItem[];
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface OrderItem {
  _id: string;
  productId: string;
  quantity: number;
  price: number;
  size: string;
  frameType: string;
  imageUrl: string;
}

export interface Address {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface StatusHistoryItem {
  _id: string;
  status: string;
  timestamp: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

export interface OrdersResponse {
  orders: Order[];
  pagination: PaginationMeta;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}
