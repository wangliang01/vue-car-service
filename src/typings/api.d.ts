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

    interface PaginationResult<T> {
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
    interface RepairOrderInfo {
      _id: string;
      orderNo: string;
      status: 'pending' | 'checked' | 'repairing' | 'completed' | 'delivered';
      customer: Customer.CustomerInfo;
      vehicle: Vehicle.VehicleInfo;
      faultDesc: string;
      remark?: string;
      mechanic?: string;
      inDate: string;
      estimatedCompletionTime?: string;
      actualCompletionTime?: string;
      deliveryTime?: string;
      createdAt: string;
      updatedAt: string;
    }

    interface SearchParams {
      status?: string[] | string;
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
      estimatedCompletionTime?: string;
      actualCompletionTime?: string;
      deliveryTime?: string;
    }

    interface RepairData {
      repairItems: string[];
      repairDesc: string;
      cost: number;
      laborCost: number;
      partsCost: number;
      estimatedCompletionTime?: string;
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
      contact: {
        phone: string;
        email: string;
      };
      businessHours: {
        openTime: string;
        closeTime: string;
        workDays: number[];
      };
    }

    interface UpdateStoreParams extends Partial<CreateStoreParams> {}

    interface SearchParams extends Common.PaginationParams {
      name?: string;
      code?: string;
      status?: string;
      province?: string;
      city?: string;
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
}
