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

export interface RepairItem {
  _id: string;
  name: string;
  description?: string;
  laborCost: number;
  estimatedHours: number;
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
  status: 'pending' | 'in_progress' | 'completed';
}

export interface RepairData {
  repairItems: RepairItem[]
  estimatedCompletionDate: string | null
  mechanic: string
}

declare namespace Api.RepairOrder {
  /** 完工结算参数 */
  interface CompleteParams {
    /** 结算金额 */
    amount: number;
    /** 备注 */
    remark?: string;
  }
}
