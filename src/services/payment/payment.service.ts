import axios from 'axios';
import { Service } from '../Service';
import http from '../../utils/http';

export interface CreateOrderRequest {
  plan_id: string;
  user_id: string;
  receipt: string;
  members: number;
  notes?: Record<string, any>;
}

export interface CreateOrderResponse {
  order_id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
  created_at: number;
}

export interface VerifyPaymentRequest {
  current_plan_id: string;
  user_id: string;
  user_name: string;
  email: string;
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  members: number;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  data?: any;
}

class PaymentService extends Service {


  async createOrder(orderData: CreateOrderRequest): Promise<CreateOrderResponse> {
    try {
      const response = await http.post(`/payment/create-order`, orderData, {
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.data && response.data.order_id) {
        return response.data;
      } else {
        throw new Error('Invalid response from create order API');
      }
    } catch (error: any) {
      console.error('Error creating order:', error);
      if (error.response) {
        throw new Error(error.response.data?.message || 'Failed to create order');
      } else if (error.request) {
        throw new Error('Network error. Please check your connection.');
      } else {
        throw new Error('Something went wrong while creating order');
      }
    }
  }

  async verifyPayment(paymentData: VerifyPaymentRequest): Promise<VerifyPaymentResponse> {
    try {
      const response = await http.post(`/payment/verify-payment`, paymentData, {
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('Error verifying payment:', error);
      if (error.response) {
        throw new Error(error.response.data?.message || 'Failed to verify payment');
      } else if (error.request) {
        throw new Error('Network error. Please check your connection.');
      } else {
        throw new Error('Something went wrong while verifying payment');
      }
    }
  }

  generateReceipt(): string {
    return `receipt_${Date.now()}`;
  }
}

export default PaymentService;
