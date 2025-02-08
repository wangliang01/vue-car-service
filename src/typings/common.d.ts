/** The common type namespace */
export declare namespace CommonType {
  /** The strategic pattern */
  interface StrategicPattern {
    /** The condition */
    condition: boolean;
    /** If the condition is true, then call the action function */
    callback: () => void;
  }

  /**
   * The option type
   *
   * @property value: The option value
   * @property label: The option label
   */
  type Option<K = string> = { value: K; label: string };

  type YesOrNo = 'Y' | 'N';

  /** add null to all properties */
  type RecordNullable<T> = {
    [K in keyof T]?: T[K] | null;
  };
}

export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

export interface PageResult<T = any> {
  records: T[];
  total: number;
  size: number;
  current: number;
}

export interface CommonResult {
  code: number;
  message: string;
}

declare namespace Api {
  interface PageResult<T> {
    records: T[];
    total: number;
    size: number;
    current: number;
  }

  interface ApiResponse<T> {
    code: number;
    message: string;
    data: T;
  }

  namespace Common {
    interface PaginationParams {
      page?: number;
      size?: number;
    }

    interface Response<T> {
      code: number;
      message: string;
      data: T;
    }

    interface PaginationResponse<T> {
      total: number;
      records: T[];
    }
  }
}
