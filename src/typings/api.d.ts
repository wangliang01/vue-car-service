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
      page?: number;
      size?: number;
    }

    interface PaginationResult<T> {
      list: T[];
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
      userName: string;
      roles: string[];
      buttons: string[];
    }

    /** register params */
    interface RegisterParams {
      username: string;
      email: string;
      password: string;
      role?: string;
    }
  }

  namespace Vehicle {
    interface VehicleInfo {
      _id: string;
      customerId: string;
      customer?: {
        _id: string;
        name: string;
      };
      brand: string;
      model: string;
      year: number;
      licensePlate: string;
      vin: string;
      mileage: number;
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
      createdAt: string;
      updatedAt: string;
    }

    interface CreateCustomerParams {
      name: string;
      phone: string;
      email: string;
      address: string;
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
      mechanic?: string;
      estimatedCompletionTime?: string;
      actualCompletionTime?: string;
      deliveryTime?: string;
      createdAt: string;
      updatedAt: string;
    }

    interface SearchParams extends Common.PaginationParams {
      status?: string;
      orderNo?: string;
      customerName?: string;
      licensePlate?: string;
    }

    interface CreateParams {
      isNewCustomer: boolean;
      customer: Customer.CustomerInfo | { _id: string };
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
  }
}
