"use client";

import { useState, useEffect, useCallback } from "react";
import type { Book } from "@/data/books";

interface BookInventory {
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

const emptyInventory: Omit<BookInventory, "slug" | "updatedAt"> = {
  purchasePrice: 0,
  qtyInStock: 0,
  qtyOrdered: 0,
  unitWeightGrams: 0,
  shippingCost: 0,
  marketingCost: 0,
  authorRights: 0,
  salePriceFrance: null,
  salePriceCDI: null,
  qtySoldFrance: 0,
  qtySoldCDI: 0,
  giftsQty: 0,
};

function fmt(n: number, decimals = 0): string {
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
}

interface MarginsTabProps {
  books: Book[];
  showMessage: (text: string, type: string) => void;
}

export default function MarginsTab({ books, showMessage }: MarginsTabProps) {
  const [inventory, setInventory] = useState<BookInventory[]>([]);
  const [editing, setEditing] = useState<BookInventory | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchInventory = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/inventory");
      if (res.ok) setInventory(await res.json());
    } catch {
      showMessage("Erreur de chargement inventaire", "error");
    }
  }, [showMessage]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const getInv = (slug: string) => inventory.find((i) => i.slug === slug);

  const calc = (inv: BookInventory) => {
    const qty = inv.qtyOrdered || 1;
    const totalPurchase = inv.purchasePrice * qty;
    const costOfReturn = totalPurchase + inv.shippingCost;
    const unitCost = costOfReturn / qty;
    const marginFranceUnit = (inv.salePriceFrance ?? 0) - unitCost;
    const marginCDIUnit = (inv.salePriceCDI ?? 0) - unitCost;
    const revFrance = (inv.salePriceFrance ?? 0) * inv.qtySoldFrance;
    const revCDI = (inv.salePriceCDI ?? 0) * inv.qtySoldCDI;
    const margeBruteFR = marginFranceUnit * inv.qtySoldFrance;
    const margeBruteCI = marginCDIUnit * inv.qtySoldCDI;
    const margeNetFR = margeBruteFR - inv.authorRights;
    const margeNetCI = margeBruteCI - inv.authorRights - inv.marketingCost;
    return { totalPurchase, costOfReturn, unitCost, marginFranceUnit, marginCDIUnit, revFrance, revCDI, margeBruteFR, margeBruteCI, margeNetFR, margeNetCI };
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      if (res.ok) {
        showMessage("Données enregistrées", "success");
        setEditing(null);
        fetchInventory();
      }
    } catch {
      showMessage("Erreur de sauvegarde", "error");
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (book: Book) => {
    const existing = getInv(book.slug);
    setEditing(
      existing
        ? { ...existing }
        : { ...emptyInventory, slug: book.slug, salePriceCDI: book.price, updatedAt: "" }
    );
  };

  const totalRevAll = inventory.reduce((sum, inv) => {
    const c = calc(inv);
    return sum + c.revFrance + c.revCDI;
  }, 0);

  const totalMargeNet = inventory.reduce((sum, inv) => {
    const c = calc(inv);
    return sum + c.margeNetFR + c.margeNetCI;
  }, 0);

  const totalCost = inventory.reduce((sum, inv) => sum + calc(inv).costOfReturn, 0);

  return (
    <div>
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-warm p-5">
          <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Coût total d&apos;achat</p>
          <p className="text-2xl font-bold text-primary">{fmt(totalCost)} €</p>
        </div>
        <div className="bg-white rounded-xl border border-warm p-5">
          <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Chiffre d&apos;affaires total</p>
          <p className="text-2xl font-bold text-primary">{fmt(totalRevAll)} FCFA</p>
        </div>
        <div className="bg-white rounded-xl border border-warm p-5">
          <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Marge nette totale</p>
          <p className={`text-2xl font-bold ${totalMargeNet >= 0 ? "text-green-700" : "text-red-600"}`}>
            {fmt(totalMargeNet)} FCFA
          </p>
        </div>
      </div>

      {/* Books inventory table */}
      <div className="bg-white rounded-xl border border-warm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-warm">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-primary">Livre</th>
                <th className="text-right px-4 py-3 font-semibold text-primary">Prix achat (€)</th>
                <th className="text-right px-4 py-3 font-semibold text-primary hidden md:table-cell">Stock</th>
                <th className="text-right px-4 py-3 font-semibold text-primary hidden md:table-cell">Coût unitaire</th>
                <th className="text-right px-4 py-3 font-semibold text-primary hidden lg:table-cell">Ventes CDI</th>
                <th className="text-right px-4 py-3 font-semibold text-primary hidden lg:table-cell">Marge nette CDI</th>
                <th className="text-right px-4 py-3 font-semibold text-primary">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm">
              {books.map((book) => {
                const inv = getInv(book.slug);
                const c = inv ? calc(inv) : null;
                return (
                  <tr key={book.slug} className="hover:bg-secondary/50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-primary line-clamp-1">{book.title}</p>
                    </td>
                    <td className="text-right px-4 py-3 text-text-muted">
                      {inv ? `${fmt(inv.purchasePrice, 2)} €` : "—"}
                    </td>
                    <td className="text-right px-4 py-3 text-text-muted hidden md:table-cell">
                      {inv ? inv.qtyInStock : "—"}
                    </td>
                    <td className="text-right px-4 py-3 text-text-muted hidden md:table-cell">
                      {c ? `${fmt(c.unitCost, 2)} €` : "—"}
                    </td>
                    <td className="text-right px-4 py-3 hidden lg:table-cell">
                      {inv ? `${fmt(c!.revCDI)} FCFA` : "—"}
                    </td>
                    <td className="text-right px-4 py-3 hidden lg:table-cell">
                      {c ? (
                        <span className={c.margeNetCI >= 0 ? "text-green-700" : "text-red-600"}>
                          {fmt(c.margeNetCI)} FCFA
                        </span>
                      ) : "—"}
                    </td>
                    <td className="text-right px-4 py-3">
                      <button
                        onClick={() => openEdit(book)}
                        className="px-3 py-1.5 rounded-lg bg-accent/20 text-primary text-xs font-medium hover:bg-accent/30 transition-colors"
                      >
                        {inv ? "Modifier" : "Saisir"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl m-4 mb-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-warm">
              <h2 className="font-heading text-xl font-bold text-primary">
                Coûts & marges — {books.find((b) => b.slug === editing.slug)?.title}
              </h2>
              <button onClick={() => setEditing(null)} className="text-text-muted hover:text-primary">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-4 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Achat & Stock */}
              <div>
                <h3 className="text-sm font-semibold text-primary mb-3 uppercase tracking-wider">Achat & Stock</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Field label="Prix achat (€)" value={editing.purchasePrice} onChange={(v) => setEditing({ ...editing, purchasePrice: v })} step="0.01" />
                  <Field label="Qté commandée" value={editing.qtyOrdered} onChange={(v) => setEditing({ ...editing, qtyOrdered: v })} />
                  <Field label="Qté en stock" value={editing.qtyInStock} onChange={(v) => setEditing({ ...editing, qtyInStock: v })} />
                  <Field label="Cadeaux" value={editing.giftsQty} onChange={(v) => setEditing({ ...editing, giftsQty: v })} />
                </div>
              </div>

              {/* Poids & Expédition */}
              <div>
                <h3 className="text-sm font-semibold text-primary mb-3 uppercase tracking-wider">Poids & Expédition</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <Field label="Poids unitaire (g)" value={editing.unitWeightGrams} onChange={(v) => setEditing({ ...editing, unitWeightGrams: v })} />
                  <Field label="Coût expédition (€)" value={editing.shippingCost} onChange={(v) => setEditing({ ...editing, shippingCost: v })} step="0.01" />
                  <Field label="Marketing (FCFA)" value={editing.marketingCost} onChange={(v) => setEditing({ ...editing, marketingCost: v })} />
                </div>
              </div>

              {/* Calculated cost summary */}
              {(() => {
                const c = calc(editing);
                return (
                  <div className="bg-secondary rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-primary mb-2 uppercase tracking-wider">Coûts calculés</h3>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-text-muted">Prix achat total</p>
                        <p className="font-semibold text-primary">{fmt(c.totalPurchase, 2)} €</p>
                      </div>
                      <div>
                        <p className="text-text-muted">Coût de revient</p>
                        <p className="font-semibold text-primary">{fmt(c.costOfReturn, 2)} €</p>
                      </div>
                      <div>
                        <p className="text-text-muted">Coût unitaire</p>
                        <p className="font-semibold text-primary">{fmt(c.unitCost, 2)} €</p>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Ventes France */}
              <div>
                <h3 className="text-sm font-semibold text-primary mb-3 uppercase tracking-wider">Ventes France (€)</h3>
                <div className="grid grid-cols-3 gap-3">
                  <Field label="Prix vente (€)" value={editing.salePriceFrance ?? 0} onChange={(v) => setEditing({ ...editing, salePriceFrance: v || null })} step="0.01" />
                  <Field label="Qté vendues" value={editing.qtySoldFrance} onChange={(v) => setEditing({ ...editing, qtySoldFrance: v })} />
                  <Field label="Droits auteur (€)" value={editing.authorRights} onChange={(v) => setEditing({ ...editing, authorRights: v })} step="0.01" />
                </div>
                {(() => {
                  const c = calc(editing);
                  return (
                    <div className="grid grid-cols-3 gap-4 mt-3 text-sm bg-blue-50 rounded-lg p-3">
                      <div>
                        <p className="text-text-muted">CA France</p>
                        <p className="font-semibold">{fmt(c.revFrance, 2)} €</p>
                      </div>
                      <div>
                        <p className="text-text-muted">Marge brute</p>
                        <p className={`font-semibold ${c.margeBruteFR >= 0 ? "text-green-700" : "text-red-600"}`}>{fmt(c.margeBruteFR, 2)} €</p>
                      </div>
                      <div>
                        <p className="text-text-muted">Marge nette</p>
                        <p className={`font-semibold ${c.margeNetFR >= 0 ? "text-green-700" : "text-red-600"}`}>{fmt(c.margeNetFR, 2)} €</p>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Ventes Côte d'Ivoire */}
              <div>
                <h3 className="text-sm font-semibold text-primary mb-3 uppercase tracking-wider">Ventes Côte d&apos;Ivoire (FCFA)</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Prix vente (FCFA)" value={editing.salePriceCDI ?? 0} onChange={(v) => setEditing({ ...editing, salePriceCDI: v || null })} />
                  <Field label="Qté vendues" value={editing.qtySoldCDI} onChange={(v) => setEditing({ ...editing, qtySoldCDI: v })} />
                </div>
                {(() => {
                  const c = calc(editing);
                  return (
                    <div className="grid grid-cols-3 gap-4 mt-3 text-sm bg-green-50 rounded-lg p-3">
                      <div>
                        <p className="text-text-muted">CA CDI</p>
                        <p className="font-semibold">{fmt(c.revCDI)} FCFA</p>
                      </div>
                      <div>
                        <p className="text-text-muted">Marge brute</p>
                        <p className={`font-semibold ${c.margeBruteCI >= 0 ? "text-green-700" : "text-red-600"}`}>{fmt(c.margeBruteCI)} FCFA</p>
                      </div>
                      <div>
                        <p className="text-text-muted">Marge nette</p>
                        <p className={`font-semibold ${c.margeNetCI >= 0 ? "text-green-700" : "text-red-600"}`}>{fmt(c.margeNetCI)} FCFA</p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-warm">
              <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-lg border border-warm text-text-muted text-sm font-medium hover:bg-warm transition-colors">
                Annuler
              </button>
              <button onClick={handleSave} disabled={saving} className="px-6 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-light transition-colors disabled:opacity-50">
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, step }: { label: string; value: number; onChange: (v: number) => void; step?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-text-muted mb-1">{label}</label>
      <input
        type="number"
        value={value || ""}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        step={step}
        className="w-full px-3 py-2 rounded-lg border border-warm text-sm focus:outline-none focus:border-accent"
      />
    </div>
  );
}
