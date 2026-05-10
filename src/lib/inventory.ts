import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const INVENTORY_PATH = join(process.cwd(), "data", "inventory.json");

export interface BookInventory {
  slug: string;
  purchasePrice: number;
  qtyInStock: number;
  qtyOrdered: number;
  unitWeightGrams: number;
  shippingCost: number;
  marketingCost: number;
  authorRights: number;
  salePriceFrance: number | null;
  salePriceCDI: number | null;
  qtySoldFrance: number;
  qtySoldCDI: number;
  giftsQty: number;
  updatedAt: string;
}

export function readInventory(): BookInventory[] {
  try {
    if (!existsSync(INVENTORY_PATH)) return [];
    const raw = readFileSync(INVENTORY_PATH, "utf-8");
    return JSON.parse(raw) as BookInventory[];
  } catch {
    return [];
  }
}

export function writeInventory(items: BookInventory[]): void {
  writeFileSync(INVENTORY_PATH, JSON.stringify(items, null, 2), "utf-8");
}

export function upsertInventory(item: BookInventory): BookInventory {
  const items = readInventory();
  const index = items.findIndex((i) => i.slug === item.slug);
  item.updatedAt = new Date().toISOString();
  if (index === -1) {
    items.push(item);
  } else {
    items[index] = item;
  }
  writeInventory(items);
  return item;
}

export function getInventoryBySlug(slug: string): BookInventory | undefined {
  return readInventory().find((i) => i.slug === slug);
}

export interface MarginCalc {
  totalPurchase: number;
  totalWeight: number;
  totalShipping: number;
  costOfReturn: number;
  unitCost: number;
  marginFranceUnit: number;
  marginFranceTotal: number;
  marginFranceNet: number;
  marginCDIUnit: number;
  marginCDITotal: number;
  marginCDINet: number;
  totalRevenueFrance: number;
  totalRevenueCDI: number;
}

export function calculateMargins(inv: BookInventory): MarginCalc {
  const qty = inv.qtyOrdered || 1;
  const totalPurchase = inv.purchasePrice * qty;
  const totalWeight = inv.unitWeightGrams * qty;
  const costOfReturn = totalPurchase + inv.shippingCost;
  const unitCost = costOfReturn / qty;

  const totalRevenueFrance = (inv.salePriceFrance ?? 0) * inv.qtySoldFrance;
  const marginFranceUnit = (inv.salePriceFrance ?? 0) - unitCost;
  const marginFranceTotal = marginFranceUnit * inv.qtySoldFrance;
  const marginFranceNet = marginFranceTotal - inv.authorRights - inv.marketingCost;

  const totalRevenueCDI = (inv.salePriceCDI ?? 0) * inv.qtySoldCDI;
  const marginCDIUnit = (inv.salePriceCDI ?? 0) - unitCost;
  const marginCDITotal = marginCDIUnit * inv.qtySoldCDI;
  const marginCDINet = marginCDITotal - inv.authorRights - inv.marketingCost;

  return {
    totalPurchase,
    totalWeight,
    totalShipping: inv.shippingCost,
    costOfReturn,
    unitCost,
    marginFranceUnit,
    marginFranceTotal,
    marginFranceNet,
    marginCDIUnit,
    marginCDITotal,
    marginCDINet,
    totalRevenueFrance,
    totalRevenueCDI,
  };
}
