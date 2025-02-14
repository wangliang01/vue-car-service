/**
 * Namespace Api
 *
 * All backend api type
 */
declare namespace Api {
  namespace Common {
    /** common params of paginating */
    interface PaginatingCommonParams {
      /** current page number */
      current: number;
      /** page size */
      size: number;
      /** total count */
      total: number;
    }

    /** common params of paginating query list data */
    interface PaginatingQueryRecord<T = any> extends PaginatingCommonParams {
      records: T[];
    }

    /** common search params of table */
    type CommonSearchParams = Pick<Common.PaginatingCommonParams, 'current' | 'size'>;

    /**
     * enable status
     *
     * - "1": enabled
     * - "2": disabled
     */
    type EnableStatus = '1' | '2';

    /** common record */
    type CommonRecord<T = any> = {
      /** record id */
      id: number;
      /** record creator */
      createBy: string;
      /** record create time */
      createTime: string;
      /** record updater */
      updateBy: string;
      /** record update time */
      updateTime: string;
      /** record status */
      status: EnableStatus | null;
    } & T;

    interface PaginationParams {
      current?: number;
      size?: number;
    }

    interface PageResult<T> {
      records: T[];
      total: number;
    }
  }

  /**
   * namespace Auth
   *
   * backend api module: "auth"
   */
  namespace Auth {
    interface LoginToken {
      token: string;
      refreshToken: string;
    }

    interface UserInfo {
      isAdmin: boolean;
      userId: string;
      name: string;
      roles: string[];
      permissions: string[];
    }

  }

  namespace Vehicle {
    interface VehicleInfo {
      _id: string;
      customerId: string;
      customer?: {
        _id: string;
        name: string;
        phone?: string;
        email?: string;
        address?: string;
        contact?: string;
        bankAccount?: string;
        bankName?: string;
      };
      brand: string;
      model: string;
      year: number;
      licensePlate: string;
      vin: string;
      mileage: number;
      engineNo?: string;
      color?: string;
      displacement?: string;
      createdAt?: string;
      updatedAt?: string;
    }

    interface VehicleSearchParams {
      customerId?: string;
      brand?: string;
      model?: string;
      licensePlate?: string;
      page?: number;
      size?: number;
    }
  }

  /**
   * namespace Route
   *
   * backend api module: "route"
   */
  namespace Route {
    type ElegantConstRoute = import('@elegant-router/types').ElegantConstRoute;

    interface MenuRoute extends ElegantConstRoute {
      id: string;
    }

    interface UserRoute {
      routes: MenuRoute[];
      home: import('@elegant-router/types').LastLevelRouteKey;
    }
  }

  namespace Customer {
    interface CustomerInfo {
      _id: string;
      name: string;
      phone: string;
      email: string;
      address: string;
      contact?: string;
      bankAccount?: string;
      bankName?: string;
      createdAt: string;
      updatedAt: string;
    }

    interface CreateCustomerParams {
      name: string;
      phone: string;
      email: string;
      address: string;
      contact?: string;
      bankAccount?: string;
      bankName?: string;
    }

    interface UpdateCustomerParams extends Partial<CreateCustomerParams> {}

    interface GetCustomersQuery {
      page?: number;
      size?: number;
    }

    interface CustomerStats {
      total: number;
      todayNew: number;
      monthNew: number;
      yearNew: number;
    }

    type BatchImportParams = CreateCustomerParams[];

    interface CustomerSearchParams {
      name?: string;
      gender?: string;
      email?: string;
      phone?: string;
      address?: string;
      userStatus?: string;
    }
  }

  namespace RepairOrder {
    interface MechanicInfo {
      _id: string;
      name: string;
      employeeId: string;
      phone: string;
      email: string;
      level: string;
      specialties: string[];
      workYears: number;
      status: 'active' | 'onLeave' | 'deleted';
    }

    interface RepairOrderInfo<T = string> {
      _id: string;
      orderNo: string;
      status: 'pending' | 'checked' | 'repairing' | 'completed' | 'delivered';
      customer: Customer.CustomerInfo;
      vehicle: Vehicle.VehicleInfo;
      faultDesc: string;
      remark?: string;
      mechanic?: T; // T 可以是 string (ID) 或 MechanicInfo (完整对象)
      inDate: string;
      estimatedCompletionDate?: string;
      actualCompletionTime?: string;
      deliveryTime?: string;
      createdAt: string;
      updatedAt: string;
      repairItems?: RepairItem.RepairItemInfo[];
      laborAmount?: number;  // 添加工时费用字段
    }

    interface SearchParams {
      status?: string;
      orderNo?: string;
      customerName?: string;
      licensePlate?: string;
    }

    interface CreateParams {
      isNewCustomer: boolean;
      customer: {
        _id: string;
        name: string;
        phone: string;
        email: string;
        address: string;
        contact?: string;
        bankAccount?: string;
        bankName?: string;
        createdAt?: string;
        updatedAt?: string;
      } | { _id: string };
      vehicle: Vehicle.VehicleInfo | { _id: string };
      faultDesc: string;
      remark?: string;
    }

    interface StatusUpdateParams {
      status: RepairOrderInfo['status'];
      mechanic?: string;
      estimatedCompletionDate?: string;
      actualCompletionTime?: string;
      deliveryTime?: string;
    }

    interface RepairData {
      repairItems: string[];
      repairDesc: string;
      cost: number;
      laborCost: number;
      partsCost: number;
      estimatedCompletionDate?: string;
      // 根据实际需求添加其他必要字段
    }
  }

  namespace Store {
    interface StoreInfo {
      _id: string;
      name: string;
      code: string;
      status: 'active' | 'inactive';
      address: {
        province: string;
        city: string;
        district: string;
        detail: string;
      };
      contact: {
        phone: string;
        email: string;
      };
      businessHours: {
        openTime: string;
        closeTime: string;
        workDays: number[];
      };
      createdAt: string;
      updatedAt: string;
    }

    interface CreateStoreParams {
      name: string;
      code: string;
      address: string;
    }

    interface UpdateStoreParams extends Partial<CreateStoreParams> {}

    interface SearchParams extends Common.PaginationParams {
      name?: string;
      code?: string;
      status?: string;
    }
  }

  namespace Permission {
    interface PermissionInfo {
      _id: string;
      name: string; // 权限名称
      code: string; // 权限编码
      type: 'menu' | 'operation'; // 权限类型:菜单/操作
      parentId: string | null; // 父级ID
      path?: string; // 路由路径
      component?: string; // 组件路径
      sort: number; // 排序
      icon?: string; // 图标
      createdAt: string;
      updatedAt: string;
      children?: PermissionInfo[];
    }

    interface CreatePermissionParams {
      name: string;
      code: string;
      type: 'menu' | 'operation';
      parentId?: string | null;
      path?: string;
      component?: string;
      sort?: number;
      icon?: string;
    }

    interface UpdatePermissionParams extends Partial<CreatePermissionParams> {}
  }

  namespace Technician {
    interface TechnicianInfo {
      _id: string;
      employeeId: string;
      name: string;
      avatar: string;
      phone: string;
      email: string;
      level: string;
      specialties: string[];
      workYears: number;
      status: 'active' | 'onLeave' | 'deleted';
      createdAt: string;
      updatedAt: string;
    }

    interface SearchParams extends Common.PaginationParams {
      name?: string;
      phone?: string;
      email?: string;
      level?: string;
      status?: string;
    }

    interface CreateParams {
      userId: string;
      name: string;
      avatar: string;
      phone: string;
      email: string;
      level: string;
      specialties: string[];
      workYears: number;
    }

    interface UpdateParams extends Partial<Omit<CreateParams, 'userId'>> {}

    interface UpdateStatusParams {
      status: 'active' | 'onLeave' | 'deleted';
    }
  }

  namespace Material {
    interface MaterialInfo {
      _id: string;
      name: string;
      code?: string;
      category: string;
      specification?: string;
      unit: string;
      purchasePrice: number;
      managementFeeRate: number;
      sellingPrice: number;
      stockQuantity: number;
      stockThreshold: number;
      supplier?: {
        name?: string;
        contact?: string;
        phone?: string;
      };
      isActive: boolean;
      remarks?: string;
      createdAt: string;
      updatedAt: string;
    }

    interface SearchParams extends Common.PaginationParams {
      name?: string;
      code?: string;
      category?: string;
      isActive?: boolean;
    }

    interface CreateParams {
      name: string;
      code?: string;
      category: string;
      specification?: string;
      unit: string;
      purchasePrice: number;
      managementFeeRate?: number;
      sellingPrice: number;
      stockQuantity?: number;
      stockThreshold?: number;
      supplier?: {
        name?: string;
        contact?: string;
        phone?: string;
      };
      remarks?: string;
    }

    interface UpdateParams extends Partial<CreateParams> {}
  }

  namespace RepairItem {
    interface RepairItemInfo {
      _id: string;
      name: string;
      description?: string;
      laborCost: number;
      laborHours?: number;
      laborPrice?: number;
      complexityFactor?: number;
      laborDiscount?: number;
      estimatedHours: number;
      laborDiscountRate: number;
      isActive: boolean;
      technicians: {
        _id: string;
        name: string;
        role: string;
      }[];
      materials: {
        _id: string;
        name: string;
        partNo?: string;
        quantity: number;
        unit: string;
        unitPrice: number;
      }[];
      parts: {
        _id: string;
        name: string;
        specification?: string;
        quantity: number;
        unit: string;
        purchasePrice: number;
      }[];
      status: 'pending' | 'in_progress' | 'completed';
      createdAt: string;
      updatedAt: string;
    }

    interface SearchParams extends Common.PaginationParams {
      name?: string;
      isActive?: boolean;
    }

    interface CreateParams {
      name: string;
      laborHours: number;
      laborPrice: number;
      complexityFactor: number;
      laborDiscountRate: number;
      description?: string;
    }

    interface UpdateParams extends Partial<CreateParams> {}
  }

  namespace Inventory {
    interface InventoryItem {
      id: string;
      materialId: string;
      name: string;
      code: string;
      category: string;
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

  namespace Settlement {
    interface SettlementInfo {
      _id: string;
      settlementNo: string;
      createdAt: string;
      fillDate: string | number | null;
      repairOrder: RepairOrder.RepairOrderInfo;
      customer: Customer.CustomerInfo;
      vehicle: Vehicle.VehicleInfo;
      partsAmount: number;
      laborAmount: number;
      totalAmount: number;
      formattedPartsAmount: string;
      formattedLaborAmount: string;
      formattedTotalAmount: string;
      paymentStatus: 'paid' | 'unpaid';
      paymentMethod?: string;
    }
  }

  interface ApiResponse<T> {
    data: T;
    status: number;
    message: string;
  }
}
