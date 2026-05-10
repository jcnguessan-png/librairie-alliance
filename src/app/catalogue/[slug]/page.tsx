import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllBooks, getBookBySlug } from "@/lib/books";
import { formatPrice, getStatusLabel, getStatusColor, cn } from "@/lib/utils";
import { getOrderLink, getNotifyLink } from "@/lib/whatsapp";
import BookCard from "@/components/books/BookCard";
import BookDetailClient from "./BookDetailClient";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const books = await getAllBooks();
  return books.map((book) => ({ slug: book.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const book = await getBookBySlug(slug);
  if (!book) return { title: "Livre introuvable" };

  return {
    title: book.title,
    description: book.description,
    openGraph: {
      title: book.title,
      description: book.description,
      type: "book",
      authors: [book.author],
      images: [{ url: book.coverImage }],
    },
  };
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = await getBookBySlug(slug);
  if (!book) notFound();

  const isAvailable = book.status === "available";
  const isComingSoon = book.status === "coming-soon";
  const whatsappLink = isAvailable
    ? getOrderLink(book.title)
    : getNotifyLink(book.title);

  // Related books (same category, excluding current)
  const allBooks = await getAllBooks();
  const relatedBooks = allBooks
    .filter((b) => b.slug !== book.slug && b.status !== "coming-soon")
    .slice(0, 3);

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    author: {
      "@type": "Person",
      name: book.author,
    },
    description: book.description,
    image: book.coverImage,
    ...(book.isbn && { isbn: book.isbn }),
    ...(book.price && {
      offers: {
        "@type": "Offer",
        price: book.price,
        priceCurrency: "XOF",
        availability:
          book.status === "available"
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="pt-20 sm:pt-24">
        {/* Breadcrumb */}
        <div className="bg-secondary border-b border-warm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center gap-2 text-sm text-text-muted">
              <Link href="/" className="hover:text-primary transition-colors">
                Accueil
              </Link>
              <span>/</span>
              <Link
                href="/catalogue"
                className="hover:text-primary transition-colors"
              >
                Catalogue
              </Link>
              <span>/</span>
              <span className="text-primary font-medium truncate">
                {book.title}
              </span>
            </nav>
          </div>
        </div>

        {/* Book detail */}
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
              {/* Cover */}
              <div className="flex justify-center">
                <div className="relative w-full max-w-sm">
                  <div className="book-shadow rounded-lg overflow-hidden">
                    <Image
                      src={book.coverImage}
                      alt={book.title}
                      width={400}
                      height={560}
                      className="w-full h-auto"
                      priority
                    />
                  </div>
                  {book.badge && (
                    <span
                      className={cn(
                        "absolute top-4 left-4 px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg",
                        book.badge === "Best-Seller" ||
                          book.badge === "Dernier ouvrage"
                          ? "bg-accent text-primary"
                          : "bg-burgundy text-white"
                      )}
                    >
                      {book.badge}
                    </span>
                  )}
                </div>
              </div>

              {/* Info */}
              <div>
                <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-3">
                  {book.title}
                </h1>
                <p className="text-text-muted mb-6">Par {book.author}</p>

                {/* Meta info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-secondary rounded-lg p-3">
                    <p className="text-xs text-text-muted">Prix</p>
                    <p className="font-semibold text-primary">
                      {formatPrice(book.price)}
                    </p>
                  </div>
                  <div className="bg-secondary rounded-lg p-3">
                    <p className="text-xs text-text-muted">Statut</p>
                    <span
                      className={cn(
                        "inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1",
                        getStatusColor(book.status)
                      )}
                    >
                      {getStatusLabel(book.status)}
                    </span>
                  </div>
                  <div className="bg-secondary rounded-lg p-3">
                    <p className="text-xs text-text-muted">Format</p>
                    <p className="font-semibold text-primary capitalize">
                      {book.formats.join(", ")}
                    </p>
                  </div>
                  {book.year && (
                    <div className="bg-secondary rounded-lg p-3">
                      <p className="text-xs text-text-muted">Année</p>
                      <p className="font-semibold text-primary">{book.year}</p>
                    </div>
                  )}
                  {book.pages && (
                    <div className="bg-secondary rounded-lg p-3">
                      <p className="text-xs text-text-muted">Pages</p>
                      <p className="font-semibold text-primary">
                        {book.pages}
                      </p>
                    </div>
                  )}
                  {book.isbn && (
                    <div className="bg-secondary rounded-lg p-3">
                      <p className="text-xs text-text-muted">ISBN</p>
                      <p className="font-semibold text-primary text-xs">
                        {book.isbn}
                      </p>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h2 className="font-heading text-lg font-semibold text-primary mb-3">
                    Description
                  </h2>
                  <p className="text-text-muted leading-relaxed">
                    {book.longDescription || book.description}
                  </p>
                </div>

                {/* Audio excerpt */}
                {book.audioExcerpt && (
                  <BookDetailClient audioSrc={book.audioExcerpt} />
                )}

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg font-semibold transition-colors",
                      isAvailable
                        ? "bg-primary text-white hover:bg-primary-light"
                        : isComingSoon
                          ? "bg-accent text-primary hover:bg-accent-light"
                          : "bg-gray-200 text-text-muted cursor-not-allowed"
                    )}
                  >
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    {isAvailable
                      ? "Commander via WhatsApp"
                      : isComingSoon
                        ? "Me notifier"
                        : "Indisponible"}
                  </a>
                  {book.amazonLink && (
                    <a
                      href={book.amazonLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-colors"
                    >
                      Voir sur Amazon
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related books */}
        {relatedBooks.length > 0 && (
          <section className="py-12 sm:py-16 bg-secondary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="font-heading text-2xl font-bold text-primary mb-8">
                Vous aimerez aussi
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedBooks.map((b) => (
                  <BookCard key={b.slug} book={b} />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
