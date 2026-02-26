export interface Student {
  id: string;
  name: string;
  phone: string;
  parentPhone: string;
  address: string;
  attendance: Record<string, boolean>;
  monthlyPayment: number;
  amountPaid: number;
  paymentStatus: 'paid' | 'partial' | 'pending';
  paymentNote?: string;
  joinedDate: string;
}
