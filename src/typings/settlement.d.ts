declare namespace Api.Settlement {
  interface SettlementInfo {
    _id: string;
    repairOrder: string;
    customer: string;
    vehicle: string;
    partsAmount: number;
    laborAmount: number;
    totalAmount: number;
    paymentMethod: 'cash' | 'wechat' | 'alipay' | 'card';
    status: 'unpaid' | 'paid' | 'refunded';
    remark?: string;
    createdAt: string;
    updatedAt: string;
  }

  interface SearchParams extends Api.Common.PaginationParams {
    status?: string;
    paymentMethod?: string;
    startDate?: string;
    endDate?: string;
    minAmount?: number;
    maxAmount?: number;
  }

  interface CreateParams {
    repairOrder: string;
    customer: string;
    vehicle: string;
    partsAmount: number;
    laborAmount: number;
    totalAmount: number;
    paymentMethod: string;
    remark?: string;
  }

  interface StatusUpdateParams {
    status: 'paid' | 'refunded';
  }
} 