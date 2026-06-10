export type UserRole = "customer" | "admin";
export type OrderStatus =
  | "order_received"
  | "payment_confirmed"
  | "accepted"
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type PaymentMethod = "razorpay" | "cod";
export type DiscountType = "percentage" | "fixed";
export type NotificationType =
  | "order_placed"
  | "payment_success"
  | "order_accepted"
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "new_order"
  | "payment_received"
  | "refund_requested";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  is_blocked: boolean;
  loyalty_points: number;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  label: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  image_url: string | null;
  is_available: boolean;
  is_featured: boolean;
  is_special: boolean;
  is_popular: boolean;
  sort_order: number;
  avg_rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  sort_order: number;
  created_at: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discount_type: DiscountType;
  discount_value: number;
  min_order_value: number;
  max_discount: number | null;
  usage_limit: number | null;
  used_count: number;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  subtotal: number;
  discount_amount: number;
  delivery_fee: number;
  loyalty_points_used: number;
  loyalty_discount: number;
  total: number;
  coupon_id: string | null;
  coupon_code: string | null;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  delivery_notes: string | null;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  loyalty_points_earned: number;
  cancelled_reason: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_image: string | null;
  unit_price: number;
  quantity: number;
  total_price: number;
  created_at: string;
}

export interface Payment {
  id: string;
  order_id: string;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  razorpay_signature: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: string | null;
  raw_response: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  order_id: string | null;
  rating: number;
  comment: string | null;
  image_url: string | null;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
  profile?: Profile;
}

export interface Favorite {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
}

export interface LoyaltyPoint {
  id: string;
  user_id: string;
  order_id: string | null;
  points: number;
  description: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string | null;
  type: NotificationType;
  title: string;
  message: string;
  data: Record<string, unknown> | null;
  is_read: boolean;
  created_at: string;
}

export interface Setting {
  id: string;
  key: string;
  value: unknown;
  updated_at: string;
}

type InsertRow<T> = Omit<T, "id" | "created_at" | "updated_at"> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

type UpdateRow<T> = Partial<T>;

export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: InsertRow<Profile>; Update: UpdateRow<Profile> };
      addresses: { Row: Address; Insert: InsertRow<Address>; Update: UpdateRow<Address> };
      categories: { Row: Category; Insert: InsertRow<Category>; Update: UpdateRow<Category> };
      products: { Row: Product; Insert: InsertRow<Product>; Update: UpdateRow<Product> };
      product_images: { Row: ProductImage; Insert: InsertRow<ProductImage>; Update: UpdateRow<ProductImage> };
      cart_items: { Row: CartItem; Insert: InsertRow<CartItem>; Update: UpdateRow<CartItem> };
      coupons: { Row: Coupon; Insert: InsertRow<Coupon>; Update: UpdateRow<Coupon> };
      orders: { Row: Order; Insert: InsertRow<Order>; Update: UpdateRow<Order> };
      order_items: { Row: OrderItem; Insert: InsertRow<OrderItem>; Update: UpdateRow<OrderItem> };
      payments: { Row: Payment; Insert: InsertRow<Payment>; Update: UpdateRow<Payment> };
      reviews: { Row: Review; Insert: InsertRow<Review>; Update: UpdateRow<Review> };
      favorites: { Row: Favorite; Insert: InsertRow<Favorite>; Update: UpdateRow<Favorite> };
      loyalty_points: { Row: LoyaltyPoint; Insert: InsertRow<LoyaltyPoint>; Update: UpdateRow<LoyaltyPoint> };
      notifications: { Row: Notification; Insert: InsertRow<Notification>; Update: UpdateRow<Notification> };
      settings: { Row: Setting; Insert: InsertRow<Setting>; Update: UpdateRow<Setting> };
      admins: { Row: { id: string; user_id: string; created_at: string }; Insert: { id?: string; user_id: string; created_at?: string }; Update: { user_id?: string } };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: { Args: { check_user_id?: string }; Returns: boolean };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
