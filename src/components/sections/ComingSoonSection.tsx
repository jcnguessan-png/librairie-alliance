"use client";

import Image from "next/image";
import type { Book } from "@/data/books";
import { getNotifyLink } from "@/lib/whatsapp";
import { FadeInUp } from "@/components/ui/MotionDiv";

interface ComingSoonSectionProps {
  books: Book[];
}

export default function ComingSoonSection({ books }: ComingSoonSectionProps) {
  if (books.length === 0) return null;

  const book = books[0];

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-light p-8 sm:p-12 lg:p-16">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            <FadeInUp>
              <div>
                <span className="inline-block px-4 py-1.5 rounded-full bg-burgundy text-white font-semibold text-sm mb-6">
                  {book.badge || "Bientôt disponible"}
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
                  {book.title}
                </h2>
                <p className="text-white/70 leading-relaxed mb-8">
                  {book.description}
                </p>
                <a
                  href={getNotifyLink(book.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent text-primary font-semibold hover:bg-accent-light transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  Me notifier via WhatsApp
                </a>
              </div>
            </FadeInUp>

            <FadeInUp delay={0.2}>
              <div className="flex justify-center">
                <div className="relative w-48 sm:w-56 opacity-80">
                  <Image
                    src={book.coverImage}
                    alt={book.title}
                    width={224}
                    height={320}
                    className="w-full h-auto rounded-lg shadow-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent rounded-lg" />
                </div>
              </div>
            </FadeInUp>
          </div>
        </div>
      </div>
    </section>
  );
}
