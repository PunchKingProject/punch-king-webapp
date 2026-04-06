import type { Field } from '../../components/ScrollableSection.tsx';
import type { ReactNode } from 'react';

export type SubListItem = {
  id?: number;
  team_id: number;
  team_name: string;
  phone_number: string;
  payment_confirmation_status: string | ReactNode;
  subs_status: string | ReactNode;
};

export type MobileSubHistoryRow = {
  id: number;
  category: string;
  payment_date: string;
  start_date: string;
  end_date: string;
};
export const subFieldData: Field<SubListItem>[] = [
  { key: 'team_name', label: 'Team name' },
  { key: 'phone_number', label: 'Phone number' },
  { key: 'payment_confirmation_status', label: 'Payment confirmation status' },
  { key: 'subs_status', label: 'Subscription status' },
];

export const subHistoryFieldData: Field<MobileSubHistoryRow>[] = [
  { key: 'category', label: 'Subscription category' },
  { key: 'payment_date', label: 'Payment date' },
  { key: 'start_date', label: 'Subscription start date' },
  { key: 'end_date', label: 'Subscription end date' },
];
