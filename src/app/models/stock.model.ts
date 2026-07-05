export interface Stock {
  id: string;
  productId: string;
  productName: string;
  sku?: string;
  warehouseId: string;
  warehouseName?: string;
  quantity: number;
  reservedQuantity: number;
}

export interface AdjustStockDto {
  stockId: string;
  productId: string;
  warehouseId: string;
  adjustedQuantity: number;
  note?: string;
}

export interface StockHistoryEntry {
  id: string;
  adjustedQuantity: number;
  note?: string;
  createdOn: string;
  createdBy?: string;
  warehouseId?: string;
}

export type StockItem = Stock;
