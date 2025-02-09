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
  /** 完工结算参数 */
  interface CompleteParams {
    /** 结算金额 */
    amount: number;
    /** 备注 */
    remark?: string;
  }
}
