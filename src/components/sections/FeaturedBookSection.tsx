"use client";

import Image from "next/image";
import type { Book } from "@/data/books";
import { getOrderLink } from "@/lib/whatsapp";
import { FadeInUp } from "@/components/ui/MotionDiv";
import Link from "next/link";

interface FeaturedBookSectionProps {
  book?: Book;
}

export default function FeaturedBookSection({ book }: FeaturedBookSectionProps) {
  if (!book) return null;

  return (
    <section className="py-16 sm:py-24 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent font-semibold text-sm mb-4">
              Livre à la une
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-primary">
              {book.badge || "Dernier ouvrage"}
            </h2>
          </div>
        </FadeInUp>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
          <FadeInUp delay={0.1}>
            <div className="flex justify-center">
              <div className="relative w-64 sm:w-72 lg:w-80">
                <div className="book-shadow rounded-lg overflow-hidden">
                  <Image
                    src={book.coverImage}
                    alt={book.title}
                    width={320}
                    height={450}
                    className="w-full h-auto"
                    priority
                  />
                </div>
                <div className="absolute -top-3 -right-3 bg-accent text-primary px-4 py-2 rounded-full font-semibold text-sm shadow-lg">
                  {book.badge}
                </div>
              </div>
            </div>
          </FadeInUp>

          <FadeInUp delay={0.2}>
            <div>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-primary mb-4">
                {book.title}
              </h3>
              <p className="text-text-muted mb-2">Par {book.author}</p>
              <p className="text-text leading-relaxed mb-8">
                {book.longDescription || book.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={getOrderLink(book.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-light transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Commander sur WhatsApp
                </a>
                <Link
                  href={`/catalogue/${book.slug}`}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-colors"
                >
                  En savoir plus
                </Link>
              </div>
            </div>
          </FadeInUp>
        </div>
      </div>
    </section>
  );
}
