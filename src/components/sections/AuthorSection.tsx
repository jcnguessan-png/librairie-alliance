"use client";

import { FadeInUp } from "@/components/ui/MotionDiv";

export default function AuthorSection() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <FadeInUp>
            <div className="relative">
              <div className="aspect-[3/4] bg-secondary rounded-2xl overflow-hidden">
                {/* Placeholder for author photo */}
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/10">
                  <div className="text-center p-8">
                    <div className="w-32 h-32 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <span className="font-heading text-4xl text-primary font-bold">
                        AA
                      </span>
                    </div>
                    <p className="text-text-muted text-sm">
                      Photo du Pasteur Alexandre Amazou
                    </p>
                    <p className="text-text-muted text-xs mt-1">
                      (Remplacer par la vraie photo dans /public/images/author.jpg)
                    </p>
                  </div>
                </div>
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent/20 rounded-2xl -z-10" />
            </div>
          </FadeInUp>

          <FadeInUp delay={0.2}>
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent font-semibold text-sm mb-4">
                L&apos;auteur
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-primary mb-6">
                Pasteur Alexandre Amazou
              </h2>
              <div className="space-y-4 text-text-muted leading-relaxed">
                <p>
                  Le Pasteur Alexandre Amazou a eu sa vie transformée suite à un
                  appel au ministère d&apos;enseignement et de miracle par le
                  Seigneur Jésus — ministère confirmé par des signes et des
                  miracles lors d&apos;enseignements et séminaires au plan
                  national et international.
                </p>
                <p>
                  Président du Ministère International Semence de Vie et des
                  Églises Alliance Biblique Missionnaire Monde, il est
                  actuellement Pasteur principal de l&apos;église ABMCI dont le
                  siège est situé à Riviera Palmeraie (Cocody — Cathédrale),
                  avec des missions en Côte d&apos;Ivoire, en Afrique, au
                  Canada, en France et en Suisse.
                </p>
                <p>
                  Titulaire d&apos;un Doctorat en divinité de l&apos;Université
                  Biblique d&apos;Atlanta, il est également fondateur de
                  l&apos;Institut Supérieur de l&apos;Enseignement Biblique et
                  Missionnaire (ISBEM) et initiateur de la Conférence
                  d&apos;Abidjan qui rassemble près de 10 000 personnes chaque
                  année.
                </p>
              </div>

              {/* Quote */}
              <blockquote className="mt-8 pl-6 border-l-4 border-accent">
                <p className="font-quote italic text-lg text-primary">
                  &laquo; Nourrir l&apos;esprit, c&apos;est préparer l&apos;homme
                  à sa destinée divine. &raquo;
                </p>
                <cite className="mt-2 block text-sm text-text-muted not-italic">
                  — Pasteur Alexandre Amazou
                </cite>
              </blockquote>
            </div>
          </FadeInUp>
        </div>
      </div>
    </section>
  );
}
