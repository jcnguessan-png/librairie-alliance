"use client";

import { useState, useEffect, useCallback } from "react";
import type { Book } from "@/data/books";
import type { Contract, ContractInput, ContractItem, ContractStatus } from "@/lib/contracts";
import { contractTotals } from "@/lib/contract-totals";

const STATUS_LABELS: Record<ContractStatus, { label: string; className: string }> = {
  draft: { label: "Brouillon", className: "bg-amber-100 text-amber-800" },
  signed: { label: "Signé", className: "bg-green-100 text-green-800" },
  terminated: { label: "Résilié", className: "bg-gray-100 text-text-muted" },
};

const emptyContract = (): ContractInput => ({
  status: "draft",
  partner: {
    name: "",
    legalForm: "",
    rccm: "",
    ncc: "",
    address: "",
    city: "Abidjan",
    phone: "",
    email: "",
    representative: "",
    representativeTitle: "Gérant(e)",
  },
  startDate: new Date().toISOString().slice(0, 10),
  durationMonths: 12,
  commissionRate: 30,
  reportDay: 5,
  paymentDays: 15,
  noticeDays: 30,
  signingPlace: "Abidjan",
  items: [],
  notes: "",
});

function fmt(n: number): string {
  return new Intl.NumberFormat("fr-FR").format(Math.round(n));
}

interface ContractsTabProps {
  books: Book[];
  showMessage: (text: string, type: string) => void;
}

export default function ContractsTab({ books, showMessage }: ContractsTabProps) {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [stock, setStock] = useState<Record<string, number>>({});
  const [editing, setEditing] = useState<ContractInput | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchContracts = useCallback(async () => {
    try {
      const [cRes, iRes] = await Promise.all([
        fetch("/api/admin/contracts"),
        fetch("/api/admin/inventory"),
      ]);
      if (cRes.ok) setContracts(await cRes.json());
      if (iRes.ok) {
        const inv: { slug: string; qtyInStock: number }[] = await iRes.json();
        setStock(Object.fromEntries(inv.map((i) => [i.slug, i.qtyInStock])));
      }
    } catch {
      showMessage("Erreur de chargement des contrats", "error");
    }
  }, [showMessage]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  const sellableBooks = books.filter((b) => b.price);

  const openNew = () => {
    setEditingId(null);
    setEditing(emptyContract());
  };

  const openEdit = (c: Contract) => {
    const { id, ...input } = c;
    setEditingId(id);
    setEditing(structuredClone(input));
  };

  const setPartner = (field: keyof ContractInput["partner"], value: string) =>
    setEditing((prev) => (prev ? { ...prev, partner: { ...prev.partner, [field]: value } } : prev));

  const setItem = (book: Book, changes: Partial<ContractItem>) =>
    setEditing((prev) => {
      if (!prev) return prev;
      const existing = prev.items.find((i) => i.slug === book.slug);
      const base: ContractItem = existing ?? { slug: book.slug, title: book.title, qty: 0, unitPrice: book.price ?? 0 };
      const next = { ...base, ...changes };
      const items = existing
        ? prev.items.map((i) => (i.slug === book.slug ? next : i))
        : [...prev.items, next];
      return { ...prev, items: items.filter((i) => i.qty > 0) };
    });

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const res = await fetch(editingId ? `/api/admin/contracts/${editingId}` : "/api/admin/contracts", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      if (res.ok) {
        const saved: Contract = await res.json();
        showMessage(editingId ? "Contrat mis à jour" : `Contrat ${saved.number} créé`, "success");
        setEditing(null);
        fetchContracts();
      } else {
        const err = await res.json().catch(() => null);
        showMessage(err?.error || `Erreur serveur (${res.status})`, "error");
      }
    } catch {
      showMessage("Erreur réseau", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (c: Contract) => {
    if (!confirm(`Supprimer le contrat ${c.number} (${c.partner.name}) ?`)) return;
    const res = await fetch(`/api/admin/contracts/${c.id}`, { method: "DELETE" });
    if (res.ok) {
      showMessage("Contrat supprimé", "success");
      fetchContracts();
    } else {
      showMessage("Erreur de suppression", "error");
    }
  };

  const totals = editing ? contractTotals(editing) : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-text-muted text-sm">
          {contracts.length} contrat{contracts.length > 1 ? "s" : ""} de dépôt-vente
        </p>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary-light transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nouveau contrat
        </button>
      </div>

      {contracts.length === 0 ? (
        <div className="bg-white rounded-xl border border-warm p-10 text-center text-text-muted text-sm">
          Aucun contrat pour l&apos;instant. Créez le premier contrat de dépôt-vente avec une librairie partenaire.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-warm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-warm">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-primary">N°</th>
                  <th className="text-left px-4 py-3 font-semibold text-primary">Librairie</th>
                  <th className="text-left px-4 py-3 font-semibold text-primary hidden md:table-cell">Début</th>
                  <th className="text-right px-4 py-3 font-semibold text-primary hidden md:table-cell">Exemplaires</th>
                  <th className="text-right px-4 py-3 font-semibold text-primary hidden lg:table-cell">Valeur publique</th>
                  <th className="text-left px-4 py-3 font-semibold text-primary hidden sm:table-cell">Statut</th>
                  <th className="text-right px-4 py-3 font-semibold text-primary">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm">
                {contracts.map((c) => {
                  const t = contractTotals(c);
                  return (
                    <tr key={c.id} className="hover:bg-secondary/50">
                      <td className="px-4 py-3 font-medium text-primary whitespace-nowrap">{c.number}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-primary">{c.partner.name}</p>
                        <p className="text-text-muted text-xs">{c.partner.city}</p>
                      </td>
                      <td className="px-4 py-3 text-text-muted hidden md:table-cell">
                        {new Date(c.startDate).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="text-right px-4 py-3 text-text-muted hidden md:table-cell">{t.qty}</td>
                      <td className="text-right px-4 py-3 text-text-muted hidden lg:table-cell">{fmt(t.value)} FCFA</td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_LABELS[c.status].className}`}>
                          {STATUS_LABELS[c.status].label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`/admin/contrats/${c.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary-light transition-colors whitespace-nowrap"
                          >
                            Générer le contrat
                          </a>
                          <button onClick={() => openEdit(c)} className="px-3 py-1.5 rounded-lg bg-accent/20 text-primary text-xs font-medium hover:bg-accent/30 transition-colors">
                            Modifier
                          </button>
                          <button onClick={() => handleDelete(c)} className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs font-medium hover:bg-red-100 transition-colors">
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editing && totals && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl m-4 mb-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-warm">
              <h2 className="font-heading text-xl font-bold text-primary">
                {editingId ? "Modifier le contrat" : "Nouveau contrat de dépôt-vente"}
              </h2>
              <button onClick={() => setEditing(null)} className="text-text-muted hover:text-primary">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-4 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Librairie partenaire */}
              <section>
                <h3 className="text-sm font-semibold text-primary mb-3 uppercase tracking-wider">Librairie partenaire (dépositaire)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <TextField label="Raison sociale *" value={editing.partner.name} onChange={(v) => setPartner("name", v)} placeholder="Librairie de France" />
                  <TextField label="Forme juridique" value={editing.partner.legalForm} onChange={(v) => setPartner("legalForm", v)} placeholder="SARL, SA, Entreprise individuelle…" />
                  <TextField label="RCCM" value={editing.partner.rccm} onChange={(v) => setPartner("rccm", v)} placeholder="CI-ABJ-…" />
                  <TextField label="N° compte contribuable" value={editing.partner.ncc} onChange={(v) => setPartner("ncc", v)} />
                  <TextField label="Adresse" value={editing.partner.address} onChange={(v) => setPartner("address", v)} placeholder="Plateau, avenue…" />
                  <TextField label="Ville" value={editing.partner.city} onChange={(v) => setPartner("city", v)} />
                  <TextField label="Téléphone" value={editing.partner.phone} onChange={(v) => setPartner("phone", v)} />
                  <TextField label="Email" value={editing.partner.email} onChange={(v) => setPartner("email", v)} />
                  <TextField label="Représentant *" value={editing.partner.representative} onChange={(v) => setPartner("representative", v)} placeholder="Nom et prénom(s)" />
                  <TextField label="Qualité du représentant" value={editing.partner.representativeTitle} onChange={(v) => setPartner("representativeTitle", v)} />
                </div>
              </section>

              {/* Conditions */}
              <section>
                <h3 className="text-sm font-semibold text-primary mb-3 uppercase tracking-wider">Conditions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1">Date de début *</label>
                    <input type="date" value={editing.startDate} onChange={(e) => setEditing({ ...editing, startDate: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-warm text-sm focus:outline-none focus:border-accent" />
                  </div>
                  <NumberField label="Durée (mois)" value={editing.durationMonths} onChange={(v) => setEditing({ ...editing, durationMonths: v })} />
                  <NumberField label="Commission (%)" value={editing.commissionRate} onChange={(v) => setEditing({ ...editing, commissionRate: v })} />
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1">Statut</label>
                    <select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as ContractStatus })} className="w-full px-3 py-2 rounded-lg border border-warm text-sm focus:outline-none focus:border-accent">
                      {(Object.keys(STATUS_LABELS) as ContractStatus[]).map((s) => (
                        <option key={s} value={s}>{STATUS_LABELS[s].label}</option>
                      ))}
                    </select>
                  </div>
                  <NumberField label="Relevé des ventes (jour du mois)" value={editing.reportDay} onChange={(v) => setEditing({ ...editing, reportDay: v })} />
                  <NumberField label="Paiement sous (jours)" value={editing.paymentDays} onChange={(v) => setEditing({ ...editing, paymentDays: v })} />
                  <NumberField label="Préavis de résiliation (jours)" value={editing.noticeDays} onChange={(v) => setEditing({ ...editing, noticeDays: v })} />
                  <TextField label="Lieu de signature" value={editing.signingPlace} onChange={(v) => setEditing({ ...editing, signingPlace: v })} />
                </div>
              </section>

              {/* Bordereau de dépôt */}
              <section>
                <h3 className="text-sm font-semibold text-primary mb-1 uppercase tracking-wider">Bordereau de dépôt</h3>
                <p className="text-xs text-text-muted mb-3">Saisissez la quantité confiée pour chaque ouvrage. Le prix public est celui du catalogue, modifiable.</p>
                <div className="border border-warm rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-warm">
                      <tr>
                        <th className="text-left px-3 py-2 font-semibold text-primary">Ouvrage</th>
                        <th className="text-right px-3 py-2 font-semibold text-primary hidden sm:table-cell">Stock</th>
                        <th className="text-right px-3 py-2 font-semibold text-primary w-24">Qté</th>
                        <th className="text-right px-3 py-2 font-semibold text-primary w-32">Prix public</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-warm">
                      {sellableBooks.map((book) => {
                        const item = editing.items.find((i) => i.slug === book.slug);
                        const available = stock[book.slug] ?? 0;
                        const overStock = !!item && item.qty > available;
                        return (
                          <tr key={book.slug} className={item ? "bg-accent/5" : ""}>
                            <td className="px-3 py-2">
                              <p className="text-primary line-clamp-1">{book.title}</p>
                              {overStock && (
                                <p className="text-xs text-amber-700">Quantité supérieure au stock disponible</p>
                              )}
                            </td>
                            <td className="text-right px-3 py-2 text-text-muted hidden sm:table-cell">{available}</td>
                            <td className="px-3 py-2">
                              <input
                                type="number"
                                min={0}
                                value={item?.qty || ""}
                                onChange={(e) => setItem(book, { qty: Math.max(0, Number(e.target.value) || 0) })}
                                className="w-full px-2 py-1 rounded border border-warm text-sm text-right focus:outline-none focus:border-accent"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <input
                                type="number"
                                min={0}
                                value={item?.unitPrice ?? book.price ?? ""}
                                disabled={!item}
                                onChange={(e) => setItem(book, { unitPrice: Number(e.target.value) || 0 })}
                                className="w-full px-2 py-1 rounded border border-warm text-sm text-right focus:outline-none focus:border-accent disabled:bg-transparent disabled:border-transparent disabled:text-text-muted"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3 text-sm bg-secondary rounded-lg p-3">
                  <div>
                    <p className="text-text-muted">Exemplaires</p>
                    <p className="font-semibold text-primary">{totals.qty}</p>
                  </div>
                  <div>
                    <p className="text-text-muted">Valeur publique</p>
                    <p className="font-semibold text-primary">{fmt(totals.value)} FCFA</p>
                  </div>
                  <div>
                    <p className="text-text-muted">Commission ({editing.commissionRate} %)</p>
                    <p className="font-semibold text-primary">{fmt(totals.commission)} FCFA</p>
                  </div>
                  <div>
                    <p className="text-text-muted">Net à reverser</p>
                    <p className="font-semibold text-green-700">{fmt(totals.net)} FCFA</p>
                  </div>
                </div>
              </section>

              <section>
                <label className="block text-sm font-semibold text-primary mb-2 uppercase tracking-wider">Clauses particulières</label>
                <textarea
                  value={editing.notes}
                  onChange={(e) => setEditing({ ...editing, notes: e.target.value })}
                  rows={3}
                  placeholder="Optionnel — ex. présentoir fourni par le déposant, séance de dédicace prévue…"
                  className="w-full px-3 py-2 rounded-lg border border-warm text-sm focus:outline-none focus:border-accent resize-none"
                />
              </section>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-warm">
              <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-lg border border-warm text-text-muted text-sm font-medium hover:bg-warm transition-colors">
                Annuler
              </button>
              <button onClick={handleSave} disabled={saving} className="px-6 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-light transition-colors disabled:opacity-50">
                {saving ? "Enregistrement..." : editingId ? "Enregistrer" : "Créer le contrat"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TextField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-text-muted mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg border border-warm text-sm focus:outline-none focus:border-accent"
      />
    </div>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="block text-xs font-medium text-text-muted mb-1">{label}</label>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="w-full px-3 py-2 rounded-lg border border-warm text-sm focus:outline-none focus:border-accent"
      />
    </div>
  );
}
