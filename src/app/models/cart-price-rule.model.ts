export interface CartPriceRuleItem {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface CartPriceRuleListResponse {
  items: CartPriceRuleItem[];
  totalRecord: number;
  numberOfPages: number;
}

export interface CartRuleProduct { id: string; name: string; isPublished: boolean; }

export interface CartRuleDto {
  id?: string;                 // empty on create, populated on edit
  name: string;
  description: string;
  isActive: boolean;
  startOn: string;             // datetime-local -> ISO string
  endOn: string;               // datetime-local -> ISO string
  isCouponRequired: boolean;
  couponCode: string;
  ruleToApply: string;         // 'percentage' | 'fixed' | 'freeShipping'
  discountAmount: number;
  maxDiscountAmount: number;
  discountStep: number;
  usageLimitPerCoupon: number;
  usageLimitPerCustomer: number;
  products: CartRuleProduct[];
}

export interface CartRuleRequest { cartRuleDto: CartRuleDto; }

export const RULE_TO_APPLY_OPTIONS = [
  { value: 'percentage',   label: 'Percentage Discount' },
  { value: 'fixed',         label: 'Fixed Amount Discount' },
  { value: 'freeShipping',  label: 'Free Shipping' },
];
