export interface InspectionData {
  inspectionItems: Array<{
    name: string
    result: 'normal' | 'abnormal'
    remark: string
  }>
  customerItems: Array<{
    name: string
    quantity: number
    remark: string
  }>
}

export interface RepairData {
  repairItems: RepairItem[]
  estimatedCompletionDate: string | null
  mechanic: string
}

declare namespace Api.RepairOrder {
  interface Technician {
    _id: string;
    name: string;
  }

  interface Material {
    _id: string;
    name: string;
    quantity: number;
    price: number;
    description?: string;
  }

  interface RepairItem {
    _id: string;
    name: string;
    price: number;
    description?: string;
    materials?: Material[];
    laborCost?: number;
  }

  interface RepairOrderInfo {
    _id: string;
    orderNo: string;
    status: string;
    customer: any;
    vehicle: any;
    faultDesc: string;
    remark?: string;
    createdAt: string;
    updatedAt: string;
    technicians?: Technician[];
    repairItems?: RepairItem[];
    inDate?: number;
    estimatedCompletionDate?: number;
  }

  /** 完工结算参数 */
  interface CompleteParams {
    /** 结算金额 */
    amount: number;
    /** 备注 */
    remark?: string;
  }
}
