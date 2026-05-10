"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import type { Book } from "@/data/books";

type PaymentMethod = "cash" | "mobile-money" | "card";

interface CartItem {
  slug: string;
  title: string;
  price: number;
  coverImage: string;
  qty: number;
}

interface Sale {
  id: string;
  items: { slug: string; title: string; price: number; qty: number }[];
  total: number;
  paymentMethod: PaymentMethod;
  amountPaid: number;
  change: number;
  date: string;
  customerName?: string;
}

interface SalesStats {
  totalRevenue: number;
  totalItems: number;
  totalSales: number;
  byPayment: Record<string, number>;
}

function fmt(n: number): string {
  return new Intl.NumberFormat("fr-FR").format(n);
}

interface POSTabProps {
  books: Book[];
  showMessage: (text: string, type: string) => void;
}

export default function POSTab({ books, showMessage }: POSTabProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [amountPaid, setAmountPaid] = useState<number | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [processing, setProcessing] = useState(false);
  const [lastSale, setLastSale] = useState<Sale | null>(null);
  const [sales, setSales] = useState<Sale[]>([]);
  const [stats, setStats] = useState<SalesStats | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  const fetchSales = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/sales?period=today");
      if (res.ok) {
        const data = await res.json();
        setSales(data.sales);
        setStats(data.stats);
      }
    } catch { /* silent */ }
  }, []);

  useEffect(() => { fetchSales(); }, [fetchSales]);

  const availableBooks = books.filter(
    (b) => b.status === "available" && b.price
  );

  const filtered = search.trim()
    ? availableBooks.filter((b) =>
        b.title.toLowerCase().includes(search.toLowerCase())
      )
    : availableBooks;

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const effectiveAmountPaid = amountPaid ?? cartTotal;
  const change = effectiveAmountPaid - cartTotal;

  const addToCart = (book: Book) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.slug === book.slug);
      if (existing) {
        return prev.map((i) =>
          i.slug === book.slug ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [
        ...prev,
        {
          slug: book.slug,
          title: book.title,
          price: book.price!,
          coverImage: book.coverImage,
          qty: 1,
        },
      ];
    });
  };

  const updateQty = (slug: string, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((i) => i.slug !== slug));
    } else {
      setCart((prev) =>
        prev.map((i) => (i.slug === slug ? { ...i, qty } : i))
      );
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    if (paymentMethod === "cash" && effectiveAmountPaid < cartTotal) {
      showMessage("Montant insuffisant", "error");
      return;
    }

    setProcessing(true);
    try {
      const res = await fetch("/api/admin/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map(({ slug, title, price, qty }) => ({ slug, title, price, qty })),
          total: cartTotal,
          paymentMethod,
          amountPaid: paymentMethod === "cash" ? effectiveAmountPaid : cartTotal,
          change: paymentMethod === "cash" ? Math.max(0, change) : 0,
          customerName: customerName || undefined,
        }),
      });

      if (res.ok) {
        const sale = await res.json();
        setLastSale(sale);
        setCart([]);
        setAmountPaid(null);
        setCustomerName("");
        showMessage(`Vente ${sale.id} enregistrée`, "success");
        fetchSales();
      } else {
        const err = await res.json().catch(() => null);
        showMessage(err?.error || `Erreur serveur (${res.status})`, "error");
      }
    } catch {
      showMessage("Erreur réseau lors de la vente", "error");
    } finally {
      setProcessing(false);
    }
  };

  const printReceipt = () => {
    if (!receiptRef.current) return;
    const printWindow = window.open("", "_blank", "width=350,height=600");
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>Reçu</title>
      <style>body{font-family:monospace;font-size:12px;padding:10px;max-width:300px;margin:0 auto}
      .center{text-align:center}.line{border-top:1px dashed #000;margin:8px 0}
      .row{display:flex;justify-content:space-between}.bold{font-weight:bold}
      .big{font-size:16px}</style></head><body>
      ${receiptRef.current.innerHTML}
      <script>window.print();window.close();</script></body></html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left - Product grid */}
      <div className="flex-1">
        {/* Today's stats */}
        {stats && (
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-white rounded-xl border border-warm p-4">
              <p className="text-text-muted text-xs uppercase tracking-wider">Ventes aujourd&apos;hui</p>
              <p className="text-xl font-bold text-primary">{stats.totalSales}</p>
            </div>
            <div className="bg-white rounded-xl border border-warm p-4">
              <p className="text-text-muted text-xs uppercase tracking-wider">CA du jour</p>
              <p className="text-xl font-bold text-primary">{fmt(stats.totalRevenue)} F</p>
            </div>
            <div className="bg-white rounded-xl border border-warm p-4">
              <p className="text-text-muted text-xs uppercase tracking-wider">Articles vendus</p>
              <p className="text-xl font-bold text-primary">{stats.totalItems}</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Rechercher un livre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-warm bg-white text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`shrink-0 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              showHistory ? "bg-primary text-white" : "bg-white border border-warm text-primary hover:bg-warm"
            }`}
          >
            Historique
          </button>
        </div>

        {showHistory ? (
          <div className="bg-white rounded-xl border border-warm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-warm">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-primary">N°</th>
                  <th className="text-left px-4 py-3 font-semibold text-primary">Heure</th>
                  <th className="text-left px-4 py-3 font-semibold text-primary hidden sm:table-cell">Articles</th>
                  <th className="text-left px-4 py-3 font-semibold text-primary hidden md:table-cell">Paiement</th>
                  <th className="text-right px-4 py-3 font-semibold text-primary">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm">
                {sales.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-text-muted">Aucune vente aujourd&apos;hui</td></tr>
                ) : (
                  sales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-secondary/50">
                      <td className="px-4 py-3 font-mono text-xs text-primary">{sale.id}</td>
                      <td className="px-4 py-3 text-text-muted">{new Date(sale.date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</td>
                      <td className="px-4 py-3 text-text-muted hidden sm:table-cell">{sale.items.map((i) => `${i.title} (×${i.qty})`).join(", ")}</td>
                      <td className="px-4 py-3 text-text-muted hidden md:table-cell capitalize">{sale.paymentMethod === "mobile-money" ? "Mobile Money" : sale.paymentMethod === "cash" ? "Espèces" : "Carte"}</td>
                      <td className="text-right px-4 py-3 font-semibold text-primary">{fmt(sale.total)} F</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filtered.map((book) => (
              <button
                key={book.slug}
                onClick={() => addToCart(book)}
                className="bg-white rounded-xl border border-warm p-3 text-left hover:shadow-md hover:border-accent/50 transition-all group"
              >
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-warm mb-2">
                  <Image src={book.coverImage} alt="" fill className="object-cover group-hover:scale-105 transition-transform" sizes="150px" />
                </div>
                <p className="font-medium text-primary text-xs line-clamp-2 mb-1">{book.title}</p>
                <p className="text-accent font-bold text-sm">{fmt(book.price!)} F</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right - Cart */}
      <div className="w-full lg:w-96 shrink-0">
        <div className="bg-white rounded-xl border border-warm sticky top-24">
          <div className="px-4 py-3 border-b border-warm">
            <h3 className="font-heading font-bold text-primary text-lg">Panier</h3>
          </div>

          {cart.length === 0 ? (
            <div className="px-4 py-12 text-center text-text-muted text-sm">
              Cliquez sur un livre pour l&apos;ajouter
            </div>
          ) : (
            <div className="divide-y divide-warm max-h-64 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.slug} className="px-4 py-3 flex items-center gap-3">
                  <div className="w-10 h-14 relative rounded overflow-hidden bg-warm shrink-0">
                    <Image src={item.coverImage} alt="" fill className="object-cover" sizes="40px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-primary line-clamp-1">{item.title}</p>
                    <p className="text-xs text-text-muted">{fmt(item.price)} F</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => updateQty(item.slug, item.qty - 1)} className="w-7 h-7 rounded-lg bg-warm text-primary text-sm font-bold hover:bg-red-100 transition-colors">−</button>
                    <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
                    <button onClick={() => updateQty(item.slug, item.qty + 1)} className="w-7 h-7 rounded-lg bg-warm text-primary text-sm font-bold hover:bg-green-100 transition-colors">+</button>
                  </div>
                  <p className="text-sm font-semibold text-primary w-20 text-right">{fmt(item.price * item.qty)} F</p>
                </div>
              ))}
            </div>
          )}

          {cart.length > 0 && (
            <div className="border-t border-warm px-4 py-4 space-y-3">
              <div className="flex justify-between text-lg font-bold text-primary">
                <span>Total</span>
                <span>{fmt(cartTotal)} FCFA</span>
              </div>

              {/* Customer name */}
              <input
                type="text"
                placeholder="Nom du client (optionnel)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-warm text-sm focus:outline-none focus:border-accent"
              />

              {/* Payment method */}
              <div className="flex gap-2">
                {([
                  { value: "cash" as const, label: "Espèces", icon: "💵" },
                  { value: "mobile-money" as const, label: "Mobile", icon: "📱" },
                  { value: "card" as const, label: "Carte", icon: "💳" },
                ]).map((pm) => (
                  <button
                    key={pm.value}
                    onClick={() => {
                      setPaymentMethod(pm.value);
                      setAmountPaid(null);
                    }}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors border ${
                      paymentMethod === pm.value
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-text-muted border-warm hover:border-accent/50"
                    }`}
                  >
                    {pm.icon} {pm.label}
                  </button>
                ))}
              </div>

              {/* Amount paid (cash only) */}
              {paymentMethod === "cash" && (
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Montant reçu (FCFA)</label>
                  <input
                    type="number"
                    value={amountPaid ?? ""}
                    onChange={(e) => setAmountPaid(e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-3 py-2 rounded-lg border border-warm text-sm focus:outline-none focus:border-accent"
                    placeholder={`${fmt(cartTotal)} (compte exact)`}
                  />
                  {amountPaid !== null && amountPaid !== cartTotal && (
                    <p className={`text-sm mt-1 font-semibold ${change >= 0 ? "text-green-700" : "text-red-600"}`}>
                      {change >= 0 ? `Monnaie à rendre : ${fmt(change)} FCFA` : `Il manque ${fmt(Math.abs(change))} FCFA`}
                    </p>
                  )}
                </div>
              )}

              {/* Quick amounts */}
              {paymentMethod === "cash" && (
                <div className="flex gap-2 flex-wrap">
                  {[5000, 10000, 15000, 20000, 25000].filter((v) => v >= cartTotal).slice(0, 4).map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setAmountPaid(amount)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        amountPaid === amount ? "bg-accent text-primary" : "bg-warm text-text-muted hover:bg-accent/20"
                      }`}
                    >
                      {fmt(amount)} F
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={processing || (paymentMethod === "cash" && amountPaid !== null && amountPaid < cartTotal)}
                className="w-full py-3 rounded-lg bg-green-600 text-white font-bold text-sm hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? "Traitement..." : `Encaisser ${fmt(cartTotal)} FCFA`}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Receipt Modal */}
      {lastSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm m-4">
            <div className="px-6 py-4 border-b border-warm flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-primary">Reçu de vente</h2>
              <button onClick={() => setLastSale(null)} className="text-text-muted hover:text-primary">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div ref={receiptRef} className="px-6 py-4">
              <div className="text-center mb-4">
                <p className="font-bold text-lg">LIBRAIRIE D&apos;ALLIANCE</p>
                <p className="text-xs text-text-muted">Cathédrale ABMCI — Abidjan</p>
                <p className="text-xs text-text-muted mt-1">
                  {new Date(lastSale.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}
                  {" — "}
                  {new Date(lastSale.date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                </p>
                <p className="text-xs font-mono mt-1">N° {lastSale.id}</p>
              </div>

              <div className="border-t border-dashed border-gray-300 my-3" />

              {lastSale.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm py-1">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-text-muted">{item.qty} × {fmt(item.price)} F</p>
                  </div>
                  <p className="font-semibold shrink-0">{fmt(item.price * item.qty)} F</p>
                </div>
              ))}

              <div className="border-t border-dashed border-gray-300 my-3" />

              <div className="flex justify-between font-bold text-lg">
                <span>TOTAL</span>
                <span>{fmt(lastSale.total)} FCFA</span>
              </div>

              <div className="text-sm mt-2 space-y-1">
                <div className="flex justify-between">
                  <span className="text-text-muted">Paiement</span>
                  <span className="capitalize">{lastSale.paymentMethod === "mobile-money" ? "Mobile Money" : lastSale.paymentMethod === "cash" ? "Espèces" : "Carte"}</span>
                </div>
                {lastSale.paymentMethod === "cash" && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Reçu</span>
                      <span>{fmt(lastSale.amountPaid)} F</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Monnaie</span>
                      <span>{fmt(lastSale.change)} F</span>
                    </div>
                  </>
                )}
                {lastSale.customerName && (
                  <div className="flex justify-between">
                    <span className="text-text-muted">Client</span>
                    <span>{lastSale.customerName}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-dashed border-gray-300 my-3" />
              <p className="text-center text-xs text-text-muted">Merci pour votre achat !</p>
              <p className="text-center text-xs text-text-muted">Librairie d&apos;Alliance — ABMCI</p>
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-warm">
              <button onClick={() => setLastSale(null)} className="flex-1 px-4 py-2 rounded-lg border border-warm text-text-muted text-sm font-medium hover:bg-warm transition-colors">
                Fermer
              </button>
              <button onClick={printReceipt} className="flex-1 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-light transition-colors">
                Imprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
