import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { readInventory, upsertInventory } from "./inventory";

const DATA_PATH = join(process.cwd(), "data", "sales.json");
const TMP_PATH = join("/tmp", "sales.json");

function getSalesPath(): string {
  try {
    writeFileSync(DATA_PATH, readFileSync(DATA_PATH));
    return DATA_PATH;
  } catch {
    return TMP_PATH;
  }
}

function ensureDir(filePath: string): void {
  const dir = dirname(filePath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

export type PaymentMethod = "cash" | "mobile-money" | "card";

export interface SaleItem {
  slug: string;
  title: string;
  price: number;
  qty: number;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  total: number;
  paymentMethod: PaymentMethod;
  amountPaid: number;
  change: number;
  date: string;
  customerName?: string;
}

export function readSales(): Sale[] {
  const paths = [DATA_PATH, TMP_PATH];
  for (const p of paths) {
    try {
      if (existsSync(p)) {
        const raw = readFileSync(p, "utf-8");
        const data = JSON.parse(raw) as Sale[];
        if (data.length > 0) return data;
      }
    } catch { /* try next */ }
  }
  return [];
}

function writeSales(sales: Sale[]): void {
  const path = getSalesPath();
  ensureDir(path);
  writeFileSync(path, JSON.stringify(sales, null, 2), "utf-8");
}

export function createSale(sale: Omit<Sale, "id" | "date">): Sale {
  const sales = readSales();
  const newSale: Sale = {
    ...sale,
    id: `VNT-${Date.now().toString(36).toUpperCase()}`,
    date: new Date().toISOString(),
  };
  sales.unshift(newSale);
  writeSales(sales);

  updateInventoryFromSale(newSale);

  return newSale;
}

function updateInventoryFromSale(sale: Sale): void {
  try {
    const inventory = readInventory();
    for (const item of sale.items) {
      const inv = inventory.find((i) => i.slug === item.slug);
      if (inv) {
        inv.qtySoldCDI += item.qty;
        inv.qtyInStock = Math.max(0, inv.qtyInStock - item.qty);
        upsertInventory(inv);
      }
    }
  } catch { /* don't block sale if inventory update fails */ }
}

export function getSalesToday(): Sale[] {
  const today = new Date().toISOString().slice(0, 10);
  return readSales().filter((s) => s.date.startsWith(today));
}

export function getSalesStats(sales: Sale[]) {
  const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
  const totalItems = sales.reduce(
    (sum, s) => sum + s.items.reduce((q, i) => q + i.qty, 0),
    0
  );
  const byPayment = sales.reduce(
    (acc, s) => {
      acc[s.paymentMethod] = (acc[s.paymentMethod] || 0) + s.total;
      return acc;
    },
    {} as Record<string, number>
  );
  return { totalRevenue, totalItems, totalSales: sales.length, byPayment };
}
