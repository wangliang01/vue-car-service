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