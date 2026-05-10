"use client";

import { FadeInUp } from "@/components/ui/MotionDiv";

export default function AmazonSection() {
  return (
    <section className="py-12 sm:py-16 bg-warm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8">
            <div className="text-center sm:text-left">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary mb-2">
                Retrouvez nos ouvrages sur Amazon
              </h2>
              <p className="text-text-muted">
                Livraison internationale disponible via Amazon
              </p>
            </div>
            <a
              href="https://www.amazon.com/s?k=Alexandre+Amazou"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-3 px-8 py-3.5 rounded-lg bg-[#FF9900] text-white font-semibold hover:bg-[#E88B00] transition-colors shadow-lg"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.045 18.02c.072-.116.187-.124.348-.022 2.344 1.058 4.844 1.588 7.5 1.588 2.67 0 5.148-.563 7.434-1.688.18-.073.288-.025.378.125.09.15.044.268-.11.355-2.355 1.285-4.99 1.927-7.906 1.927-2.63 0-5.114-.6-7.456-1.805-.131-.065-.18-.15-.188-.48z" />
                <path d="M6.394 14.72c.82-.17 1.64-.18 2.47-.1.91.12 1.77.36 2.56.79.32.18.5.41.43.72-.06.28-.33.43-.72.38-.57-.07-1.1-.28-1.63-.49-.93-.39-1.88-.59-2.87-.5-.22.02-.46.06-.69.08-.27.02-.46-.1-.47-.35-.01-.27.16-.45.46-.5l.47-.03z" />
              </svg>
              Voir sur Amazon
            </a>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
