import type { Metadata } from "next";
import { getGeneralLink } from "@/lib/whatsapp";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez la Librairie d'Alliance de la Cathédrale ABMCI. Commandez vos livres via WhatsApp.",
};

export default function ContactPage() {
  return (
    <div className="pt-20 sm:pt-24">
      {/* Header */}
      <section className="bg-primary py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Contactez la Librairie d&apos;Alliance
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto">
            Pour toute commande ou renseignement, contactez-nous directement
            via WhatsApp
          </p>
        </div>
      </section>

      {/* Contact info */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* WhatsApp main CTA */}
            <div className="space-y-6">
              <a
                href={getGeneralLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-6 rounded-xl bg-[#25D366]/10 border-2 border-[#25D366]/30 hover:border-[#25D366] transition-colors"
              >
                <div className="shrink-0 w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center">
                  <svg
                    className="w-7 h-7 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div>
                  <p className="font-heading font-bold text-lg text-primary">
                    WhatsApp
                  </p>
                  <p className="text-[#25D366] font-semibold">
                    +225 07 05 32 06 07
                  </p>
                  <p className="text-text-muted text-sm">
                    Cliquez pour nous écrire
                  </p>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:librairie@abmci.com"
                className="flex items-center gap-4 p-6 rounded-xl bg-secondary border border-warm hover:border-accent transition-colors"
              >
                <div className="shrink-0 w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-accent"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-heading font-bold text-lg text-primary">
                    Email
                  </p>
                  <p className="text-accent font-semibold">
                    librairie@abmci.com
                  </p>
                </div>
              </a>

              {/* Address */}
              <div className="flex items-start gap-4 p-6 rounded-xl bg-secondary border border-warm">
                <div className="shrink-0 w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-accent"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-heading font-bold text-lg text-primary">
                    Adresse
                  </p>
                  <p className="text-text-muted">
                    Cathédrale ABMCI — Cité de la Grâce
                  </p>
                  <p className="text-text-muted">
                    Riviera Palmeraie, Cocody
                  </p>
                  <p className="text-text-muted">
                    Abidjan, Côte d&apos;Ivoire
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4 p-6 rounded-xl bg-secondary border border-warm">
                <div className="shrink-0 w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-accent"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>
                <div>
                  <p className="font-heading font-bold text-lg text-primary">
                    Horaires d&apos;ouverture
                  </p>
                  <p className="text-text-muted">
                    Mardi - Vendredi : 9h00 - 17h00
                  </p>
                  <p className="text-text-muted">Samedi : 9h00 - 14h00</p>
                  <p className="text-text-muted">
                    Dimanche : Avant et après le culte
                  </p>
                  <p className="text-text-muted">Lundi : Fermé</p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="rounded-xl overflow-hidden border border-warm h-[400px] md:h-full min-h-[400px]">
              <ContactClient />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
