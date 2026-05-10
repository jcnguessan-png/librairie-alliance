"use client";

import { useState, useMemo } from "react";
import type { Book, BookTheme } from "@/data/books";
import BookCard from "@/components/books/BookCard";
import { FadeInUp } from "@/components/ui/MotionDiv";

type SortOption = "recent" | "alpha" | "price-asc" | "price-desc";

interface CategoryOption {
  readonly value: string;
  readonly label: string;
}

interface ThemeOption {
  id: BookTheme;
  label: string;
}

interface CataloguePageClientProps {
  books: Book[];
  categories: readonly CategoryOption[];
  bookThemes: ThemeOption[];
}

export default function CataloguePageClient({
  books,
  categories,
  bookThemes,
}: CataloguePageClientProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeTheme, setActiveTheme] = useState<BookTheme | "all">("all");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [search, setSearch] = useState("");

  const filteredBooks = useMemo(() => {
    let result = [...books];

    if (activeCategory !== "all") {
      result = result.filter((book) => book.category === activeCategory);
    }

    if (activeTheme !== "all") {
      result = result.filter((book) => book.themes?.includes(activeTheme));
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.description.toLowerCase().includes(query)
      );
    }

    switch (sortBy) {
      case "alpha":
        result.sort((a, b) => a.title.localeCompare(b.title, "fr"));
        break;
      case "price-asc":
        result.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case "price-desc":
        result.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case "recent":
      default:
        result.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return (b.year ?? 0) - (a.year ?? 0);
        });
    }

    return result;
  }, [books, activeCategory, activeTheme, sortBy, search]);

  return (
    <div className="pt-20 sm:pt-24">
      <section className="bg-primary py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Catalogue complet
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto">
            Explorez tous les ouvrages du Pasteur Alexandre Amazou
          </p>
        </div>
      </section>

      <section className="bg-white border-b border-warm sticky top-16 sm:top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative w-full sm:w-72">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Rechercher un livre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-warm bg-secondary text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2.5 rounded-lg border border-warm bg-secondary text-sm focus:outline-none focus:border-accent"
            >
              <option value="recent">Plus récent</option>
              <option value="alpha">Alphabétique</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
            </select>
          </div>

          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 -mx-1 px-1">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat.value
                    ? "bg-primary text-white"
                    : "bg-secondary text-text-muted hover:bg-warm"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2 mt-3 overflow-x-auto pb-2 -mx-1 px-1">
            <button
              onClick={() => setActiveTheme("all")}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                activeTheme === "all"
                  ? "bg-accent text-primary border-accent"
                  : "bg-white text-text-muted border-warm hover:border-accent/50"
              }`}
            >
              Toutes les thématiques
            </button>
            {bookThemes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setActiveTheme(theme.id)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                  activeTheme === theme.id
                    ? "bg-accent text-primary border-accent"
                    : "bg-white text-text-muted border-warm hover:border-accent/50"
                }`}
              >
                {theme.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredBooks.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-text-muted text-lg">
                Aucun livre trouvé pour cette recherche.
              </p>
            </div>
          ) : (
            <>
              <p className="text-text-muted text-sm mb-6">
                {filteredBooks.length} ouvrage
                {filteredBooks.length > 1 ? "s" : ""} trouvé
                {filteredBooks.length > 1 ? "s" : ""}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {filteredBooks.map((book, index) => (
                  <FadeInUp key={book.slug} delay={Math.min(index * 0.05, 0.3)}>
                    <BookCard book={book} />
                  </FadeInUp>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
