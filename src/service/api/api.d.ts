interface RepairOrder {
  id: string
  status: 'pending' | 'checked' | 'repairing' | 'completed' | 'delivered' | 'repaired' | 'inspecting'
  // ... 其他字段
} 

declare namespace Api {
  namespace RepairOrder {
    /** 检查记录数据 */
    interface InspectionData {
      inspectionItems: Array<{
        name: string
        result: 'normal' | 'abnormal'
        remark: string
        images: Array<{
          id: string
          url: string
        }>
      }>
      customerItems: Array<{
        name: string
        quantity: number
        remark: string
        images: Array<{
          id: string
          url: string
        }>
      }>
    }
  }
} 