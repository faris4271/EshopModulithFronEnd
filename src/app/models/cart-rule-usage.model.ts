export interface CartRuleUsageDto {
  id: string;
  cartRuleId: string;
  cartRuleName: string;
  userId: string;
  userFullName: string;
  couponCode: string;
  orderId: string;
  createdOn: string;
}

export interface CartRuleUsageSearch {
  ruleName?: string;
  couponCode?: string;
  fullName?: string;
  orderId?: string;
  createdOnBefore?: string;
  createdOnAfter?: string;
}