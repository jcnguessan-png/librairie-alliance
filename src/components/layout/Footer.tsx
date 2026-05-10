import Link from "next/link";
import { getGeneralLink } from "@/lib/whatsapp";

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <span className="text-accent font-heading font-bold text-lg">
                  LA
                </span>
              </div>
              <div>
                <p className="font-heading font-bold text-lg text-white">
                  Librairie d&apos;Alliance
                </p>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Une initiative de la Cathédrale ABMCI — Cité de la Grâce, Abidjan,
              Côte d&apos;Ivoire.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-heading font-semibold text-accent mb-4">
              Navigation
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Accueil" },
                { href: "/catalogue", label: "Catalogue" },
                { href: "/livres-audio", label: "Livres Audio" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-accent text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-semibold text-accent mb-4">
              Contact
            </h3>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <a
                  href={getGeneralLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  WhatsApp : +225 07 05 32 06 07
                </a>
              </li>
              <li>
                <a
                  href="mailto:librairie@abmci.com"
                  className="hover:text-accent transition-colors"
                >
                  librairie@abmci.com
                </a>
              </li>
              <li>Riviera Palmeraie, Cocody</li>
              <li>Abidjan, Côte d&apos;Ivoire</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-heading font-semibold text-accent mb-4">
              Suivez-nous
            </h3>
            <div className="flex gap-3">
              {[
                {
                  label: "Facebook",
                  href: "https://facebook.com/abmci",
                  icon: (
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                  ),
                },
                {
                  label: "YouTube",
                  href: "https://youtube.com/@abmci",
                  icon: (
                    <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.35 29 29 0 00-.46-5.33zM9.75 15.02V8.48l5.75 3.27-5.75 3.27z" />
                  ),
                },
                {
                  label: "Instagram",
                  href: "https://instagram.com/abmci",
                  icon: (
                    <>
                      <rect
                        x="2"
                        y="2"
                        width="20"
                        height="20"
                        rx="5"
                        ry="5"
                      />
                      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </>
                  ),
                },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent/20 transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-white/70"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    {social.icon}
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-white/40">
          <p>&copy; 2026 Librairie d&apos;Alliance ABMCI. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
