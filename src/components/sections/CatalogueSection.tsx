"use client";

import type { Book } from "@/data/books";
import BookCard from "@/components/books/BookCard";
import { FadeInUp } from "@/components/ui/MotionDiv";
import Link from "next/link";

interface CatalogueSectionProps {
  books: Book[];
}

export default function CatalogueSection({ books }: CatalogueSectionProps) {
  // Show only first 6 books on homepage
  const displayBooks = books.filter((b) => b.status !== "coming-soon").slice(0, 6);

  return (
    <section id="catalogue" className="py-16 sm:py-24 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-primary mb-4">
              Nos ouvrages
            </h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              Découvrez les livres du Pasteur Alexandre Amazou pour nourrir
              votre esprit et transformer votre vie
            </p>
          </div>
        </FadeInUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {displayBooks.map((book, index) => (
            <FadeInUp key={book.slug} delay={index * 0.1}>
              <BookCard book={book} />
            </FadeInUp>
          ))}
        </div>

        <FadeInUp delay={0.3}>
          <div className="text-center mt-12">
            <Link
              href="/catalogue"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary-light transition-colors"
            >
              Voir tout le catalogue
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
