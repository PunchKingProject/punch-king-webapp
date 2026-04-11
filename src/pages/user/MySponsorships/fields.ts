// src/pages/user/MySponsorships/ui/fields.ts

import type { Field } from "../../admin/components/ScrollableSection.tsx";

export type MobilePurchaseListItem = {
  id: number;
  payment_date: string; // e.g. "3/12/2025"
  payment_amount: string; // formatted USD string (e.g. "$5,000.00")
  sponsorship_points: number; // units purchased
  username: string; // team name (or fallback username)
  payment_slip?: string | null;
};

export const purchaseFieldData: Field<MobilePurchaseListItem>[] = [
  { key: 'payment_date', label: 'Payment date' },
  { key: 'payment_amount', label: 'Amount' },
  { key: 'sponsorship_points', label: 'Units' },
  { key: 'username', label: 'Team' },
];
