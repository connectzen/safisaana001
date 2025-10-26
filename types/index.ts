export type ProductType = 'plugin' | 'ebook' | 'course';

export interface ProductFormData {
  title: string;
  type: ProductType;
  price: number;
  imageUrl: string;
  paymentLink: string;
  shortDescription: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product extends Omit<ProductFormData, 'createdAt' | 'updatedAt'> {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// Payment and Transaction Types
export type PaymentState = 'PENDING' | 'PROCESSING' | 'COMPLETE' | 'FAILED';

export interface Transaction {
  id?: string;
  invoiceId: string;
  state: PaymentState;
  amount: number;
  currency: string;
  account: string;
  productId: string;
  mpesaReference?: string;
  cardReference?: string;
  failedReason?: string;
  failedCode?: string;
  charges?: number;
  netAmount?: number;
  customer?: {
    email?: string;
    first_name?: string;
    last_name?: string;
    phone_number?: string;
  };
  webhookReceivedAt?: any;
  createdAt?: string;
  updatedAt?: string;
  lastUpdated?: any;
}

export interface Purchase {
  id?: string;
  invoiceId: string;
  productId: string;
  productName: string;
  productType: ProductType;
  customerEmail: string;
  customerName: string;
  purchaseDate: any;
  status: 'completed' | 'pending' | 'failed';
}

export interface FailedPurchase {
  id?: string;
  invoiceId: string;
  productId?: string;
  customerEmail: string;
  customerName: string;
  failedAt: any;
  reason: string;
}
