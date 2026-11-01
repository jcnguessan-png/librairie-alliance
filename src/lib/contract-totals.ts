import type { ContractItem } from "./contracts";

export function contractTotals(c: { items: ContractItem[]; commissionRate: number }) {
  const qty = c.items.reduce((s, i) => s + i.qty, 0);
  const value = c.items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  const commission = (value * c.commissionRate) / 100;
  return { qty, value, commission, net: value - commission };
}
