interface RepairOrder {
  id: string
  status: 'pending' | 'checked' | 'repairing' | 'completed' | 'delivered'
  // ... 其他字段
} 