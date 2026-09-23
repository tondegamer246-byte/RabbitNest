export type RabbitColorType = 'Black & White' | 'Pure White';

export type Gender = 'Male' | 'Female';

export type RabbitSize = 'Small' | 'Medium' | 'Large';

export type BadgeType = 'Fast Selling' | 'Popular Choice' | 'Special Offer' | 'Bulk Savings';

export interface SizePricing {
  originalPrice: number;
  sellingPrice: number;
  weight: string;
}

export interface RabbitProduct {
  id: string;
  title: string;
  colorType: RabbitColorType;
  gender: Gender;
  defaultSize: RabbitSize;
  sizePricing: Record<RabbitSize, SizePricing>;
  image: string;
  description: string;
  age: string;
  badge?: BadgeType;
  temperament: string;
  diet: string;
  healthChecked: boolean;
  dewormed: boolean;
  // Clear demo statistics for product page
  demoRating?: number;
  demoReviewsCount?: number;
  demoPurchasesCount?: string;
  demoReviews?: {
    author: string;
    city: string;
    rating: number;
    date: string;
    comment: string;
  }[];
}

export interface CartItem {
  cartItemId: string; // unique per product + size combination
  productId: string;
  title: string;
  colorType: RabbitColorType;
  gender: Gender;
  size: RabbitSize;
  image: string;
  originalPrice: number;
  sellingPrice: number;
  quantity: number;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrderValue?: number;
  description: string;
}

export interface BulkDiscountTier {
  minQuantity: number;
  percentage: number;
  label: string;
}

export interface CustomerDetails {
  fullName: string;
  phone?: string;
  address?: string;
  email?: string;
  city?: string;
  state?: string;
  pincode?: string;
  notes?: string;
}

export type OrderStatus = 'Order Placed' | 'Processing' | 'Confirmed';

export interface Order {
  orderId: string;
  timestamp: string;
  customer: CustomerDetails;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  bulkDiscountAmount: number;
  bulkDiscountTierName?: string;
  couponDiscountAmount: number;
  appliedCouponCode?: string;
  shipping: number;
  finalTotal: number;
  paymentMethod?: string;
  whatsAppMessage: string;
  status: OrderStatus;
}

export interface CartNotification {
  id: string;
  title: string;
  size: RabbitSize;
  quantity: number;
  image: string;
  price: number;
  type: 'added' | 'updated' | 'removed';
}

export interface CustomerReview {
  id: string;
  author: string;
  city: string;
  rating: number; // 1 to 5
  date: string;
  rabbitTitle: string;
  colorType: RabbitColorType;
  comment: string;
  verifiedBuyer: boolean;
  isSample?: boolean; // clearly marks demo/sample entries as required
}

