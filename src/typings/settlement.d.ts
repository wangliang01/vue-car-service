import { Api as CommonApi } from './common';

export declare namespace Api {
  namespace Settlement {
    interface SettlementInfo {
      _id: string;
      settlementNo: string;
      createTime: string;
      repairOrder: {
        orderNo: string;
        inDate: string;
        repairItems: Array<{
          name: string;
          laborHours: number;
          laborPrice: number;
          complexityFactor: number;
          laborDiscount: number;
          actualLaborCost: number;
          subtotal: number;
          parts: Array<{
            name: string;
            purchasePrice: number;
            managementFee: number;
            managementDiscount: number;
            actualMaterialCost: number;
            receivablePartsCost: number;
            actualPartsCost: number;
          }>;
        }>;
      };
      customer: {
        name: string;
        phone: string;
      };
      vehicle: {
        brand: string;
        model: string;
        licensePlate: string;
      };
      repairItems: Array<{
        name: string;
        laborHours: number;
        laborPrice: number;
        complexityFactor: number;
        laborDiscount: number;
        actualLaborCost: number;
        materialName: string;
        purchasePrice: number;
        managementRate: number;
        managementDiscount: number;
        expectedMaterialCost: number;
        actualMaterialCost: number;
        receivablePartsCost: number;
        actualPartsCost: number;
        subtotal: number;
        laborAmount: number;
        partsAmount: number;
      }>;
      partsAmount: number;
      laborAmount: number;
      totalAmount: number;
      paymentMethod: string;
      paymentStatus: 'paid' | 'unpaid';
      formattedPartsAmount: string;
      formattedLaborAmount: string;
      formattedTotalAmount: string;
    }

    interface SearchParams extends CommonApi.Common.PaginationParams {
      page?: number;
      size?: number;
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

    interface RepairItem {
      name: string;
      laborHours: number;
      laborPrice: number;
      complexityFactor: number;
      laborDiscount: number;
      actualLaborCost: number;
      subtotal: number;
      parts: {
        name: string;
        purchasePrice: number;
        managementFee: number;
        managementDiscount: number;
        actualMaterialCost: number;
        receivablePartsCost: number;
        actualPartsCost: number;
      }[];
    }
  }
}
