"use client";

import Image from "next/image";
import type { Book } from "@/data/books";
import { FadeInUp } from "@/components/ui/MotionDiv";

const platforms = [
  {
    name: "Spotify",
    color: "#1DB954",
    href: "https://open.spotify.com/",
    description: "Écoutez gratuitement avec un compte Spotify",
  },
  {
    name: "Apple Podcasts",
    color: "#A855F7",
    href: "https://podcasts.apple.com/",
    description: "Disponible sur tous les appareils Apple",
  },
  {
    name: "Audible",
    color: "#FF9900",
    href: "https://www.audible.com/",
    description: "La plateforme de référence pour les livres audio",
  },
  {
    name: "Amazon Music",
    color: "#00A8E1",
    href: "https://music.amazon.com/",
    description: "Inclus avec Amazon Prime",
  },
];

interface AudioPageClientProps {
  audioBooks: Book[];
}

export default function AudioPageClient({ audioBooks }: AudioPageClientProps) {
  return (
    <div className="pt-20 sm:pt-24">
      {/* Header */}
      <section className="bg-primary py-12 sm:py-16 relative overflow-hidden">
        {/* Sound wave decoration */}
        <div className="absolute inset-0 opacity-5">
          <svg
            className="w-full h-full"
            viewBox="0 0 1200 300"
            fill="none"
          >
            {[...Array(30)].map((_, i) => (
              <rect
                key={i}
                x={40 * i + 5}
                y={150 - (Math.sin(i * 0.4) * 80 + 30)}
                width="6"
                height={(Math.sin(i * 0.4) * 80 + 30) * 2}
                rx="3"
                fill="#C8A96E"
              />
            ))}
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent font-semibold text-sm mb-4">
            Livres Audio
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Écoutez nos livres, partout, à tout moment
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto">
            Les ouvrages du Pasteur Amazou sont disponibles en livres audio
            sur les principales plateformes de streaming
          </p>
        </div>
      </section>

      {/* Platforms */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary text-center mb-10">
              Où écouter nos livres audio ?
            </h2>
          </FadeInUp>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {platforms.map((platform, index) => (
              <FadeInUp key={platform.name} delay={index * 0.1}>
                <a
                  href={platform.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-6 rounded-xl border border-warm hover:shadow-lg transition-shadow bg-white"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${platform.color}15` }}
                  >
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: platform.color }}
                    />
                  </div>
                  <h3 className="font-semibold text-primary mb-1">
                    {platform.name}
                  </h3>
                  <p className="text-text-muted text-sm">
                    {platform.description}
                  </p>
                </a>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* Audio Books list */}
      {audioBooks.length > 0 && (
        <section className="py-12 sm:py-16 bg-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInUp>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary mb-10">
                Nos livres audio disponibles
              </h2>
            </FadeInUp>

            <div className="space-y-6">
              {audioBooks.map((book, index) => (
                <FadeInUp key={book.slug} delay={index * 0.1}>
                  <div className="flex flex-col sm:flex-row gap-6 bg-white rounded-xl p-6 border border-warm">
                    <div className="shrink-0 w-24 sm:w-32">
                      <Image
                        src={book.coverImage}
                        alt={book.title}
                        width={128}
                        height={180}
                        className="w-full h-auto rounded-lg book-shadow"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading text-xl font-bold text-primary mb-2">
                        {book.title}
                      </h3>
                      <p className="text-text-muted text-sm mb-4">
                        {book.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {platforms.map((p) => (
                          <a
                            key={p.name}
                            href={p.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-warm hover:bg-warm transition-colors"
                          >
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: p.color }}
                            />
                            {p.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </FadeInUp>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* If no audio books yet */}
      {audioBooks.length === 0 && (
        <section className="py-16 sm:py-24 bg-secondary">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent/20 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-accent"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                />
              </svg>
            </div>
            <h2 className="font-heading text-2xl font-bold text-primary mb-4">
              Livres audio bientôt disponibles
            </h2>
            <p className="text-text-muted">
              Nos livres audio sont en cours de production. Revenez bientôt
              pour découvrir nos premiers titres disponibles en audio.
            </p>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary text-center mb-10">
              Comment écouter nos livres audio ?
            </h2>
          </FadeInUp>

          <div className="space-y-4">
            {[
              {
                q: "Comment accéder aux livres audio ?",
                a: "Nos livres audio sont disponibles sur les principales plateformes de streaming : Spotify, Apple Podcasts, Audible et Amazon Music. Cliquez sur la plateforme de votre choix pour y accéder.",
              },
              {
                q: "Les livres audio sont-ils gratuits ?",
                a: "Certains extraits sont disponibles gratuitement. Les versions complètes peuvent être achetées ou écoutées avec un abonnement selon la plateforme.",
              },
              {
                q: "Puis-je écouter hors connexion ?",
                a: "Oui, la plupart des plateformes permettent de télécharger les livres audio pour une écoute hors connexion.",
              },
            ].map((faq, index) => (
              <FadeInUp key={index} delay={index * 0.1}>
                <div className="bg-secondary rounded-xl p-6">
                  <h3 className="font-semibold text-primary mb-2">
                    {faq.q}
                  </h3>
                  <p className="text-text-muted text-sm leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
