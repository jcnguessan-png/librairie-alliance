import { readFileSync, writeFileSync, existsSync, accessSync, constants } from "fs";
import { join, dirname } from "path";

const DATA_PATH = join(process.cwd(), "data", "contracts.json");
const TMP_PATH = process.platform === "win32"
  ? join(process.env.TEMP || "C:\\Temp", "librairie-contracts.json")
  : "/tmp/librairie-contracts.json";

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

export type ContractStatus = "draft" | "signed" | "terminated";

export interface ContractPartner {
  name: string;
  legalForm: string;
  rccm: string;
  ncc: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  representative: string;
  representativeTitle: string;
}

export interface ContractItem {
  slug: string;
  title: string;
  qty: number;
  unitPrice: number;
}

export interface Contract {
  id: string;
  number: string;
  status: ContractStatus;
  partner: ContractPartner;
  startDate: string;
  durationMonths: number;
  /** Commission du dépositaire, en % du prix public */
  commissionRate: number;
  /** Jour du mois où le dépositaire transmet son relevé de ventes */
  reportDay: number;
  /** Délai de paiement après le relevé, en jours */
  paymentDays: number;
  noticeDays: number;
  signingPlace: string;
  items: ContractItem[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type ContractInput = Omit<Contract, "id" | "number" | "createdAt" | "updatedAt">;

export function readContracts(): Contract[] {
  for (const p of [DATA_PATH, TMP_PATH]) {
    try {
      if (!existsSync(p)) continue;
      const raw = readFileSync(p, "utf-8");
      const data = JSON.parse(raw) as Contract[];
      if (data.length > 0) return data;
    } catch { /* try next */ }
  }
  return [];
}

function writeContracts(contracts: Contract[]): void {
  writeFileSync(getWritePath(), JSON.stringify(contracts, null, 2), "utf-8");
}

export function getContract(id: string): Contract | undefined {
  return readContracts().find((c) => c.id === id);
}

function nextNumber(contracts: Contract[], year: number): string {
  const prefix = `DV-${year}-`;
  const max = contracts
    .filter((c) => c.number.startsWith(prefix))
    .reduce((m, c) => Math.max(m, Number(c.number.slice(prefix.length)) || 0), 0);
  return `${prefix}${String(max + 1).padStart(3, "0")}`;
}

export function createContract(input: ContractInput): Contract {
  const contracts = readContracts();
  const now = new Date().toISOString();
  const contract: Contract = {
    ...input,
    id: `ctr_${Date.now().toString(36)}`,
    number: nextNumber(contracts, new Date(input.startDate || now).getFullYear()),
    createdAt: now,
    updatedAt: now,
  };
  contracts.push(contract);
  writeContracts(contracts);
  return contract;
}

export function updateContract(id: string, input: ContractInput): Contract | null {
  const contracts = readContracts();
  const index = contracts.findIndex((c) => c.id === id);
  if (index === -1) return null;
  contracts[index] = {
    ...contracts[index],
    ...input,
    updatedAt: new Date().toISOString(),
  };
  writeContracts(contracts);
  return contracts[index];
}

export function deleteContract(id: string): boolean {
  const contracts = readContracts();
  const filtered = contracts.filter((c) => c.id !== id);
  if (filtered.length === contracts.length) return false;
  writeContracts(filtered);
  return true;
}

export function validateContract(input: Partial<ContractInput>): string | null {
  if (!input.partner?.name?.trim()) return "Le nom de la librairie est requis";
  if (!input.partner?.representative?.trim()) return "Le représentant de la librairie est requis";
  if (!input.startDate) return "La date de début est requise";
  if (!input.items?.length || input.items.every((i) => i.qty <= 0))
    return "Ajoutez au moins un ouvrage au bordereau de dépôt";
  const rate = input.commissionRate ?? -1;
  if (rate < 0 || rate > 100) return "La commission doit être comprise entre 0 et 100 %";
  return null;
}
