"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import type { Book, BookStatus, BookCategory, BookFormat } from "@/data/books";
import MarginsTab from "./components/MarginsTab";
import POSTab from "./components/POSTab";

type AdminTab = "books" | "margins" | "pos";

const STATUS_OPTIONS: { value: BookStatus; label: string }[] = [
  { value: "available", label: "Disponible" },
  { value: "out-of-stock", label: "Rupture de stock" },
  { value: "preorder", label: "Pré-commande" },
  { value: "coming-soon", label: "Bientôt disponible" },
];

const CATEGORY_OPTIONS: { value: BookCategory; label: string }[] = [
  { value: "livre-papier", label: "Livre papier" },
  { value: "ebook", label: "Ebook" },
  { value: "livre-audio", label: "Livre audio" },
  { value: "bible", label: "Bible" },
  { value: "kids-ado", label: "Kids & Ado" },
  { value: "accessoire", label: "Accessoire" },
];

const FORMAT_OPTIONS: { value: BookFormat; label: string }[] = [
  { value: "papier", label: "Papier" },
  { value: "ebook", label: "Ebook" },
  { value: "audio", label: "Audio" },
];

const emptyBook: Partial<Book> = {
  slug: "",
  title: "",
  author: "Pasteur Alexandre Amazou",
  category: "livre-papier",
  status: "available",
  featured: false,
  badge: "",
  price: null,
  formats: ["papier"],
  audioExcerpt: null,
  amazonLink: null,
  description: "",
  longDescription: "",
  coverImage: "",
  pages: null,
  year: null,
  isbn: "",
};

const TABS: { id: AdminTab; label: string; icon: string }[] = [
  { id: "books", label: "Livres", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
  { id: "margins", label: "Marges & Coûts", icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" },
  { id: "pos", label: "Point de vente", icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" },
];

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<AdminTab>("books");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingBook, setEditingBook] = useState<Partial<Book> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/books");
      if (res.status === 401) { setIsLoggedIn(false); return; }
      const data = await res.json();
      setBooks(data);
    } catch {
      showMessage("Erreur de chargement", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) fetchBooks();
  }, [isLoggedIn, fetchBooks]);

  const showMessage = useCallback((text: string, type: string) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) { setIsLoggedIn(true); setPassword(""); }
      else setLoginError("Mot de passe incorrect");
    } catch { setLoginError("Erreur de connexion"); }
  };

  const handleSave = async () => {
    if (!editingBook?.title || !editingBook?.slug) {
      showMessage("Titre et slug sont requis", "error");
      return;
    }
    setSaving(true);
    try {
      const url = isNew ? "/api/admin/books" : `/api/admin/books/${editingBook.slug}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editingBook) });
      if (res.ok) {
        showMessage(isNew ? "Livre ajouté avec succès" : "Livre mis à jour", "success");
        setEditingBook(null);
        fetchBooks();
      } else {
        const err = await res.json();
        showMessage(err.error || "Erreur", "error");
      }
    } catch { showMessage("Erreur de sauvegarde", "error"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`Supprimer "${title}" ?`)) return;
    try {
      const res = await fetch(`/api/admin/books/${slug}`, { method: "DELETE" });
      if (res.ok) { showMessage("Livre supprimé", "success"); fetchBooks(); }
    } catch { showMessage("Erreur de suppression", "error"); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        setEditingBook((prev) => (prev ? { ...prev, coverImage: data.path } : prev));
        showMessage("Image uploadée", "success");
      } else {
        const err = await res.json();
        showMessage(err.error || "Erreur upload", "error");
      }
    } catch { showMessage("Erreur upload", "error"); }
  };

  const slugify = (text: string) =>
    text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  // ─── Login Screen ─────────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center p-4 pt-20">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary flex items-center justify-center mb-4">
              <span className="text-accent font-heading font-bold text-2xl">LA</span>
            </div>
            <h1 className="font-heading text-2xl font-bold text-primary">Administration</h1>
            <p className="text-text-muted text-sm mt-1">Librairie d&apos;Alliance</p>
          </div>
          <form onSubmit={handleLogin}>
            <label className="block text-sm font-medium text-text mb-2">Mot de passe</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-warm bg-secondary text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent" placeholder="Entrez le mot de passe admin" autoFocus />
            {loginError && <p className="text-red-600 text-sm mt-2">{loginError}</p>}
            <button type="submit" className="w-full mt-4 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-light transition-colors">Connexion</button>
          </form>
        </div>
      </div>
    );
  }

  // ─── Admin Dashboard ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-secondary pt-20">
      {message.text && (
        <div className={`fixed top-24 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {message.text}
        </div>
      )}

      {/* Tab navigation */}
      <div className="bg-white border-b border-warm sticky top-16 sm:top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shrink-0 ${
                  activeTab === tab.id
                    ? "bg-primary text-white"
                    : "text-text-muted hover:bg-warm"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
                </svg>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ─── Books Tab ───────────────────────────────────────────── */}
        {activeTab === "books" && (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-heading text-2xl sm:text-3xl font-bold text-primary">Gestion des livres</h1>
                <p className="text-text-muted text-sm">{books.length} ouvrage{books.length > 1 ? "s" : ""} dans le catalogue</p>
              </div>
              <button
                onClick={() => { setEditingBook({ ...emptyBook }); setIsNew(true); }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary-light transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Ajouter un livre
              </button>
            </div>

            {loading ? (
              <div className="text-center py-16 text-text-muted">Chargement...</div>
            ) : (
              <div className="bg-white rounded-xl border border-warm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-warm">
                      <tr>
                        <th className="text-left px-4 py-3 font-semibold text-primary">Couverture</th>
                        <th className="text-left px-4 py-3 font-semibold text-primary">Titre</th>
                        <th className="text-left px-4 py-3 font-semibold text-primary hidden sm:table-cell">Statut</th>
                        <th className="text-left px-4 py-3 font-semibold text-primary hidden md:table-cell">Prix</th>
                        <th className="text-left px-4 py-3 font-semibold text-primary hidden lg:table-cell">Catégorie</th>
                        <th className="text-right px-4 py-3 font-semibold text-primary">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-warm">
                      {books.map((book) => (
                        <tr key={book.slug} className="hover:bg-secondary/50">
                          <td className="px-4 py-3">
                            <div className="w-12 h-16 relative rounded overflow-hidden bg-warm">
                              <Image src={book.coverImage} alt="" fill className="object-cover" sizes="48px" />
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-medium text-primary line-clamp-1">{book.title}</p>
                            <p className="text-text-muted text-xs">{book.slug}</p>
                          </td>
                          <td className="px-4 py-3 hidden sm:table-cell">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              book.status === "available" ? "bg-green-100 text-green-800"
                                : book.status === "out-of-stock" ? "bg-red-100 text-red-700"
                                : book.status === "coming-soon" ? "bg-amber-100 text-amber-800"
                                : "bg-blue-100 text-blue-800"
                            }`}>
                              {STATUS_OPTIONS.find((s) => s.value === book.status)?.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell text-text-muted">
                            {book.price ? `${new Intl.NumberFormat("fr-FR").format(book.price)} FCFA` : "—"}
                          </td>
                          <td className="px-4 py-3 hidden lg:table-cell text-text-muted">
                            {CATEGORY_OPTIONS.find((c) => c.value === book.category)?.label}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => { setEditingBook({ ...book }); setIsNew(false); }} className="px-3 py-1.5 rounded-lg bg-accent/20 text-primary text-xs font-medium hover:bg-accent/30 transition-colors">Modifier</button>
                              <button onClick={() => handleDelete(book.slug, book.title)} className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs font-medium hover:bg-red-100 transition-colors">Supprimer</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* ─── Margins Tab ─────────────────────────────────────────── */}
        {activeTab === "margins" && (
          <>
            <div className="mb-8">
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-primary">Marges & Coûts</h1>
              <p className="text-text-muted text-sm">Gérez les coûts d&apos;impression, transport, et calculez vos marges par livre</p>
            </div>
            <MarginsTab books={books} showMessage={showMessage} />
          </>
        )}

        {/* ─── POS Tab ─────────────────────────────────────────────── */}
        {activeTab === "pos" && (
          <>
            <div className="mb-6">
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-primary">Point de vente</h1>
              <p className="text-text-muted text-sm">Librairie physique — Encaissez les ventes en boutique</p>
            </div>
            <POSTab books={books} showMessage={showMessage} />
          </>
        )}
      </div>

      {/* ─── Book Edit Modal ──────────────────────────────────────── */}
      {editingBook && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl m-4 mb-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-warm">
              <h2 className="font-heading text-xl font-bold text-primary">{isNew ? "Ajouter un livre" : "Modifier le livre"}</h2>
              <button onClick={() => setEditingBook(null)} className="text-text-muted hover:text-primary">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-text mb-1">Titre *</label>
                <input type="text" value={editingBook.title || ""} onChange={(e) => { const title = e.target.value; setEditingBook((prev) => ({ ...prev, title, ...(isNew ? { slug: slugify(title) } : {}) })); }} className="w-full px-3 py-2 rounded-lg border border-warm text-sm focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">Slug *</label>
                <input type="text" value={editingBook.slug || ""} onChange={(e) => setEditingBook((prev) => ({ ...prev, slug: e.target.value }))} disabled={!isNew} className="w-full px-3 py-2 rounded-lg border border-warm text-sm focus:outline-none focus:border-accent disabled:bg-warm disabled:text-text-muted" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">Auteur</label>
                <input type="text" value={editingBook.author || ""} onChange={(e) => setEditingBook((prev) => ({ ...prev, author: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-warm text-sm focus:outline-none focus:border-accent" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Catégorie</label>
                  <select value={editingBook.category || "livre-papier"} onChange={(e) => setEditingBook((prev) => ({ ...prev, category: e.target.value as BookCategory }))} className="w-full px-3 py-2 rounded-lg border border-warm text-sm focus:outline-none focus:border-accent">
                    {CATEGORY_OPTIONS.map((c) => (<option key={c.value} value={c.value}>{c.label}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Statut</label>
                  <select value={editingBook.status || "available"} onChange={(e) => setEditingBook((prev) => ({ ...prev, status: e.target.value as BookStatus }))} className="w-full px-3 py-2 rounded-lg border border-warm text-sm focus:outline-none focus:border-accent">
                    {STATUS_OPTIONS.map((s) => (<option key={s.value} value={s.value}>{s.label}</option>))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Prix (FCFA)</label>
                  <input type="number" value={editingBook.price ?? ""} onChange={(e) => setEditingBook((prev) => ({ ...prev, price: e.target.value ? Number(e.target.value) : null }))} className="w-full px-3 py-2 rounded-lg border border-warm text-sm focus:outline-none focus:border-accent" placeholder="5000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Année</label>
                  <input type="number" value={editingBook.year ?? ""} onChange={(e) => setEditingBook((prev) => ({ ...prev, year: e.target.value ? Number(e.target.value) : null }))} className="w-full px-3 py-2 rounded-lg border border-warm text-sm focus:outline-none focus:border-accent" placeholder="2024" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">Formats</label>
                <div className="flex gap-3">
                  {FORMAT_OPTIONS.map((f) => (
                    <label key={f.value} className="flex items-center gap-1.5 text-sm">
                      <input type="checkbox" checked={editingBook.formats?.includes(f.value) || false} onChange={(e) => { const formats = editingBook.formats || []; setEditingBook((prev) => ({ ...prev, formats: e.target.checked ? [...formats, f.value] : formats.filter((x) => x !== f.value) })); }} className="rounded border-warm text-accent focus:ring-accent" />
                      {f.label}
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={editingBook.featured || false} onChange={(e) => setEditingBook((prev) => ({ ...prev, featured: e.target.checked }))} className="rounded border-warm text-accent focus:ring-accent" />
                  <label className="text-sm font-medium text-text">Livre à la une</label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Badge</label>
                  <input type="text" value={editingBook.badge || ""} onChange={(e) => setEditingBook((prev) => ({ ...prev, badge: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-warm text-sm focus:outline-none focus:border-accent" placeholder="Best-Seller, Nouveau..." />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">Description courte</label>
                <textarea value={editingBook.description || ""} onChange={(e) => setEditingBook((prev) => ({ ...prev, description: e.target.value }))} rows={3} className="w-full px-3 py-2 rounded-lg border border-warm text-sm focus:outline-none focus:border-accent resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">Description longue</label>
                <textarea value={editingBook.longDescription || ""} onChange={(e) => setEditingBook((prev) => ({ ...prev, longDescription: e.target.value }))} rows={4} className="w-full px-3 py-2 rounded-lg border border-warm text-sm focus:outline-none focus:border-accent resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">Image de couverture</label>
                <div className="flex items-end gap-4">
                  {editingBook.coverImage && (
                    <div className="w-20 h-28 relative rounded overflow-hidden bg-warm shrink-0">
                      <Image src={editingBook.coverImage} alt="" fill className="object-cover" sizes="80px" />
                    </div>
                  )}
                  <div className="flex-1">
                    <input type="text" value={editingBook.coverImage || ""} onChange={(e) => setEditingBook((prev) => ({ ...prev, coverImage: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-warm text-sm focus:outline-none focus:border-accent mb-2" placeholder="/images/books/mon-livre.jpg" />
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-warm text-primary text-xs font-medium cursor-pointer hover:bg-accent/20 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Uploader une image
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Lien Amazon</label>
                  <input type="url" value={editingBook.amazonLink || ""} onChange={(e) => setEditingBook((prev) => ({ ...prev, amazonLink: e.target.value || null }))} className="w-full px-3 py-2 rounded-lg border border-warm text-sm focus:outline-none focus:border-accent" placeholder="https://amazon.com/..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">ISBN</label>
                  <input type="text" value={editingBook.isbn || ""} onChange={(e) => setEditingBook((prev) => ({ ...prev, isbn: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-warm text-sm focus:outline-none focus:border-accent" />
                </div>
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-text mb-1">Nombre de pages</label>
                <input type="number" value={editingBook.pages ?? ""} onChange={(e) => setEditingBook((prev) => ({ ...prev, pages: e.target.value ? Number(e.target.value) : null }))} className="w-full px-3 py-2 rounded-lg border border-warm text-sm focus:outline-none focus:border-accent" />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-warm">
              <button onClick={() => setEditingBook(null)} className="px-4 py-2 rounded-lg border border-warm text-text-muted text-sm font-medium hover:bg-warm transition-colors">Annuler</button>
              <button onClick={handleSave} disabled={saving} className="px-6 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-light transition-colors disabled:opacity-50">
                {saving ? "Enregistrement..." : isNew ? "Ajouter" : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
