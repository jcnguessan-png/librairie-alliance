import Link from "next/link";
import Image from "next/image";
import type { Book } from "@/data/books";
import { formatPrice, getStatusLabel, getStatusColor, cn } from "@/lib/utils";
import { getOrderLink, getNotifyLink } from "@/lib/whatsapp";

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const isAvailable = book.status === "available";
  const isComingSoon = book.status === "coming-soon";
  const whatsappLink = isAvailable
    ? getOrderLink(book.title)
    : getNotifyLink(book.title);

  return (
    <div className="group bg-white rounded-xl overflow-hidden border border-warm hover:shadow-lg transition-shadow duration-300">
      <Link href={`/catalogue/${book.slug}`} className="block">
        <div className="relative aspect-[3/4] bg-secondary overflow-hidden">
          <Image
            src={book.coverImage}
            alt={book.title}
            fill
            className="object-cover book-shadow group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {book.badge && (
            <span
              className={cn(
                "absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold",
                book.badge === "Best-Seller" || book.badge === "Dernier ouvrage"
                  ? "bg-accent text-primary"
                  : "bg-burgundy text-white"
              )}
            >
              {book.badge}
            </span>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/catalogue/${book.slug}`}>
          <h3 className="font-heading font-semibold text-primary text-sm sm:text-base leading-tight mb-2 hover:text-accent transition-colors line-clamp-2">
            {book.title}
          </h3>
        </Link>

        <div className="flex items-center justify-between mb-3">
          <span
            className={cn(
              "text-xs px-2 py-0.5 rounded-full font-medium",
              getStatusColor(book.status)
            )}
          >
            {getStatusLabel(book.status)}
          </span>
          <span className="text-sm font-semibold text-primary">
            {formatPrice(book.price)}
          </span>
        </div>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "block w-full text-center py-2.5 rounded-lg text-sm font-semibold transition-all",
            isAvailable
              ? "bg-primary text-white hover:bg-primary-light"
              : isComingSoon
                ? "bg-accent/20 text-primary hover:bg-accent/30"
                : "bg-gray-100 text-text-muted cursor-not-allowed"
          )}
        >
          {isAvailable
            ? "Commander"
            : isComingSoon
              ? "Me notifier"
              : "Indisponible"}
        </a>
      </div>
    </div>
  );
}
