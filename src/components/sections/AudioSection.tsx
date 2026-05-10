"use client";

import { FadeInUp } from "@/components/ui/MotionDiv";
import Link from "next/link";

export default function AudioSection() {
  return (
    <section className="py-16 sm:py-24 bg-primary relative overflow-hidden">
      {/* Sound wave decoration */}
      <div className="absolute inset-0 opacity-5">
        <svg
          className="w-full h-full"
          viewBox="0 0 1200 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {[...Array(20)].map((_, i) => (
            <rect
              key={i}
              x={60 * i + 10}
              y={200 - (Math.sin(i * 0.5) * 100 + 50)}
              width="8"
              height={(Math.sin(i * 0.5) * 100 + 50) * 2}
              rx="4"
              fill="#C8A96E"
            />
          ))}
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent font-semibold text-sm mb-4">
              Livres Audio
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4">
              Écoutez nos livres, partout, à tout moment
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Les ouvrages du Pasteur Amazou sont disponibles en livres audio
              sur les plateformes de streaming
            </p>
          </div>
        </FadeInUp>

        {/* Platform logos */}
        <FadeInUp delay={0.2}>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10 mb-12">
            {[
              { name: "Spotify", color: "#1DB954" },
              { name: "Apple Podcasts", color: "#A855F7" },
              { name: "Audible", color: "#FF9900" },
              { name: "Amazon Music", color: "#00A8E1" },
            ].map((platform) => (
              <div
                key={platform.name}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: platform.color }}
                />
                <span className="text-white/80 text-sm font-medium">
                  {platform.name}
                </span>
              </div>
            ))}
          </div>
        </FadeInUp>

        <FadeInUp delay={0.3}>
          <div className="text-center">
            <Link
              href="/livres-audio"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-accent text-primary font-semibold hover:bg-accent-light transition-colors"
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
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                />
              </svg>
              Découvrir les livres audio
            </Link>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
