declare namespace App.I18n {
  interface Schema {
    common: {
      // ...other properties
      view: string;
      // ...
    }
    settlement: {
      title: string;
      repairOrder: string;
      customer: string;
      vehicle: string;
      partsAmount: string;
      laborAmount: string;
      totalAmount: string;
      paymentMethod: string;
      status: string;
      remark: string;
      createdAt: string;
      paymentMethods: {
        cash: string;
        wechat: string;
        alipay: string;
        card: string;
      };
      status: {
        unpaid: string;
        paid: string;
        refunded: string;
      };
      search: {
        minAmount: string;
        maxAmount: string;
      };
    };
  }
} 