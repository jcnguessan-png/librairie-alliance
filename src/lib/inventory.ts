import { readFileSync, writeFileSync, existsSync, mkdirSync, accessSync, constants } from "fs";
import { join, dirname } from "path";

const DATA_PATH = join(process.cwd(), "data", "inventory.json");
const TMP_PATH = process.platform === "win32"
  ? join(process.env.TEMP || "C:\\Temp", "librairie-inventory.json")
  : "/tmp/inventory.json";

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

function ensureDir(filePath: string): void {
  const dir = dirname(filePath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

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
  const paths = [DATA_PATH, TMP_PATH];
  for (const p of paths) {
    try {
      if (existsSync(p)) {
        const raw = readFileSync(p, "utf-8");
        const data = JSON.parse(raw) as BookInventory[];
        if (data.length > 0) return data;
      }
    } catch { /* try next */ }
  }
  return [];
}

function writeInventory(items: BookInventory[]): void {
  const path = getWritePath();
  ensureDir(path);
  writeFileSync(path, JSON.stringify(items, null, 2), "utf-8");
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
