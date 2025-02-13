export interface RepairItemInfo {
  _id: string;
  name: string;
  laborHours: number;
  laborPrice: number;
  complexityFactor: number;
  description?: string;
  isActive: boolean | null;
}
