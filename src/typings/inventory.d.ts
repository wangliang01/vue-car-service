declare namespace Api {
  namespace Inventory {
    interface Material {
      _id: string;
      code: string;
      name: string;
      category: string;
      unit: string;
      purchasePrice: number;
      sellingPrice: number;
      supplier: {
        name: string;
        contact: string;
        phone: string;
      };
    }

    interface InventoryItem {
      _id: string;
      material: Material;
      quantity: number;
      unit: string;
      price: number;
      supplier: string;
      alertThreshold: number;
      maxQuantity: number;
      remarks?: string;
      createTime: string;
      updateTime: string;
    }

    interface CreateInventoryParams {
      materialId: string;
      quantity: number;
      alertThreshold: number;
      maxQuantity: number;
      remarks?: string;
    }

    interface UpdateInventoryParams {
      quantity: number;
      remarks?: string;
    }

    interface SearchParams {
      code?: string;
      name?: string;
      category?: string;
      supplier?: string;
      minQuantity?: number;
      maxQuantity?: number;
      minPrice?: number;
      maxPrice?: number;
      page?: number;
      size?: number;
    }

    interface SearchResult {
      records: InventoryItem[];
      total: number;
    }
  }
}
