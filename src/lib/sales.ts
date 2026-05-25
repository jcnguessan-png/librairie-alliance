import { readFileSync, writeFileSync, existsSync, accessSync, constants } from "fs";
import { join, dirname } from "path";
import { readInventory, upsertInventory } from "./inventory";

const DATA_PATH = join(process.cwd(), "data", "sales.json");
const TMP_PATH = process.platform === "win32"
  ? join(process.env.TEMP || "C:\\Temp", "librairie-sales.json")
  : "/tmp/librairie-sales.json";

function isWritable(filePath: string): boolean {
  try {
    accessSync(dirname(filePath), constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

function getWritePath(): string {
  return isWritable(DATA_PATH) ? DATA_PATH : TMP_PATH;
}

export type PaymentMethod = "cash" | "mobile-money" | "card";
export type SaleType = "standard" | "credit";
export type SaleStatus = "completed" | "pending" | "partial";

export interface Payment {
  amount: number;
  method: PaymentMethod;
  date: string;
}

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
  saleType: SaleType;
  status: SaleStatus;
  payments: Payment[];
  totalPaid: number;
  remaining: number;
  paymentMethod: PaymentMethod;
  amountPaid: number;
  change: number;
  date: string;
  customerName?: string;
  customerPhone?: string;
}

export function readSales(): Sale[] {
  for (const p of [DATA_PATH, TMP_PATH]) {
    try {
      if (!existsSync(p)) continue;
      const raw = readFileSync(p, "utf-8");
      const data = JSON.parse(raw) as Sale[];
      if (data.length > 0) return data;
    } catch { /* try next */ }
  }
  return [];
}

function writeSales(sales: Sale[]): void {
  const path = getWritePath();
  writeFileSync(path, JSON.stringify(sales, null, 2), "utf-8");
}

export function createSale(input: {
  items: SaleItem[];
  total: number;
  paymentMethod: PaymentMethod;
  amountPaid: number;
  change: number;
  saleType?: SaleType;
  customerName?: string;
  customerPhone?: string;
}): Sale {
  const sales = readSales();
  const saleType = input.saleType || "standard";
  const isCredit = saleType === "credit";
  const firstPayment = input.amountPaid - (input.change > 0 ? input.change : 0);
  const totalPaid = firstPayment;
  const remaining = input.total - totalPaid;

  const newSale: Sale = {
    id: `VNT-${Date.now().toString(36).toUpperCase()}`,
    items: input.items,
    total: input.total,
    saleType,
    status: isCredit && remaining > 0 ? "partial" : "completed",
    payments: [{
      amount: firstPayment,
      method: input.paymentMethod,
      date: new Date().toISOString(),
    }],
    totalPaid,
    remaining: Math.max(0, remaining),
    paymentMethod: input.paymentMethod,
    amountPaid: input.amountPaid,
    change: input.change,
    date: new Date().toISOString(),
    customerName: input.customerName,
    customerPhone: input.customerPhone,
  };

  sales.unshift(newSale);
  writeSales(sales);
  updateInventoryFromSale(newSale);
  return newSale;
}

export function addPayment(saleId: string, payment: { amount: number; method: PaymentMethod }): Sale | null {
  const sales = readSales();
  const sale = sales.find((s) => s.id === saleId);
  if (!sale || sale.status === "completed") return null;

  const newPayment: Payment = {
    amount: payment.amount,
    method: payment.method,
    date: new Date().toISOString(),
  };
  sale.payments.push(newPayment);
  sale.totalPaid += payment.amount;
  sale.remaining = Math.max(0, sale.total - sale.totalPaid);
  sale.status = sale.remaining <= 0 ? "completed" : "partial";
  writeSales(sales);
  return sale;
}

export function getPendingSales(): Sale[] {
  return readSales().filter((s) => s.status === "partial" || s.status === "pending");
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
  } catch { /* don't block sale */ }
}

export function getSalesToday(): Sale[] {
  const today = new Date().toISOString().slice(0, 10);
  return readSales().filter((s) => s.date.startsWith(today));
}

export function getSalesStats(sales: Sale[]) {
  const totalRevenue = sales.reduce((sum, s) => sum + s.totalPaid, 0);
  const totalItems = sales.reduce(
    (sum, s) => sum + s.items.reduce((q, i) => q + i.qty, 0), 0
  );
  const pendingAmount = sales
    .filter((s) => s.status === "partial")
    .reduce((sum, s) => sum + s.remaining, 0);
  const byPayment = sales.reduce(
    (acc, s) => {
      for (const p of s.payments) {
        acc[p.method] = (acc[p.method] || 0) + p.amount;
      }
      return acc;
    },
    {} as Record<string, number>
  );
  return { totalRevenue, totalItems, totalSales: sales.length, pendingAmount, byPayment };
}
