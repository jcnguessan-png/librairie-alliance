import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const SALES_PATH = join(process.cwd(), "data", "sales.json");

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
  try {
    if (!existsSync(SALES_PATH)) return [];
    const raw = readFileSync(SALES_PATH, "utf-8");
    return JSON.parse(raw) as Sale[];
  } catch {
    return [];
  }
}

function writeSales(sales: Sale[]): void {
  writeFileSync(SALES_PATH, JSON.stringify(sales, null, 2), "utf-8");
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
  return newSale;
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
