import type { Field } from '../../../admin/components/ScrollableSection';

export type MobileSubPaymentItem = {
  id: number;
  subscription_type: string;
  amount_paid: string;
  payment_date: string;
  status: string; // Processing | Processed | Failed
  payment_slip?: string | null | undefined;
};

export type MobileSubHistoryItem = {
  id: number;
  subscription_type: string;
  start_date: string;
  end_date: string;
  amount_paid: string;
  status: string; // Active | Expired
};

export const subPaymentFieldData: Field<MobileSubPaymentItem>[] = [
  { key: 'subscription_type', label: 'Subscription type' },
  { key: 'amount_paid', label: 'amount paid' },
  { key: 'payment_date', label: 'Payment date' },
  { key: 'status', label: 'Status' },
];

export const subHistoryFieldData: Field<MobileSubHistoryItem>[] = [
  { key: 'subscription_type', label: 'Subscription type' },
  { key: 'start_date', label: 'Start date' },
  { key: 'end_date', label: 'End date' },
  { key: 'amount_paid', label: 'amount paid' },
  { key: 'status', label: 'Status' },
];
